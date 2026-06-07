"use client";

import { useState } from "react";
import { PageHeader, Card, AIBadge, Progress } from "@/components/ui";
import { generateProposal, sleep, AI_THINKING_MS } from "@/lib/ai";
import { peso, cn } from "@/lib/utils";
import {
  FileText,
  Sparkles,
  Loader2,
  ShieldCheck,
  TrendingDown,
  Wallet,
  Download,
  PieChart,
} from "lucide-react";

export default function ProposalsPage() {
  const [age, setAge] = useState(38);
  const [income, setIncome] = useState(150000);
  const [dependents, setDependents] = useState(2);
  const [goal, setGoal] = useState("Protect my family & build retirement savings");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof generateProposal> | null>(
    null,
  );

  const run = async () => {
    setLoading(true);
    setResult(null);
    await sleep(AI_THINKING_MS + 300);
    setResult(generateProposal({ age, income, dependents, goal }));
    setLoading(false);
  };

  return (
    <div className="animate-in">
      <PageHeader
        title="AI Proposal Generator"
        subtitle="Needs analysis, protection-gap math & a ready-to-present script"
        icon={FileText}
        accent="ai"
        actions={<AIBadge />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <h3 className="mb-4 font-semibold text-navy-900">Client Inputs</h3>
          <div className="space-y-4">
            <Range label="Age" value={age} min={18} max={70} onChange={setAge} suffix=" yrs" />
            <div>
              <label className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-navy-900">Monthly Income</span>
                <span className="font-semibold text-money-700">{peso(income)}</span>
              </label>
              <input
                type="range"
                min={20000}
                max={500000}
                step={10000}
                value={income}
                onChange={(e) => setIncome(+e.target.value)}
                className="w-full accent-ai-500"
              />
            </div>
            <Range label="Dependents" value={dependents} min={0} max={6} onChange={setDependents} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Primary Goal
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm outline-none focus:border-ai-400 focus:ring-2 focus:ring-ai-100"
              />
            </div>
            <button
              onClick={run}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-ai-500/25 transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Building proposal…" : "Generate Proposal"}
            </button>
          </div>
        </Card>

        <div className="space-y-4">
          {!result && !loading && (
            <Card className="flex h-72 flex-col items-center justify-center text-center">
              <FileText className="mb-2 h-10 w-10 text-ai-200" />
              <p className="text-sm text-slate-500">
                Enter client details and let AI build a full financial needs
                analysis.
              </p>
            </Card>
          )}
          {loading && <Card className="h-72 animate-pulse bg-slate-50" />}
          {result && (
            <>
              {/* Protection gap */}
              <Card className="ai-glow">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-navy-900">
                    <ShieldCheck className="h-4 w-4 text-ai-500" /> Protection Gap
                    Analysis
                  </h3>
                  <button className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                    <Download className="h-3.5 w-3.5" /> Export PDF
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <GapStat label="Recommended Cover" value={peso(result.recommendedCover, { compact: true })} tone="brand" icon={ShieldCheck} />
                  <GapStat label="Existing Cover" value={peso(result.existing, { compact: true })} tone="slate" icon={Wallet} />
                  <GapStat label="Protection Gap" value={peso(result.gap, { compact: true })} tone="risk" icon={TrendingDown} />
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Coverage progress</span>
                    <span>
                      {Math.round((result.existing / result.recommendedCover) * 100)}
                      % covered
                    </span>
                  </div>
                  <Progress
                    value={(result.existing / result.recommendedCover) * 100}
                    tone="risk"
                  />
                </div>
              </Card>

              {/* Suggested coverage */}
              <Card>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
                  <PieChart className="h-4 w-4 text-ai-500" /> Suggested Coverage
                </h3>
                <div className="space-y-3">
                  {result.products.map((p) => (
                    <div key={p.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-navy-900">{p.name}</span>
                        <span className="text-slate-500">{p.alloc}%</span>
                      </div>
                      <Progress value={p.alloc} tone="ai" />
                      <p className="mt-0.5 text-xs text-slate-400">{p.purpose}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-money-500/10 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-money-700">
                      Recommended Premium
                    </p>
                    <p className="text-2xl font-bold text-money-700">
                      {peso(result.annualPremium)}
                      <span className="text-sm font-medium">/yr</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">≈ monthly</p>
                    <p className="text-lg font-bold text-navy-900">
                      {peso(result.monthlyPremium)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Presentation script */}
              <Card className="border-l-4 border-l-ai-500">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-navy-900">
                  <Sparkles className="h-4 w-4 text-ai-500" /> Presentation Script
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  {result.script}
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 flex justify-between text-sm">
        <span className="font-medium text-navy-900">{label}</span>
        <span className="font-semibold text-slate-600">
          {value}
          {suffix}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-ai-500"
      />
    </div>
  );
}

function GapStat({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone: "brand" | "slate" | "risk";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const colors = {
    brand: "text-brand-600 bg-brand-500/10",
    slate: "text-slate-600 bg-slate-100",
    risk: "text-risk-600 bg-risk-500/10",
  };
  return (
    <div className="rounded-xl border border-slate-100 p-3">
      <div
        className={cn(
          "mb-2 flex h-8 w-8 items-center justify-center rounded-lg",
          colors[tone],
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-base font-bold text-navy-900">{value}</p>
    </div>
  );
}
