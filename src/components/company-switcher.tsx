"use client";

import Link from "next/link";
import { useTheme } from "./theme-provider";

/**
 * Read-only company badge in the topbar. The advisor's insurance company is
 * fixed at registration, so this only *displays* it (and links to the product
 * library) — it never exposes other companies to switch into.
 */
export function CompanySwitcher() {
  const { company } = useTheme();

  if (!company) return null;

  return (
    <Link
      href="/company"
      title={`${company.name} — your company`}
      className="flex items-center gap-2 rounded-lg border border-hairline bg-surface py-2 pl-2.5 pr-3 text-sm font-medium text-navy-900 transition hover:border-brand-300 hover:bg-surface-2"
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ring-1 ring-black/10"
        style={{ background: company.color, color: company.onColor }}
      >
        {company.short
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)}
      </span>
      <span className="hidden max-w-[120px] truncate sm:block">
        {company.short}
      </span>
    </Link>
  );
}
