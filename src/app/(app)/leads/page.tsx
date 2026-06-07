"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Avatar, Badge, ScoreRing } from "@/components/ui";
import { LEADS } from "@/lib/demo-data";
import type { Lead, Temperature } from "@/lib/types";
import { peso, relativeDays, daysSince, cn } from "@/lib/utils";
import {
  Users,
  Search,
  Plus,
  Flame,
  X,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Users2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const TEMPS: ("All" | Temperature)[] = ["All", "Hot", "Warm", "Cold"];

export default function LeadsPage() {
  const [q, setQ] = useState("");
  const [temp, setTemp] = useState<"All" | Temperature>("All");
  const [sort, setSort] = useState<"score" | "value" | "recent">("score");
  const [selected, setSelected] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    let r = LEADS.filter(
      (l) =>
        (temp === "All" || l.temperature === temp) &&
        (q === "" ||
          l.fullName.toLowerCase().includes(q.toLowerCase()) ||
          l.occupation.toLowerCase().includes(q.toLowerCase()) ||
          (l.company ?? "").toLowerCase().includes(q.toLowerCase())),
    );
    r = [...r].sort((a, b) =>
      sort === "score"
        ? b.aiScore - a.aiScore
        : sort === "value"
          ? b.potentialPremium - a.potentialPremium
          : daysSince(a.lastContact) - daysSince(b.lastContact),
    );
    return r;
  }, [q, temp, sort]);

  return (
    <div className="animate-in">
      <PageHeader
        title="Lead Database"
        subtitle={`${LEADS.length} leads · ${LEADS.filter((l) => l.temperature === "Hot").length} hot prospects`}
        icon={Users}
        actions={
          <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Add Lead
          </button>
        }
      />

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, occupation, company…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1">
          {TEMPS.map((t) => (
            <button
              key={t}
              onClick={() => setTemp(t)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                temp === t
                  ? "bg-brand-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-400"
        >
          <option value="score">Sort: AI Score</option>
          <option value="value">Sort: Premium Value</option>
          <option value="recent">Sort: Last Contact</option>
        </select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Lead</th>
                <th className="px-3 py-3 font-semibold">AI Score</th>
                <th className="px-3 py-3 font-semibold">Stage</th>
                <th className="px-3 py-3 font-semibold">Potential</th>
                <th className="px-3 py-3 font-semibold">Last Contact</th>
                <th className="px-3 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => setSelected(l)}
                  className="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={l.avatarSeed ?? l.fullName} size={40} />
                      <div>
                        <p className="font-semibold text-navy-900">{l.fullName}</p>
                        <p className="text-xs text-slate-500">{l.occupation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-base font-bold",
                          l.aiScore >= 80
                            ? "text-money-600"
                            : l.aiScore >= 60
                              ? "text-gold-600"
                              : "text-risk-500",
                        )}
                      >
                        {l.aiScore}
                      </span>
                      <Badge tone={l.temperature}>
                        {l.temperature === "Hot" && <Flame className="h-3 w-3" />}
                        {l.temperature}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-slate-700">{l.stage}</span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-money-700">
                    {peso(l.potentialPremium, { compact: true })}
                  </td>
                  <td className="px-3 py-3 text-slate-500">
                    {relativeDays(l.lastContact)}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500">{l.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">
            No leads match your filters.
          </p>
        )}
      </Card>

      <LeadDrawer lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function LeadDrawer({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm transition-opacity",
          lead ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-2xl transition-transform duration-300",
          lead ? "translate-x-0" : "translate-x-full",
        )}
      >
        {lead && (
          <div>
            <div className="relative bg-gradient-to-br from-brand-600 to-navy-800 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-white/80 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-4">
                <Avatar name={lead.avatarSeed ?? lead.fullName} size={64} />
                <div>
                  <h2 className="text-xl font-bold">{lead.fullName}</h2>
                  <p className="text-sm text-white/80">{lead.occupation}</p>
                  {lead.company && (
                    <p className="text-xs text-white/60">{lead.company}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              {/* AI Score */}
              <div className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-ai-500/10 to-brand-500/5 p-4 ring-1 ring-ai-500/15">
                <ScoreRing score={lead.aiScore} size={64} />
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-ai-700">
                    <Sparkles className="h-4 w-4" /> AI Lead Score
                  </p>
                  <p className="text-xs text-slate-600">
                    {lead.temperature} lead · {lead.stage}
                  </p>
                </div>
              </div>

              {/* Why this score */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Why this score
                </p>
                <ul className="space-y-1.5">
                  {lead.scoreReasons.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-money-500" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 gap-2.5">
                <Field icon={Phone} label="Phone" value={lead.phone} />
                <Field icon={Mail} label="Email" value={lead.email} />
                <Field icon={MapPin} label="Location" value={lead.location} />
                <Field icon={Briefcase} label="Industry" value={lead.industry ?? "—"} />
                <Field
                  icon={Users2}
                  label="Family"
                  value={`${lead.civilStatus ?? "—"} · ${lead.dependents ?? 0} dependents`}
                />
              </div>

              {/* Financials */}
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Monthly Income" value={lead.monthlyIncome ? peso(lead.monthlyIncome) : "—"} />
                <Stat label="Est. Net Worth" value={lead.netWorth ? peso(lead.netWorth, { compact: true }) : "—"} />
                <Stat label="Potential Premium" value={`${peso(lead.potentialPremium)}/yr`} tone="money" />
                <Stat label="Age" value={lead.age ? `${lead.age} yrs` : "—"} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/proposals"
                  className="flex items-center justify-center gap-2 rounded-xl bg-ai-500 py-2.5 text-sm font-semibold text-white transition hover:bg-ai-600"
                >
                  <Sparkles className="h-4 w-4" /> AI Proposal
                </Link>
                <Link
                  href="/follow-ups"
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  <Mail className="h-4 w-4" /> Follow up
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2">
      <Icon className="h-4 w-4 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium text-navy-900">{value}</p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "money";
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-sm font-bold",
          tone === "money" ? "text-money-700" : "text-navy-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}
