"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BottomNav } from "./bottom-nav";

export function Shell({
  children,
  name,
  role,
  avatarSeed,
}: {
  children: React.ReactNode;
  name: string;
  role: string;
  avatarSeed: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-72">
        <Topbar
          onMenu={() => setOpen(true)}
          name={name}
          role={role}
          avatarSeed={avatarSeed}
        />
        <main className="mx-auto max-w-[1400px] px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav onMenu={() => setOpen(true)} />
    </div>
  );
}
