import type { CalendarEvent, EventCategory, Task } from "./types";

/**
 * Calendar helpers — merge personal events with read-only CRM tasks into one
 * unified item list, and turn any item into a Google Calendar link or an .ics
 * file. Pure + client-safe (no server imports), so the calendar UI can call
 * these directly. The Google/ICS path is one-way (app → calendar) and needs no
 * OAuth scopes or external setup.
 */

export type CalendarKind = "event" | "task";

export interface CalendarItem {
  id: string;
  title: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  allDay: boolean;
  category: EventCategory | "Task";
  kind: CalendarKind;
  location?: string;
  description?: string;
  meta?: string; // small secondary line, e.g. "High · Follow-up"
  readOnly?: boolean; // CRM-sourced items can't be edited here
}

/* ── Merge ─────────────────────────────────────────────────────────────────── */

/** Personal events + CRM tasks (read-only) → one chronological item list. */
export function mergeCalendarItems(
  events: CalendarEvent[],
  tasks: Task[] = [],
): CalendarItem[] {
  const fromEvents: CalendarItem[] = events.map((e) => ({
    id: `event-${e.id}`,
    title: e.title,
    startsAt: e.startsAt,
    endsAt: e.endsAt,
    allDay: e.allDay,
    category: e.category,
    kind: "event",
    location: e.location || undefined,
    description: e.description || undefined,
  }));

  const fromTasks: CalendarItem[] = tasks
    .filter((t) => !t.done)
    .map((t) => {
      const start = new Date(t.due);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const meta = [t.priority, t.type, t.relatedTo].filter(Boolean).join(" · ");
      return {
        id: `task-${t.id}`,
        title: t.title,
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        allDay: false,
        category: "Task" as const,
        kind: "task" as const,
        meta,
        description: meta,
        readOnly: true,
      };
    });

  return [...fromEvents, ...fromTasks].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

/* ── Date formatting ───────────────────────────────────────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0");

/** UTC basic format for timed events: 20260623T140000Z */
function toUTCStamp(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Local date basic format for all-day events: 20260623 */
function toDateStamp(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

/** All-day end boundaries are exclusive (Google + iCalendar) — bump one day. */
function nextDayStamp(d: Date): string {
  const n = new Date(d);
  n.setDate(n.getDate() + 1);
  return toDateStamp(n);
}

/* ── Google Calendar link ──────────────────────────────────────────────────── */

/** A prefilled Google Calendar "create event" URL. Opens in a new tab; the user
 *  reviews and saves it into their own Google Calendar — one click, no OAuth. */
export function googleCalendarUrl(item: CalendarItem): string {
  const start = new Date(item.startsAt);
  const end = new Date(item.endsAt);
  const dates = item.allDay
    ? `${toDateStamp(start)}/${nextDayStamp(start)}`
    : `${toUTCStamp(start)}/${toUTCStamp(end)}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: item.title,
    dates,
  });
  if (item.description) params.set("details", item.description);
  if (item.location) params.set("location", item.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ── .ics export (works with Google, Apple, Outlook) ───────────────────────── */

/** Escape a text value per RFC 5545 (commas, semicolons, backslashes, newlines). */
function escICS(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** Build a single-event .ics document. */
export function toICS(item: CalendarItem): string {
  const start = new Date(item.startsAt);
  const end = new Date(item.endsAt);
  const dtStart = item.allDay
    ? `DTSTART;VALUE=DATE:${toDateStamp(start)}`
    : `DTSTART:${toUTCStamp(start)}`;
  const dtEnd = item.allDay
    ? `DTEND;VALUE=DATE:${nextDayStamp(start)}`
    : `DTEND:${toUTCStamp(end)}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WealthFlow//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${item.id}@wealthflow.app`,
    `DTSTAMP:${toUTCStamp(new Date())}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escICS(item.title)}`,
    item.description ? `DESCRIPTION:${escICS(item.description)}` : "",
    item.location ? `LOCATION:${escICS(item.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

/** Trigger a client-side .ics download for an item. */
export function downloadICS(item: CalendarItem): void {
  const blob = new Blob([toICS(item)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ── Shared category styling (month + day views share one source) ──────────── */

export const CATEGORY_STYLE: Record<string, { chip: string; dot: string }> = {
  Personal: { chip: "bg-brand-500/10 text-brand-700 ring-brand-500/20", dot: "bg-brand-500" },
  Meeting: { chip: "bg-ai-500/10 text-ai-700 ring-ai-500/20", dot: "bg-ai-500" },
  "Follow-up": { chip: "bg-gold-500/10 text-gold-600 ring-gold-500/20", dot: "bg-gold-500" },
  Review: { chip: "bg-money-500/10 text-money-700 ring-money-500/20", dot: "bg-money-500" },
  Reminder: { chip: "bg-slate-500/10 text-slate-600 ring-slate-500/20", dot: "bg-slate-400" },
  Task: { chip: "bg-slate-500/10 text-slate-600 ring-slate-500/20", dot: "bg-slate-400" },
};

export function categoryStyle(category: string) {
  return CATEGORY_STYLE[category] ?? CATEGORY_STYLE.Reminder;
}
