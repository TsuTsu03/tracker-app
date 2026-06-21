"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Radar,
  UserCheck,
  CalendarClock,
  GraduationCap,
  FileText,
  Send,
  ShieldCheck,
  Building2,
  BrainCircuit,
  BookOpen,
  Sparkles,
  X,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ai?: boolean;
};

type Section = {
  title: string;
  items: Item[];
  /** Only shown once the advisor has registered a company. */
  requiresCompany?: boolean;
};

const SECTIONS: Section[] = [
  {
    title: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Pipeline",
    items: [
      { href: "/leads", label: "Lead Database", icon: Users },
      { href: "/pipeline", label: "Sales Pipeline", icon: KanbanSquare },
      { href: "/lead-generator", label: "AI Lead Generator", icon: Radar, ai: true },
    ],
  },
  {
    title: "Relationships",
    items: [
      { href: "/clients", label: "Clients", icon: UserCheck },
      { href: "/follow-ups", label: "Follow-up Automation", icon: Send, ai: true },
      { href: "/servicing", label: "Client Servicing", icon: ShieldCheck },
    ],
  },
  {
    title: "AI Copilots",
    items: [
      { href: "/meetings", label: "Meeting Assistant", icon: CalendarClock, ai: true },
      { href: "/coach", label: "Sales Coach", icon: GraduationCap, ai: true },
      { href: "/proposals", label: "Proposal Generator", icon: FileText, ai: true },
      { href: "/intelligence", label: "Business Intelligence", icon: BrainCircuit, ai: true },
    ],
  },
  {
    title: "Knowledge",
    requiresCompany: true,
    items: [
      { href: "/company", label: "My Company & Products", icon: BookOpen },
    ],
  },
  {
    title: "Management",
    items: [{ href: "/agency", label: "Agency Dashboard", icon: Building2 }],
  },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { company, hasCompany } = useTheme();
  const sections = SECTIONS.filter((s) => !s.requiresCompany || hasCompany);
  return (
    <>
      {/* mobile backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-navy-950/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-slate-300 transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-200 shadow-sm ring-1 ring-white/10">
              <span className="font-display text-lg font-semibold leading-none text-brand-950">
                W
              </span>
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold text-white">
                WealthFlow
              </p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-sidebar-ink">
                Sales OS
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Active company chip */}
        <Link
          href="/company"
          onClick={onClose}
          className="mx-3 mb-3 flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 transition hover:bg-white/10"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/20"
            style={{ background: company ? company.color : "rgba(255,255,255,0.12)" }}
          >
            {!company && <BookOpen className="h-3.5 w-3.5 text-white/70" />}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">
              {company ? "Your company" : "Get started"}
            </span>
            <span className="block truncate text-sm font-semibold text-white">
              {company ? company.short : "Choose your company"}
            </span>
          </span>
        </Link>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-ink/70">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-white/[0.07] font-semibold text-white"
                          : "font-medium text-sidebar-ink hover:bg-white/[0.04] hover:text-white",
                      )}
                    >
                      {active && (
                        <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gold-400" />
                      )}
                      <item.icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          active
                            ? "text-gold-400"
                            : "text-sidebar-ink group-hover:text-white",
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-xl bg-white/[0.04] p-3.5 ring-1 ring-white/[0.07]">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            AI copilots
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-sidebar-ink">
            Running on Groq · Llama 3.3 70B.
          </p>
        </div>
      </aside>
    </>
  );
}
