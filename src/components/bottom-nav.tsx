"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  KanbanSquare,
  UserCheck,
  Sparkles,
  Menu,
  Radar,
} from "lucide-react";

/**
 * Mobile bottom navigation — the Stitch "Advisor OS" mobile pattern. Replaces
 * the desktop sidebar on small screens (the full sidebar is still reachable via
 * the "Menu" tab, which opens the slide-in drawer). A floating action button
 * jumps straight to the AI Lead Generator. Hidden from `lg` up, where the fixed
 * sidebar takes over.
 */
const TABS: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/clients", label: "Clients", icon: UserCheck },
  { href: "/meetings", label: "AI", icon: Sparkles },
];

export function BottomNav({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {/* Floating action button — primary "create" action on mobile. */}
      <Link
        href="/lead-generator"
        aria-label="AI Lead Generator"
        className="press fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-950/25 ring-1 ring-white/10 lg:hidden"
      >
        <Radar className="h-6 w-6" />
      </Link>

      <nav
        aria-label="Primary"
        className="glass fixed inset-x-0 bottom-0 z-40 flex h-20 items-center justify-around border-t border-hairline px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex w-16 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                active ? "text-brand-600" : "text-slate-500",
              )}
            >
              <tab.icon className="h-[22px] w-[22px]" />
              {tab.label}
            </Link>
          );
        })}
        <button
          onClick={onMenu}
          aria-label="Open full menu"
          className="flex w-16 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-slate-500 transition-colors"
        >
          <Menu className="h-[22px] w-[22px]" />
          Menu
        </button>
      </nav>
    </>
  );
}
