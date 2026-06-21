"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import {
  COMPANY_MAP,
  DEFAULT_COMPANY,
  THEME_COOKIE,
  type InsuranceCompany,
} from "@/lib/insurance-companies";

// ── Tiny external store so the chosen company survives navigation and stays
// in sync with the <html data-theme> the server already rendered from the
// cookie. Using useSyncExternalStore (instead of useEffect+setState) avoids
// cascading renders and hydration mismatches for this client value.
const listeners = new Set<() => void>();

function readInitial(): string {
  if (typeof document === "undefined") return DEFAULT_COMPANY;
  const raw = document.documentElement.dataset.theme || DEFAULT_COMPANY;
  return raw === DEFAULT_COMPANY || COMPANY_MAP[raw] ? raw : DEFAULT_COMPANY;
}

let currentId = readInitial();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return currentId;
}
function getServerSnapshot() {
  // The server renders <html data-theme> from the cookie; the provider mirrors
  // that on the client via dataset, so the very first snapshot must agree.
  return DEFAULT_COMPANY;
}

function setStoredCompany(id: string) {
  // Allow the neutral default ("wealthflow") or any real company id.
  if (id !== DEFAULT_COMPANY && !COMPANY_MAP[id]) return;
  currentId = id;
  document.documentElement.dataset.theme = id;
  // Persist in a cookie so the server can render the right theme on next load
  // (no flash of the default palette).
  document.cookie = `${THEME_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
  listeners.forEach((l) => l());
}

type ThemeContextValue = {
  companyId: string;
  /** Null until the advisor has picked a real insurance company. */
  company: InsuranceCompany | null;
  /** Whether a real company (not the neutral default) is selected. */
  hasCompany: boolean;
  setCompany: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const companyId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const company = COMPANY_MAP[companyId] ?? null;

  const value = useMemo<ThemeContextValue>(
    () => ({
      companyId,
      company,
      hasCompany: company !== null,
      setCompany: setStoredCompany,
    }),
    [companyId, company],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
