"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { Modal } from "@/components/modal";
import {
  mergeCalendarItems,
  googleCalendarUrl,
  downloadICS,
  categoryStyle,
  type CalendarItem,
} from "@/lib/calendar";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  type EventInput,
} from "@/app/actions/calendar";
import {
  EVENT_CATEGORIES,
  type CalendarEvent,
  type EventCategory,
  type Task,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Trash2,
  Pencil,
  ExternalLink,
  Download,
  Lock,
  Loader2,
} from "lucide-react";

/* ── Date helpers (all local-time) ─────────────────────────────────────────── */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const sameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
const addMonths = (d: Date, n: number) => {
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return r;
};

/** 6-week (42-cell) matrix covering the month `cursor` sits in, Sunday-first. */
function monthMatrix(cursor: Date): Date[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });

const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toTimeInput = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/* ── Main ──────────────────────────────────────────────────────────────────── */

export function CalendarClient({
  events,
  tasks,
}: {
  events: CalendarEvent[];
  tasks: Task[];
}) {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState<"month" | "day">("month");
  const [cursor, setCursor] = useState<Date>(today);
  const [selected, setSelected] = useState<Date>(today);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [formDate, setFormDate] = useState<Date>(today);
  const [detail, setDetail] = useState<CalendarItem | null>(null);

  const items = useMemo(
    () => mergeCalendarItems(events, tasks),
    [events, tasks],
  );

  // Group items by local day for fast cell/agenda lookup.
  const byDay = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const it of items) {
      const k = dayKey(new Date(it.startsAt));
      (map.get(k) ?? map.set(k, []).get(k)!).push(it);
    }
    return map;
  }, [items]);

  // Map a merged item id back to its editable source event.
  const eventById = useMemo(() => {
    const m = new Map<string, CalendarEvent>();
    for (const e of events) m.set(`event-${e.id}`, e);
    return m;
  }, [events]);

  const openNew = (date: Date) => {
    setEditing(null);
    setFormDate(date);
    setFormOpen(true);
  };
  const openEdit = (item: CalendarItem) => {
    const ev = eventById.get(item.id);
    if (!ev) return;
    setEditing(ev);
    setFormDate(new Date(ev.startsAt));
    setDetail(null);
    setFormOpen(true);
  };

  const monthLabel = cursor.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
  const dayLabel = selected.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-in">
      <PageHeader
        title="Calendar"
        subtitle="Your schedule and CRM tasks — sync any item to Google Calendar"
        icon={CalendarDays}
        actions={
          <button
            onClick={() => openNew(view === "day" ? selected : today)}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> New event
          </button>
        }
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              view === "month"
                ? setCursor(addMonths(cursor, -1))
                : setSelected(addDays(selected, -1))
            }
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface text-slate-600 transition hover:bg-surface-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setCursor(today);
              setSelected(today);
            }}
            className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-sm font-semibold text-navy-900 transition hover:bg-surface-2"
          >
            Today
          </button>
          <button
            onClick={() =>
              view === "month"
                ? setCursor(addMonths(cursor, 1))
                : setSelected(addDays(selected, 1))
            }
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface text-slate-600 transition hover:bg-surface-2"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <p className="ml-1 font-display text-lg font-medium text-navy-900">
            {view === "month" ? monthLabel : dayLabel}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-hairline bg-surface-2 p-0.5">
          {(["month", "day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold capitalize transition",
                view === v
                  ? "bg-surface text-navy-900 shadow-sm"
                  : "text-slate-500 hover:text-navy-900",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "month" ? (
        <MonthView
          cursor={cursor}
          today={today}
          byDay={byDay}
          onPickDay={(d) => {
            setSelected(d);
            setView("day");
          }}
          onQuickAdd={openNew}
          onOpenItem={setDetail}
        />
      ) : (
        <DayView
          date={selected}
          items={byDay.get(dayKey(selected)) ?? []}
          onAdd={() => openNew(selected)}
          onOpenItem={setDetail}
        />
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        {["Personal", "Meeting", "Follow-up", "Review", "Reminder", "Task"].map(
          (c) => (
            <span key={c} className="flex items-center gap-1.5">
              <span
                className={cn("h-2 w-2 rounded-full", categoryStyle(c).dot)}
              />
              {c === "Task" ? "CRM task (read-only)" : c}
            </span>
          ),
        )}
      </div>

      {formOpen && (
        <EventFormModal
          key={editing?.id ?? "new"}
          editing={editing}
          defaultDate={formDate}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            router.refresh();
          }}
        />
      )}

      {detail && (
        <DetailModal
          item={detail}
          onClose={() => setDetail(null)}
          onEdit={() => openEdit(detail)}
          onDeleted={() => {
            setDetail(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

/* ── Month view ────────────────────────────────────────────────────────────── */

function MonthView({
  cursor,
  today,
  byDay,
  onPickDay,
  onQuickAdd,
  onOpenItem,
}: {
  cursor: Date;
  today: Date;
  byDay: Map<string, CalendarItem[]>;
  onPickDay: (d: Date) => void;
  onQuickAdd: (d: Date) => void;
  onOpenItem: (i: CalendarItem) => void;
}) {
  const cells = monthMatrix(cursor);
  return (
    <div className="card overflow-hidden p-0">
      <div className="grid grid-cols-7 border-b border-hairline">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400"
          >
            <span className="hidden sm:inline">{w}</span>
            <span className="sm:hidden">{w[0]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = sameDay(d, today);
          const dayItems = byDay.get(dayKey(d)) ?? [];
          return (
            <button
              key={i}
              onClick={() => onPickDay(d)}
              className={cn(
                "group relative min-h-[84px] border-b border-r border-hairline p-1.5 text-left transition-colors last:border-r-0 hover:bg-surface-2 sm:min-h-[112px]",
                i % 7 === 6 && "border-r-0",
                !inMonth && "bg-slate-50/40",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    isToday
                      ? "bg-brand-600 text-white"
                      : inMonth
                        ? "text-navy-900"
                        : "text-slate-400",
                  )}
                >
                  {d.getDate()}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(d);
                  }}
                  role="button"
                  tabIndex={-1}
                  aria-label="Add event"
                  className="hidden h-5 w-5 items-center justify-center rounded text-slate-400 opacity-0 transition hover:bg-brand-50 hover:text-brand-600 group-hover:opacity-100 sm:flex"
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-1 space-y-1">
                {dayItems.slice(0, 3).map((it) => {
                  const st = categoryStyle(it.category);
                  return (
                    <span
                      key={it.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenItem(it);
                      }}
                      role="button"
                      tabIndex={-1}
                      className={cn(
                        "flex items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[11px] font-medium ring-1 ring-inset transition hover:brightness-95",
                        st.chip,
                      )}
                    >
                      <span
                        className={cn(
                          "hidden h-1.5 w-1.5 shrink-0 rounded-full sm:block",
                          st.dot,
                        )}
                      />
                      <span className="truncate">
                        {!it.allDay && (
                          <span className="tabular-nums opacity-70">
                            {timeLabel(it.startsAt)}{" "}
                          </span>
                        )}
                        {it.title}
                      </span>
                    </span>
                  );
                })}
                {dayItems.length > 3 && (
                  <span className="block px-1 text-[10px] font-semibold text-slate-400">
                    +{dayItems.length - 3} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Day view (agenda) ─────────────────────────────────────────────────────── */

function DayView({
  date,
  items,
  onAdd,
  onOpenItem,
}: {
  date: Date;
  items: CalendarItem[];
  onAdd: () => void;
  onOpenItem: (i: CalendarItem) => void;
}) {
  return (
    <div className="card p-0">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-600/15">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-navy-900">Nothing scheduled</p>
            <p className="mt-0.5 text-sm text-slate-500">
              {date.toLocaleDateString("en-PH", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              is wide open.
            </p>
          </div>
          <button
            onClick={onAdd}
            className="mt-1 flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Add an event
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-hairline">
          {items.map((it) => {
            const st = categoryStyle(it.category);
            return (
              <li key={it.id}>
                <button
                  onClick={() => onOpenItem(it)}
                  className="flex w-full items-start gap-4 px-4 py-3.5 text-left transition hover:bg-surface-2"
                >
                  <div className="w-20 shrink-0 pt-0.5 text-right">
                    {it.allDay ? (
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        All day
                      </span>
                    ) : (
                      <span className="text-sm font-semibold tabular-nums text-navy-900">
                        {timeLabel(it.startsAt)}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", st.dot)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-semibold text-navy-900">
                      <span className="truncate">{it.title}</span>
                      {it.readOnly && (
                        <Lock className="h-3 w-3 shrink-0 text-slate-400" />
                      )}
                    </p>
                    {it.meta && (
                      <p className="truncate text-xs text-slate-500">{it.meta}</p>
                    )}
                    {it.location && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="h-3 w-3" /> {it.location}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                      st.chip,
                    )}
                  >
                    {it.category}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ── Create / edit form ────────────────────────────────────────────────────── */

const inputCls =
  "w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

function EventFormModal({
  editing,
  defaultDate,
  onClose,
  onSaved,
}: {
  editing: CalendarEvent | null;
  defaultDate: Date;
  onClose: () => void;
  onSaved: () => void;
}) {
  const initStart = editing ? new Date(editing.startsAt) : null;
  const initEnd = editing ? new Date(editing.endsAt) : null;
  // Sensible defaults for a new event: next full hour, one hour long.
  const base = new Date(defaultDate);
  const defStart = new Date(base);
  if (!editing) defStart.setHours(base.getHours() + 1, 0, 0, 0);
  const defEnd = new Date(defStart.getTime() + 60 * 60 * 1000);

  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState<EventCategory>(
    editing?.category ?? "Personal",
  );
  const [allDay, setAllDay] = useState(editing?.allDay ?? false);
  const [date, setDate] = useState(toDateInput(initStart ?? base));
  const [start, setStart] = useState(toTimeInput(initStart ?? defStart));
  const [end, setEnd] = useState(toTimeInput(initEnd ?? defEnd));
  const [location, setLocation] = useState(editing?.location ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    const [y, m, d] = date.split("-").map(Number);
    let startsAt: string;
    let endsAt: string;
    if (allDay) {
      startsAt = new Date(y, m - 1, d, 0, 0, 0).toISOString();
      endsAt = new Date(y, m - 1, d, 23, 59, 0).toISOString();
    } else {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      startsAt = new Date(y, m - 1, d, sh, sm).toISOString();
      endsAt = new Date(y, m - 1, d, eh, em).toISOString();
    }
    const input: EventInput = {
      title,
      category,
      allDay,
      startsAt,
      endsAt,
      location,
      description,
    };
    setSaving(true);
    const res = editing
      ? await updateEvent(editing.id, input)
      : await createEvent(input);
    setSaving(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    onSaved();
  };

  return (
    <Modal title={editing ? "Edit event" : "New event"} onClose={onClose}>
      <div className="space-y-4 px-5 py-5">
        {error && (
          <p className="rounded-lg border border-risk-500/20 bg-risk-500/5 px-3 py-2 text-sm text-risk-700">
            {error}
          </p>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-900">
            Title
          </span>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Client review with the Chuas"
            className={inputCls}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-900">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className={inputCls}
            >
              {EVENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-900">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </label>
        </div>

        {!allDay && (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-900">
                Starts
              </span>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-900">
                Ends
              </span>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={inputCls}
              />
            </label>
          </div>
        )}

        <label className="flex items-center gap-2.5 text-sm font-medium text-navy-900">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="h-4 w-4 rounded border-hairline text-brand-600 focus:ring-brand-500/30"
          />
          All-day event
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-900">
            Location <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="BGC, Taguig"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-900">
            Notes <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Agenda, prep, links…"
            className={cn(inputCls, "resize-none")}
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-hairline px-5 py-3.5">
        <button
          onClick={onClose}
          className="rounded-lg border border-hairline bg-surface px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-surface-2"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {editing ? "Save changes" : "Create event"}
        </button>
      </div>
    </Modal>
  );
}

/* ── Detail + sync ─────────────────────────────────────────────────────────── */

function DetailModal({
  item,
  onClose,
  onEdit,
  onDeleted,
}: {
  item: CalendarItem;
  onClose: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const st = categoryStyle(item.category);
  const start = new Date(item.startsAt);
  const dateStr = start.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeStr = item.allDay
    ? "All day"
    : `${timeLabel(item.startsAt)} – ${timeLabel(item.endsAt)}`;

  const remove = async () => {
    const rawId = item.id.replace(/^event-/, "");
    setBusy(true);
    const res = await deleteEvent(rawId);
    setBusy(false);
    if (!("error" in res)) onDeleted();
  };

  return (
    <Modal title="Event" onClose={onClose}>
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-start gap-3">
          <span className={cn("mt-1.5 h-3 w-3 shrink-0 rounded-full", st.dot)} />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-medium leading-snug text-navy-900">
              {item.title}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {dateStr} · {timeStr}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
              st.chip,
            )}
          >
            {item.category}
          </span>
        </div>

        {item.location && (
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" /> {item.location}
          </p>
        )}
        {item.description && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
            {item.description}
          </p>
        )}

        {item.readOnly && (
          <p className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5" /> Pulled from your CRM tasks — manage it
            in Follow-ups.
          </p>
        )}

        {/* Sync — one-way, no setup needed */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={googleCalendarUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <ExternalLink className="h-4 w-4" /> Add to Google
          </a>
          <button
            onClick={() => downloadICS(item)}
            className="flex items-center justify-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-2 text-sm font-semibold text-navy-900 transition hover:bg-surface-2"
          >
            <Download className="h-4 w-4" /> Download .ics
          </button>
        </div>
      </div>

      {!item.readOnly && (
        <div className="flex items-center justify-between border-t border-hairline px-5 py-3.5">
          <button
            onClick={remove}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-risk-600 transition hover:bg-risk-500/10 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-2 text-sm font-semibold text-navy-900 transition hover:bg-slate-200"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
        </div>
      )}
    </Modal>
  );
}
