"use client";

import { useState } from "react";
import { PageHeader, Card, AIBadge, Progress, Avatar } from "@/components/ui";
import {
  aiObjectionResponses,
  aiRoleplayReply,
  aiScoreCall,
  type RoleplayTurn,
  type CallScoreResult,
} from "@/app/actions/ai";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Sparkles,
  Loader2,
  Send,
  Drama,
  ClipboardCheck,
  ShieldQuestion,
} from "lucide-react";

const TABS = ["Objection Handling", "Roleplay", "Call Review"] as const;
type Tab = (typeof TABS)[number];

export default function CoachPage() {
  const [tab, setTab] = useState<Tab>("Objection Handling");
  return (
    <div className="animate-in">
      <PageHeader
        title="AI Sales Coach"
        subtitle="Your virtual sales manager — practice, improve, close more"
        icon={GraduationCap}
        accent="ai"
        actions={<AIBadge />}
      />
      <div className="mb-6 inline-flex flex-wrap rounded-xl border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
              tab === t ? "bg-ai-500 text-white shadow" : "text-slate-600 hover:bg-slate-100",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Objection Handling" && <Objections />}
      {tab === "Roleplay" && <Roleplay />}
      {tab === "Call Review" && <CallReview />}
    </div>
  );
}

const PRESETS = [
  "I already have insurance.",
  "It's too expensive (masyadong mahal).",
  "Let me think about it muna.",
  "I don't have budget right now.",
];

function Objections() {
  const [input, setInput] = useState("I already have insurance.");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<Record<string, string> | null>(
    null,
  );

  const run = async (text: string) => {
    setInput(text);
    setLoading(true);
    setResponses(null);
    setResponses(await aiObjectionResponses(text));
    setLoading(false);
  };

  const toneStyles: Record<string, string> = {
    Soft: "bg-money-500",
    Consultative: "bg-brand-500",
    Aggressive: "bg-risk-500",
    Educational: "bg-ai-500",
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-navy-900">
          <ShieldQuestion className="h-4 w-4 text-ai-500" /> What did the prospect
          say?
        </h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm outline-none focus:border-ai-400 focus:ring-2 focus:ring-ai-100"
        />
        <button
          onClick={() => run(input)}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Get Responses
        </button>
        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Common objections
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => run(p)}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
            >
              {p}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {loading &&
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        {!loading && !responses && (
          <Card className="flex h-48 items-center justify-center text-sm text-slate-400">
            AI returns 4 response styles — Soft, Consultative, Aggressive,
            Educational.
          </Card>
        )}
        {responses &&
          Object.entries(responses).map(([tone, text]) => (
            <Card key={tone}>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      toneStyles[tone],
                    )}
                  />
                  {tone}
                </p>
                <button className="text-xs font-semibold text-brand-600 hover:underline">
                  Copy
                </button>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{text}</p>
            </Card>
          ))}
      </div>
    </div>
  );
}

const PERSONAS = [
  { name: "Skeptical Client", desc: "Doubts everything, asks tough questions", seed: "Skeptic" },
  { name: "Busy Executive", desc: "Limited time, wants the bottom line", seed: "Exec" },
  { name: "Young Professional", desc: "Price-sensitive, first-time buyer", seed: "Young Pro" },
  { name: "Parent", desc: "Focused on family & children's future", seed: "Parent" },
  { name: "Business Owner", desc: "Thinks ROI, cashflow, continuity", seed: "Biz Owner" },
];

const OPENER = "Honestly, I've heard all the sales pitches before. Why should I even consider this?";

function Roleplay() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState<RoleplayTurn[]>([
    { role: "ai", text: OPENER },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = async () => {
    if (!input.trim() || typing) return;
    const mine = input;
    const history: RoleplayTurn[] = [...messages, { role: "me", text: mine }];
    setMessages(history);
    setInput("");
    setTyping(true);
    try {
      const reply = await aiRoleplayReply({
        persona: persona.name,
        personaDesc: persona.desc,
        history,
      });
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "(Roleplay paused — AI unavailable. Subukan ulit mamaya.)" },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      <Card className="h-fit">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
          <Drama className="h-4 w-4 text-ai-500" /> Choose a persona
        </h3>
        <div className="space-y-2">
          {PERSONAS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setPersona(p);
                setMessages([{ role: "ai", text: OPENER }]);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
                persona.name === p.name
                  ? "border-ai-400 bg-ai-500/5 ring-1 ring-ai-400"
                  : "border-slate-200 hover:bg-slate-50",
              )}
            >
              <Avatar name={p.seed} size={36} />
              <div>
                <p className="text-sm font-semibold text-navy-900">{p.name}</p>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex h-[560px] flex-col">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Avatar name={persona.seed} size={36} />
          <div>
            <p className="text-sm font-semibold text-navy-900">{persona.name}</p>
            <p className="text-xs text-money-600">● Roleplay in progress</p>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "me" ? "justify-end" : "justify-start")}
            >
              <p
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "me"
                    ? "rounded-br-sm bg-brand-600 text-white"
                    : "rounded-bl-sm bg-slate-100 text-navy-900",
                )}
              >
                {m.text}
              </p>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <p className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </p>
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your response…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-ai-400 focus:ring-2 focus:ring-ai-100"
          />
          <button
            onClick={send}
            className="flex items-center justify-center rounded-xl bg-ai-500 px-4 text-white transition hover:bg-ai-600"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}

function toneFor(value: number) {
  if (value >= 75) return "money" as const;
  if (value >= 60) return "gold" as const;
  return "risk" as const;
}

function CallReview() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CallScoreResult | null>(null);
  const [error, setError] = useState(false);

  const run = async () => {
    if (!transcript.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(false);
    try {
      setResult(await aiScoreCall(transcript));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const scores = result
    ? [
        { label: "Rapport", value: result.scores.rapport },
        { label: "Discovery", value: result.scores.discovery },
        { label: "Closing", value: result.scores.closing },
        { label: "Confidence", value: result.scores.confidence },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-navy-900">
          <ClipboardCheck className="h-4 w-4 text-ai-500" /> Paste call transcript
        </h3>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={12}
          placeholder="Paste a real call transcript here (Advisor: … / Client: …) and AI will score it like an MDRT mentor."
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm outline-none focus:border-ai-400 focus:ring-2 focus:ring-ai-100"
        />
        <button
          onClick={run}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Score My Call
        </button>
      </Card>

      <Card className={result ? "ai-ring" : ""}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-navy-900">AI Scorecard</h3>
          <AIBadge />
        </div>
        {!result && !loading && !error && (
          <p className="py-16 text-center text-sm text-slate-400">
            AI scores Rapport, Discovery, Closing & Confidence with coaching
            tips.
          </p>
        )}
        {error && (
          <p className="py-16 text-center text-sm text-risk-500">
            AI scoring failed — subukan ulit mamaya.
          </p>
        )}
        {loading && <div className="h-64 animate-pulse rounded-xl bg-slate-50" />}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-ai-500/[0.06] p-4">
              <span className="text-3xl font-bold text-ai-700">{result.overall}</span>
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {result.verdict}
                </p>
                <p className="text-xs text-slate-600">{result.summary}</p>
              </div>
            </div>
            {scores.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-navy-900">{s.label}</span>
                  <span className="font-semibold text-slate-600">{s.value}/100</span>
                </div>
                <Progress value={s.value} tone={toneFor(s.value)} />
              </div>
            ))}
            {result.strengths.length > 0 && (
              <div className="rounded-xl bg-money-500/10 p-3 text-sm text-slate-700 ring-1 ring-money-500/20">
                <b className="text-money-700">What worked:</b>
                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                  {result.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.improvements.length > 0 && (
              <div className="rounded-xl bg-risk-500/10 p-3 text-sm text-slate-700 ring-1 ring-risk-500/20">
                <b className="text-risk-700">Fix next time:</b>
                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                  {result.improvements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-xl bg-gold-500/10 p-3 text-sm text-slate-700 ring-1 ring-gold-500/20">
              <b className="text-gold-700">Coaching tip:</b> {result.tip}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
