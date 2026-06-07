"use client";

import { useState } from "react";
import { PageHeader, Card, AIBadge, Progress, Avatar } from "@/components/ui";
import { objectionResponses, sleep, AI_THINKING_MS } from "@/lib/ai";
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
    await sleep(AI_THINKING_MS);
    setResponses(objectionResponses(text));
    setLoading(false);
  };

  const toneStyles: Record<string, string> = {
    Soft: "border-l-money-400",
    Consultative: "border-l-brand-400",
    Aggressive: "border-l-risk-400",
    Educational: "border-l-ai-400",
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
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-ai-500/25 transition hover:opacity-90 disabled:opacity-60"
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
            <Card
              key={tone}
              className={cn("border-l-4", toneStyles[tone])}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-bold text-navy-900">{tone}</p>
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

function Roleplay() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState<{ role: "ai" | "me"; text: string }[]>([
    { role: "ai", text: "Honestly, I've heard all the sales pitches before. Why should I even consider this?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const replies = [
    "Hmm, that's a fair point. But how do I know this isn't just another policy that won't pay out?",
    "Okay, you're making sense. But what if I can't keep up with the payments later?",
    "Alright, you've got my attention. What would the next step look like?",
  ];

  const send = async () => {
    if (!input.trim()) return;
    const mine = input;
    setMessages((m) => [...m, { role: "me", text: mine }]);
    setInput("");
    setTyping(true);
    await sleep(AI_THINKING_MS);
    const idx = messages.filter((m) => m.role === "me").length;
    setMessages((m) => [
      ...m,
      { role: "ai", text: replies[Math.min(idx, replies.length - 1)] },
    ]);
    setTyping(false);
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
                setMessages([
                  { role: "ai", text: "Honestly, I've heard all the sales pitches before. Why should I even consider this?" },
                ]);
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

function CallReview() {
  const [loading, setLoading] = useState(false);
  const [scored, setScored] = useState(false);
  const scores = [
    { label: "Rapport", value: 82, tone: "money" as const },
    { label: "Discovery", value: 68, tone: "gold" as const },
    { label: "Closing", value: 54, tone: "risk" as const },
    { label: "Confidence", value: 76, tone: "brand" as const },
  ];

  const run = async () => {
    setLoading(true);
    setScored(false);
    await sleep(AI_THINKING_MS);
    setLoading(false);
    setScored(true);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-navy-900">
          <ClipboardCheck className="h-4 w-4 text-ai-500" /> Paste call transcript
        </h3>
        <textarea
          defaultValue={"Advisor: Hi po, thanks for your time today...\nClient: Sure, but I only have a few minutes.\nAdvisor: No problem! So tell me about your family...\n[transcript continues]"}
          rows={12}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm outline-none focus:border-ai-400 focus:ring-2 focus:ring-ai-100"
        />
        <button
          onClick={run}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-ai-500/25 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Score My Call
        </button>
      </Card>

      <Card className={scored ? "ai-glow" : ""}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-navy-900">AI Scorecard</h3>
          <AIBadge />
        </div>
        {!scored && !loading && (
          <p className="py-16 text-center text-sm text-slate-400">
            AI scores Rapport, Discovery, Closing & Confidence with coaching
            tips.
          </p>
        )}
        {loading && <div className="h-64 animate-pulse rounded-xl bg-slate-50" />}
        {scored && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-ai-500/10 to-brand-500/5 p-4">
              <span className="text-3xl font-bold text-ai-700">70</span>
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  Overall: Solid call
                </p>
                <p className="text-xs text-slate-600">
                  Strong rapport, but work on your closing.
                </p>
              </div>
            </div>
            {scores.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-navy-900">{s.label}</span>
                  <span className="font-semibold text-slate-600">{s.value}/100</span>
                </div>
                <Progress value={s.value} tone={s.tone} />
              </div>
            ))}
            <div className="rounded-xl bg-gold-500/10 p-3 text-sm text-slate-700 ring-1 ring-gold-500/20">
              <b className="text-gold-700">Coaching tip:</b> You asked great
              discovery questions but didn&apos;t ask for the close. Next time, try
              a trial close: &quot;Does this feel like something that fits your
              family&apos;s needs?&quot;
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
