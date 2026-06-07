"use client";

import { Avatar } from "./ui";
import { CURRENT_ADVISOR } from "@/lib/demo-data";
import { Bell, Menu, Search, Sparkles } from "lucide-react";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/70 glass px-4 lg:px-8">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search leads, clients, policies…"
          className="w-full rounded-xl border border-slate-200 bg-white/70 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-ai-500/20 transition hover:opacity-90 sm:flex">
          <Sparkles className="h-4 w-4" /> Ask AI
        </button>
        <button className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-1 sm:pr-3 sm:hover:bg-slate-100">
          <Avatar name={CURRENT_ADVISOR.avatarSeed} size={36} />
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-navy-900">
              {CURRENT_ADVISOR.name}
            </p>
            <p className="text-[11px] text-slate-500">
              {CURRENT_ADVISOR.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
