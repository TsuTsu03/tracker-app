"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Sparkles,
  X,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ai?: boolean;
};

const SECTIONS: { title: string; items: Item[] }[] = [
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
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-navy-900 text-slate-300 transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-ai-500 to-money-500 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold text-white">WealthFlow</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                AI Sales OS
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

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
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
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-gradient-to-r from-brand-600/90 to-brand-500/70 text-white shadow-md shadow-brand-900/40"
                          : "text-slate-300 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0",
                          active ? "text-white" : "text-slate-400 group-hover:text-white",
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.ai && (
                        <Sparkles
                          className={cn(
                            "h-3.5 w-3.5",
                            active ? "text-white/90" : "text-ai-400",
                          )}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-xl bg-gradient-to-br from-ai-600/30 to-brand-600/20 p-4 ring-1 ring-white/10">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5 text-ai-400" /> Powered by Gemini
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
            AI features live on gemini-1.5-flash.
          </p>
        </div>
      </aside>
    </>
  );
}
