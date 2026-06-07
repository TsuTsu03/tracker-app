"use client";

import { useState } from "react";
import { PageHeader, Avatar, Badge } from "@/components/ui";
import { LEADS } from "@/lib/demo-data";
import { PIPELINE_STAGES, type Lead, type PipelineStage } from "@/lib/types";
import { peso, relativeDays, cn } from "@/lib/utils";
import { KanbanSquare, Flame, GripVertical } from "lucide-react";

const STAGE_ACCENT: Record<string, string> = {
  "New Lead": "border-t-slate-400",
  Contacted: "border-t-sky-400",
  Responded: "border-t-cyan-400",
  "Appointment Scheduled": "border-t-brand-400",
  "Discovery Meeting": "border-t-ai-400",
  "Proposal Presented": "border-t-violet-400",
  "Under Consideration": "border-t-gold-400",
  "Follow-Up": "border-t-amber-400",
  "Closed Won": "border-t-money-500",
  "Closed Lost": "border-t-risk-400",
};

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<PipelineStage | null>(null);

  const move = (id: string, stage: PipelineStage) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage } : l)),
    );
  };

  const totalValue = (stage: PipelineStage) =>
    leads
      .filter((l) => l.stage === stage)
      .reduce((s, l) => s + l.potentialPremium, 0);

  return (
    <div className="animate-in">
      <PageHeader
        title="Sales Pipeline"
        subtitle="Drag & drop leads across stages — HubSpot-style"
        icon={KanbanSquare}
        accent="ai"
      />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const items = leads.filter((l) => l.stage === stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(stage);
              }}
              onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
              onDrop={() => {
                if (dragId) move(dragId, stage);
                setDragId(null);
                setOverStage(null);
              }}
              className={cn(
                "flex w-72 shrink-0 flex-col rounded-2xl bg-slate-100/70 transition",
                overStage === stage && "ring-2 ring-brand-400 ring-offset-2",
              )}
            >
              <div
                className={cn(
                  "rounded-t-2xl border-t-4 bg-white px-4 py-3",
                  STAGE_ACCENT[stage],
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900">{stage}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {items.length}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {peso(totalValue(stage), { compact: true })} potential
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-2.5 p-2.5">
                {items.map((l) => (
                  <article
                    key={l.id}
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    onDragEnd={() => setDragId(null)}
                    className={cn(
                      "group cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition active:cursor-grabbing",
                      dragId === l.id ? "opacity-40" : "hover:shadow-md",
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <Avatar name={l.avatarSeed ?? l.fullName} size={34} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy-900">
                          {l.fullName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {l.occupation}
                        </p>
                      </div>
                      <GripVertical className="h-4 w-4 text-slate-300 opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <Badge tone={l.temperature}>
                        {l.temperature === "Hot" && <Flame className="h-3 w-3" />}
                        {l.aiScore}
                      </Badge>
                      <span className="text-xs font-semibold text-money-700">
                        {peso(l.potentialPremium, { compact: true })}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Last contact {relativeDays(l.lastContact)}
                    </p>
                  </article>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
