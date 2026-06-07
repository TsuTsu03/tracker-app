"use client";

import { useState } from "react";
import { PageHeader, Card, AIBadge, Badge } from "@/components/ui";
import { sleep, AI_THINKING_MS } from "@/lib/ai";
import { aiStructureNotes, aiMeetingSummary } from "@/app/actions/ai";
import { LEADS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  Sparkles,
  Loader2,
  FileText,
  ClipboardList,
  Wand2,
  Target,
  AlertCircle,
  Wallet,
  ArrowRight,
} from "lucide-react";

const TABS = ["Prepare", "Take Notes", "Summary"] as const;
type Tab = (typeof TABS)[number];

export default function MeetingsPage() {
  const [tab, setTab] = useState<Tab>("Prepare");
  return (
    <div className="animate-in">
      <PageHeader
        title="AI Meeting Assistant"
        subtitle="Prep smarter, capture notes effortlessly, never miss a next step"
        icon={CalendarClock}
        accent="ai"
        actions={<AIBadge />}
      />

      <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
              tab === t
                ? "bg-ai-500 text-white shadow"
                : "text-slate-600 hover:bg-slate-100",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Prepare" && <Prepare />}
      {tab === "Take Notes" && <Notes />}
      {tab === "Summary" && <Summary />}
    </div>
  );
}

function Prepare() {
  const [lead, setLead] = useState(LEADS[0]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const generate = async () => {
    setLoading(true);
    setDone(false);
    await sleep(AI_THINKING_MS);
    setLoading(false);
    setDone(true);
  };

  const questions = {
    Protection: [
      "If your income stopped tomorrow, how long could your family maintain their lifestyle?",
      "Who relies on you financially today?",
    ],
    Retirement: [
      "At what age do you want the option to stop working?",
      "What monthly income would you need in retirement?",
    ],
    Investment: [
      "How are you currently growing your savings beyond the bank?",
      "What's your comfort level with market ups and downs?",
    ],
    Education: [
      "Which schools do you envision for your children?",
      "Have you estimated the tuition cost 10 years from now?",
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Meeting with
        </label>
        <select
          value={lead.id}
          onChange={(e) =>
            setLead(LEADS.find((l) => l.id === e.target.value) ?? LEADS[0])
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ai-400"
        >
          {LEADS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.fullName} — {l.occupation}
            </option>
          ))}
        </select>
        <button
          onClick={generate}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-ai-500/25 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {loading ? "Preparing…" : "Generate Meeting Brief"}
        </button>
        <p className="mt-3 text-xs text-slate-400">
          AI builds a background summary, risk analysis and a tailored discovery
          script.
        </p>
      </Card>

      <div className="space-y-4">
        {!done && !loading && (
          <Card className="flex h-64 flex-col items-center justify-center text-center">
            <Sparkles className="mb-2 h-8 w-8 text-ai-300" />
            <p className="text-sm text-slate-500">
              Select a lead and generate an AI meeting brief.
            </p>
          </Card>
        )}
        {loading && <Card className="h-64 animate-pulse bg-slate-50" />}
        {done && (
          <>
            <Card>
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-navy-900">
                <FileText className="h-4 w-4 text-ai-500" /> Client Background
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                <b>{lead.fullName}</b>, {lead.age}, {lead.occupation}
                {lead.company ? ` at ${lead.company}` : ""}. {lead.civilStatus}
                {lead.dependents ? ` with ${lead.dependents} dependents` : ""},
                based in {lead.location}. Estimated income{" "}
                {lead.monthlyIncome
                  ? `₱${lead.monthlyIncome.toLocaleString()}/mo`
                  : "above average"}
                . Currently in <b>{lead.stage}</b> stage with a{" "}
                <b>{lead.temperature}</b> buying signal (AI score {lead.aiScore}
                /100).
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lead.scoreReasons.map((r) => (
                  <Badge key={r} tone="In Force">
                    {r}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
                <AlertCircle className="h-4 w-4 text-gold-500" /> Risks & Talking
                Points
              </h3>
              <ul className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  Protection gap vs. {lead.dependents ?? 0} dependents
                </li>
                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  No structured retirement vehicle
                </li>
                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  Income concentration risk
                </li>
                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  Estate / wealth-transfer inefficiency
                </li>
              </ul>
            </Card>

            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
                <ClipboardList className="h-4 w-4 text-ai-500" /> Discovery
                Questions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(questions).map(([cat, qs]) => (
                  <div key={cat}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ai-600">
                      {cat}
                    </p>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {qs.map((q) => (
                        <li key={q} className="flex items-start gap-2">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function Notes() {
  const [raw, setRaw] = useState(
    "married, 2 kids 8 and 5, breadwinner, wife stays home. worried about tuition. has small sss only. budget around 10k month. wants to retire 60. interested in vul. follow up next week",
  );
  const [loading, setLoading] = useState(false);
  const [structured, setStructured] = useState<string | null>(null);
  const [notesLive, setNotesLive] = useState(false);

  const convert = async () => {
    setLoading(true);
    setStructured(null);
    const result = await aiStructureNotes(raw);
    setStructured(result.structured);
    setNotesLive(result.live);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <h3 className="mb-2 font-semibold text-navy-900">Your rough notes</h3>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={10}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm outline-none focus:border-ai-400 focus:ring-2 focus:ring-ai-100"
        />
        <button
          onClick={convert}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-ai-500/25 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {loading ? "Structuring…" : "Convert to CRM Notes"}
        </button>
      </Card>
      <Card className={structured ? "ai-glow" : ""}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-navy-900">Structured CRM notes</h3>
          {notesLive ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-money-500/10 px-2.5 py-0.5 text-xs font-semibold text-money-700 ring-1 ring-inset ring-money-500/20">
              <Sparkles className="h-3 w-3" /> Gemini Live
            </span>
          ) : (
            <AIBadge>Demo</AIBadge>
          )}
        </div>
        {!structured && !loading && (
          <p className="py-16 text-center text-sm text-slate-400">
            AI will turn your messy notes into clean, structured CRM entries.
          </p>
        )}
        {loading && <div className="h-64 animate-pulse rounded-xl bg-slate-50" />}
        {structured && (
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {structured.split("\n").map((line, i) =>
              line.startsWith("**") ? (
                <p key={i} className="mt-3 font-semibold text-navy-900">
                  {line.replaceAll("**", "")}
                </p>
              ) : (
                <p key={i}>{line}</p>
              ),
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function Summary() {
  const [loading, setLoading] = useState(false);
  const [summaryLive, setSummaryLive] = useState(false);
  const [data, setData] = useState<{
    concerns: string[];
    painPoints: string[];
    objections: string[];
    budget: string;
    nextAction: string;
  } | null>(null);

  const run = async () => {
    setLoading(true);
    setData(null);
    const result = await aiMeetingSummary();
    const { live, ...rest } = result;
    setSummaryLive(live);
    setData(rest);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-navy-900">
              Generate Meeting Summary
            </h3>
            {summaryLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-money-500/10 px-2.5 py-0.5 text-xs font-semibold text-money-700 ring-1 ring-inset ring-money-500/20">
                <Sparkles className="h-3 w-3" /> Gemini Live
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            From your notes, extract the key takeaways and next action.
          </p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-ai-500/25 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Summarize
        </button>
      </Card>

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SumCard icon={Target} title="Key Concerns" tone="ai" items={data.concerns} />
          <SumCard icon={AlertCircle} title="Pain Points" tone="gold" items={data.painPoints} />
          <SumCard icon={AlertCircle} title="Objections" tone="risk" items={data.objections} />
          <Card>
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-navy-900">
              <Wallet className="h-4 w-4 text-money-500" /> Budget Range
            </h4>
            <p className="text-lg font-bold text-money-700">{data.budget}</p>
          </Card>
          <Card className="sm:col-span-2 border-l-4 border-l-brand-500">
            <h4 className="mb-1 flex items-center gap-2 font-semibold text-navy-900">
              <ArrowRight className="h-4 w-4 text-brand-500" /> Next Action
            </h4>
            <p className="text-sm text-slate-700">{data.nextAction}</p>
          </Card>
        </div>
      )}
    </div>
  );
}

function SumCard({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  tone: "ai" | "gold" | "risk";
}) {
  const colors = {
    ai: "text-ai-500",
    gold: "text-gold-500",
    risk: "text-risk-500",
  };
  return (
    <Card>
      <h4 className="mb-2 flex items-center gap-2 font-semibold text-navy-900">
        <Icon className={cn("h-4 w-4", colors[tone])} /> {title}
      </h4>
      <ul className="space-y-1.5 text-sm text-slate-700">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", `bg-current ${colors[tone]}`)} />
            {i}
          </li>
        ))}
      </ul>
    </Card>
  );
}
