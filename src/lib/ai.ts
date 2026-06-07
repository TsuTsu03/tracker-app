/** Small non-AI utilities used across client components. */

import type { Lead } from "./types";

export const AI_THINKING_MS = 900;

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/** Returns hot leads that haven't been contacted recently — used by dashboard. */
export function leadHealthAlerts(leads: Lead[]) {
  return leads
    .filter(
      (l) =>
        l.temperature === "Hot" &&
        l.stage !== "Closed Won" &&
        l.stage !== "Closed Lost",
    )
    .map((l) => ({
      lead: l,
      days: Math.floor(
        (Date.now() - new Date(l.lastContact).getTime()) / 86400000,
      ),
    }))
    .filter((x) => x.days >= 7)
    .sort((a, b) => b.days - a.days);
}
