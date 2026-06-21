"use client";

import { useState } from "react";
import { PageHeader, Card, AIBadge, Avatar, Badge } from "@/components/ui";
import { ForecastChart } from "@/components/charts";
import { aiBusinessAdvice, type BusinessAdviceResult } from "@/app/actions/ai";
import type { Lead, Client } from "@/lib/types";
import { daysSince, peso, cn } from "@/lib/utils";
import {
  BrainCircuit,
  Sparkles,
  Loader2,
  TrendingUp,
  Send,
  Target,
  AlertTriangle,
  Users,
  Lightbulb,
} from "lucide-react";

const SUGGESTED = [
  "Why am I not closing enough cases?",
  "Which leads should I prioritize this week?",
  "How can I improve my conversion rate?",
];

export function IntelligenceClient({
  leads: LEADS,
  clients: CLIENTS,
  forecast,
  metrics,
  growthPct,
}: {
  leads: Lead[];
  clients: Client[];
  forecast: { month: string; actual?: number; forecast?: number }[];
  metrics: { thisMonth: number; nextQuarter: number; annual: number };
  growthPct: number;
}) {
  const FORECAST = forecast;
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<BusinessAdviceResult | null>(null);

  const ask = async (text: string) => {
    if (!text.trim()) return;
    setQ(text);
    setLoading(true);
    setAnswer(null);
    setError(null);
    const open = LEADS.filter((l) => !l.stage.startsWith("Closed"));
    try {
      const res = await aiBusinessAdvice(text, {
        totalLeads: LEADS.length,
        hotLeads: LEADS.filter((l) => l.temperature === "Hot").length,
        staleHotLeads: LEADS.filter(
          (l) =>
            l.temperature === "Hot" &&
            !l.stage.startsWith("Closed") &&
            daysSince(l.lastContact) >= 7,
        ).length,
        pipelineValue: open.reduce((s, l) => s + l.potentialPremium, 0),
        closedWon: LEADS.filter((l) => l.stage === "Closed Won").length,
        closedLost: LEADS.filter((l) => l.stage === "Closed Lost").length,
        atRiskClients: CLIENTS.filter((c) => c.relationshipScore < 60).length,
      });
      setAnswer(res);
    } catch {
      setError("AI is busy right now — please try again in a moment.");
    }
    setLoading(false);
  };

  const topClose = [...LEADS]
    .filter((l) => !l.stage.startsWith("Closed"))
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 3);
  const atRisk = CLIENTS.filter((c) => c.relationshipScore < 60);

  return (
    <div className="animate-in">
      <PageHeader
        title="AI Business Intelligence"
        subtitle="Your personal AI advisor — ask anything about your business"
        icon={BrainCircuit}
        accent="ai"
        actions={<AIBadge>Premium</AIBadge>}
      />

      {/* Personal AI Advisor */}
      <Card className="ai-ring mb-6">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
          <Sparkles className="h-4 w-4 text-ai-500" /> Personal AI Advisor
        </h3>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(q)}
            placeholder="Ask: Why am I not closing enough cases?"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ai-400 focus:ring-2 focus:ring-ai-100"
          />
          <button
            onClick={() => ask(q)}
            disabled={loading || !q}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
            >
              {s}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-ai-500" />
            Analyzing your CRM data…
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-risk-500/20 bg-risk-500/5 px-3 py-2.5 text-sm text-risk-700">
            {error}
          </p>
        )}

        {answer && (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <AnswerBlock icon={AlertTriangle} title="Weaknesses" tone="risk" items={answer.weaknesses} />
            <AnswerBlock icon={Lightbulb} title="Recommendations" tone="gold" items={answer.recommendations} />
            <AnswerBlock icon={Target} title="Action Plan" tone="ai" items={answer.plan} />
          </div>
        )}
      </Card>

      {/* Forecasting + opportunity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-navy-900">Revenue Forecast</h3>
              <p className="text-xs text-slate-500">
                AI projection — next 3 months
              </p>
            </div>
            {growthPct > 0 && (
              <Badge tone="In Force">
                <TrendingUp className="h-3 w-3" /> +{growthPct}% projected
              </Badge>
            )}
          </div>
          {FORECAST.length > 0 ? (
            <ForecastChart data={FORECAST} />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center text-sm text-slate-400">
              Close your first cases to unlock revenue forecasting.
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Forecast label="This Month" value={peso(metrics.thisMonth, { compact: true })} />
            <Forecast label="Next Quarter" value={peso(metrics.nextQuarter, { compact: true })} />
            <Forecast label="Annual Run-rate" value={peso(metrics.annual, { compact: true })} />
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
            <Target className="h-4 w-4 text-money-500" /> Most Likely to Close
          </h3>
          <div className="space-y-2.5">
            {topClose.map((l) => (
              <div key={l.id} className="flex items-center gap-3">
                <Avatar name={l.avatarSeed ?? l.fullName} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">
                    {l.fullName}
                  </p>
                  <p className="text-xs text-slate-500">{l.stage}</p>
                </div>
                <span className="text-sm font-bold text-money-600">
                  {l.aiScore}%
                </span>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-5 flex items-center gap-2 font-semibold text-navy-900">
            <AlertTriangle className="h-4 w-4 text-risk-500" /> Most Likely to
            Lapse
          </h3>
          <div className="space-y-2.5">
            {atRisk.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar name={c.fullName} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">
                    {c.fullName}
                  </p>
                  <p className="text-xs text-risk-500">
                    Health {c.relationshipScore}/100
                  </p>
                </div>
                <button className="rounded-lg bg-risk-500/10 px-2.5 py-1 text-xs font-semibold text-risk-600">
                  Save
                </button>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-5 flex items-center gap-2 font-semibold text-navy-900">
            <Users className="h-4 w-4 text-ai-500" /> Best Referral Sources
          </h3>
          <div className="space-y-2.5">
            {CLIENTS.filter((c) => c.relationshipScore >= 76).map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar name={c.fullName} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">
                    {c.fullName}
                  </p>
                  <p className="text-xs text-money-600">
                    {c.relationshipScore}/100 — ask now
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AnswerBlock({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  tone: "risk" | "gold" | "ai";
}) {
  const colors = {
    risk: "text-risk-600 bg-risk-500/5 ring-risk-500/15",
    gold: "text-gold-700 bg-gold-500/5 ring-gold-500/15",
    ai: "text-ai-700 bg-ai-500/5 ring-ai-500/15",
  };
  return (
    <div className={cn("rounded-xl p-4 ring-1", colors[tone])}>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
        <Icon className="h-4 w-4" /> {title}
      </p>
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Forecast({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-base font-bold text-navy-900">{value}</p>
    </div>
  );
}
