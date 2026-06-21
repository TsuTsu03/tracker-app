"use client";

import { useState } from "react";
import { Avatar } from "./ui";
import { signOut } from "@/app/actions/auth";
import { Bell, Menu, Search, Sparkles, LogOut, ChevronDown } from "lucide-react";

export function Topbar({
  onMenu,
  name,
  role,
  avatarSeed,
}: {
  onMenu: () => void;
  name: string;
  role: string;
  avatarSeed: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-hairline bg-surface/85 px-4 backdrop-blur-md lg:px-8">
      <button
        onClick={onMenu}
        aria-label="Open navigation menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          aria-label="Search leads, clients, and policies"
          placeholder="Search wealth data, clients, or insights…"
          className="w-full rounded-full border border-hairline bg-surface-2 py-2 pl-9 pr-4 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-surface focus:ring-2 focus:ring-brand-500/15"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Stitch live-model status chip — sage pill with a pulsing dot. */}
        <span className="hidden items-center gap-2 rounded-full border border-ai-500/20 bg-ai-500/10 px-3 py-1 lg:inline-flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-money-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ai-600">
            Groq Llama 3.3 Active
          </span>
        </span>
        <button className="hidden cursor-pointer items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 md:flex">
          <Sparkles className="h-4 w-4" aria-hidden="true" /> Ask AI
        </button>
        <button
          aria-label="Notifications — 1 unread"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-500 ring-2 ring-white" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl py-1 pl-1 pr-1 transition-colors sm:pr-2.5 sm:hover:bg-slate-100"
          >
            <Avatar name={avatarSeed} size={36} />
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-navy-900">{name}</p>
              <p className="text-[11px] text-slate-500">{role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="popover-in absolute right-0 z-20 mt-2 w-48 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <div className="border-b border-slate-100 px-4 py-2.5 sm:hidden">
                  <p className="text-sm font-semibold text-navy-900">{name}</p>
                  <p className="text-[11px] text-slate-500">{role}</p>
                </div>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4 text-slate-400" /> Sign out
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
