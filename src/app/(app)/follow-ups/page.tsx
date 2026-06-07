"use client";

import { useState } from "react";
import { PageHeader, Card, AIBadge, Badge, Avatar } from "@/components/ui";
import { followUpMessage, sleep, AI_THINKING_MS } from "@/lib/ai";
import { LEADS, TASKS } from "@/lib/demo-data";
import { cn, daysSince } from "@/lib/utils";
import {
  Send,
  Sparkles,
  Loader2,
  Bell,
  MessageCircle,
  Mail,
  Smartphone,
  Copy,
  Check,
  Repeat,
  Clock,
} from "lucide-react";

export default function FollowUpsPage() {
  return (
    <div className="animate-in">
      <PageHeader
        title="Follow-up Automation"
        subtitle="Smart reminders, AI-written messages & re-engagement campaigns"
        icon={Send}
        accent="ai"
        actions={<AIBadge />}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <Reminders />
          <Reengagement />
        </div>
        <Generator />
      </div>
    </div>
  );
}

function Reminders() {
  const cadence = [
    { day: "Day 1", label: "Thank-you + recap", done: true },
    { day: "Day 3", label: "Value follow-up", done: true },
    { day: "Day 7", label: "Proposal nudge", done: false, active: true },
    { day: "Day 14", label: "Final check-in", done: false },
  ];
  return (
    <Card>
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
        <Bell className="h-4 w-4 text-gold-500" /> Smart Reminder Cadence
      </h3>
      <div className="mb-5 flex items-center justify-between">
        {cadence.map((c, i) => (
          <div key={c.day} className="flex flex-1 items-center">
            <div className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold",
                  c.done
                    ? "bg-money-500 text-white"
                    : c.active
                      ? "bg-gold-500 text-white ring-4 ring-gold-500/20"
                      : "bg-slate-100 text-slate-400",
                )}
              >
                {c.done ? <Check className="h-4 w-4" /> : c.day.split(" ")[1]}
              </span>
              <p className="mt-1.5 w-20 text-[11px] font-medium text-navy-900">
                {c.label}
              </p>
            </div>
            {i < cadence.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1",
                  c.done ? "bg-money-400" : "bg-slate-200",
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {TASKS.filter((t) => t.type === "Follow-up" || t.type === "Call").map(
          (t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
            >
              <Clock className="h-4 w-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-900">{t.title}</p>
                <p className="text-xs text-slate-400">Re: {t.relatedTo}</p>
              </div>
              <Badge tone={t.priority}>{t.priority}</Badge>
            </div>
          ),
        )}
      </div>
    </Card>
  );
}

function Reengagement() {
  const inactive = LEADS.filter(
    (l) => daysSince(l.lastContact) > 12 && !l.stage.startsWith("Closed"),
  );
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-navy-900">
          <Repeat className="h-4 w-4 text-ai-500" /> Re-engagement Campaign
        </h3>
        <Badge tone="Hot">{inactive.length} inactive</Badge>
      </div>
      <p className="mb-3 text-sm text-slate-500">
        AI detected these prospects going cold. Launch a tailored 3-touch
        sequence to win them back.
      </p>
      <div className="space-y-2">
        {inactive.map((l) => (
          <div
            key={l.id}
            className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
          >
            <Avatar name={l.avatarSeed ?? l.fullName} size={36} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-900">{l.fullName}</p>
              <p className="text-xs text-slate-500">{l.stage}</p>
            </div>
            <button className="rounded-lg bg-ai-500/10 px-3 py-1.5 text-xs font-semibold text-ai-700 transition hover:bg-ai-500/20">
              Launch sequence
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

const CHANNELS = [
  { id: "Messenger", icon: MessageCircle },
  { id: "SMS", icon: Smartphone },
  { id: "Email", icon: Mail },
];

function Generator() {
  const [lead, setLead] = useState(LEADS[1]);
  const [channel, setChannel] = useState("Messenger");
  const [tone, setTone] = useState("Casual");
  const [language, setLanguage] = useState("Taglish");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setLoading(true);
    setMsg(null);
    await sleep(AI_THINKING_MS);
    setMsg(followUpMessage({ name: lead.fullName, channel, tone, language }));
    setLoading(false);
  };

  const copy = () => {
    if (msg) navigator.clipboard?.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="lg:sticky lg:top-20 lg:self-start">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-navy-900">AI Follow-up Generator</h3>
        <AIBadge />
      </div>

      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Lead
      </label>
      <select
        value={lead.id}
        onChange={(e) =>
          setLead(LEADS.find((l) => l.id === e.target.value) ?? LEADS[0])
        }
        className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ai-400"
      >
        {LEADS.map((l) => (
          <option key={l.id} value={l.id}>
            {l.fullName}
          </option>
        ))}
      </select>

      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Channel
      </label>
      <div className="mb-3 flex gap-2">
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            onClick={() => setChannel(c.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition",
              channel === c.id
                ? "border-ai-400 bg-ai-500/10 text-ai-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50",
            )}
          >
            <c.icon className="h-4 w-4" /> {c.id}
          </button>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-ai-400"
          >
            {["Casual", "Friendly", "Formal"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-ai-400"
          >
            {["Taglish", "English"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-ai-500/25 transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Generate Message
      </button>

      {msg && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-900">
            {msg}
          </p>
          <button
            onClick={copy}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy message"}
          </button>
        </div>
      )}
    </Card>
  );
}
