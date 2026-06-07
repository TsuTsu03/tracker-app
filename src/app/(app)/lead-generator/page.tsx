"use client";

import { useState } from "react";
import { PageHeader, Card, AIBadge, Badge, Avatar } from "@/components/ui";
import { prospectResearch, sleep, AI_THINKING_MS } from "@/lib/ai";
import { cn } from "@/lib/utils";
import {
  Radar,
  Search,
  Sparkles,
  Globe,
  Phone,
  MapPin,
  Loader2,
  Plus,
  Check,
  Lightbulb,
  MessageSquareQuote,
} from "lucide-react";

const PROFESSIONS = [
  "Doctors",
  "Dentists",
  "Engineers",
  "Architects",
  "Lawyers",
  "Business Owners",
  "Restaurant Owners",
  "Freelancers",
];

type Discovered = {
  name: string;
  business: string;
  occupation: string;
  location: string;
  phone: string;
  website: string;
  temp: "Hot" | "Warm" | "Cold";
  bracket: string;
  reason: string;
  added?: boolean;
};

const SAMPLE: Discovered[] = [
  {
    name: "Dr. Camille Bautista",
    business: "Bautista Dental Care",
    occupation: "Dentist",
    location: "Quezon City",
    phone: "0917 ••• ••42",
    website: "bautistadental.ph",
    temp: "Hot",
    bracket: "₱250k–400k/mo",
    reason: "Established clinic, 3 branches, strong online reviews → high income, succession need.",
  },
  {
    name: "Dr. Enrique Salonga",
    business: "Smile Studio Dental",
    occupation: "Dentist",
    location: "Quezon City",
    phone: "0918 ••• ••09",
    website: "smilestudio.ph",
    temp: "Hot",
    bracket: "₱200k–350k/mo",
    reason: "Premium cosmetic clinic, active FB ads → growing, likely underinsured.",
  },
  {
    name: "Dr. Faith Ledesma",
    business: "Kids First Dental",
    occupation: "Pediatric Dentist",
    location: "Quezon City",
    phone: "0920 ••• ••77",
    website: "kidsfirst.ph",
    temp: "Warm",
    bracket: "₱150k–250k/mo",
    reason: "Young practice owner, recently married → protection trigger event.",
  },
  {
    name: "Dr. Marco Venturanza",
    business: "Ortho Plus Center",
    occupation: "Orthodontist",
    location: "Quezon City",
    phone: "0915 ••• ••31",
    website: "orthoplus.ph",
    temp: "Warm",
    bracket: "₱180k–300k/mo",
    reason: "Specialist, high-margin services, no visible group plan.",
  },
];

export default function LeadGeneratorPage() {
  const [profession, setProfession] = useState("Dentists");
  const [location, setLocation] = useState("Quezon City");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Discovered[]>([]);
  const [research, setResearch] = useState<{
    name: string;
    data: ReturnType<typeof prospectResearch>;
  } | null>(null);
  const [researching, setResearching] = useState(false);

  const run = async () => {
    setLoading(true);
    setResults([]);
    await sleep(AI_THINKING_MS + 400);
    setResults(SAMPLE.map((s) => ({ ...s })));
    setLoading(false);
  };

  const add = (i: number) =>
    setResults((r) => r.map((x, idx) => (idx === i ? { ...x, added: true } : x)));

  const doResearch = async (d: Discovered) => {
    setResearching(true);
    setResearch(null);
    await sleep(AI_THINKING_MS);
    setResearch({ name: d.name, data: prospectResearch(d.name, d.occupation) });
    setResearching(false);
  };

  return (
    <div className="animate-in">
      <PageHeader
        title="AI Lead Generator"
        subtitle="Discover, qualify, and research public business leads — the killer feature"
        icon={Radar}
        accent="ai"
        actions={<AIBadge>Killer Feature</AIBadge>}
      />

      {/* Search panel */}
      <Card className="ai-glow mb-6 bg-gradient-to-br from-white to-ai-500/[0.03]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_1fr_auto] md:items-end">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Profession / Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PROFESSIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setProfession(p)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition",
                    profession === p
                      ? "bg-ai-500 text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ai-400 focus:ring-2 focus:ring-ai-100"
              />
            </div>
          </div>
          <button
            onClick={run}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-500 to-ai-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-ai-500/25 transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? "Scanning…" : "Discover Leads"}
          </button>
        </div>
      </Card>

      {loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Results */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4 text-ai-500" />
              Found <b>{results.length}</b> {profession.toLowerCase()} in{" "}
              {location}, AI-qualified by income bracket & online presence.
            </p>
            <div className="space-y-3">
              {results.map((d, i) => (
                <Card key={i} className="hover-lift">
                  <div className="flex items-start gap-3">
                    <Avatar name={d.name} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-navy-900">{d.name}</p>
                        <Badge tone={d.temp}>{d.temp}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{d.business}</p>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {d.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {d.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {d.website}
                        </span>
                      </div>
                      <div className="mt-2 rounded-lg bg-ai-500/5 px-3 py-2 text-xs text-slate-600 ring-1 ring-ai-500/10">
                        <span className="font-semibold text-ai-700">
                          AI Qualification:
                        </span>{" "}
                        {d.reason}
                        <span className="ml-1 font-semibold text-money-700">
                          Est. {d.bracket}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => add(i)}
                      disabled={d.added}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition",
                        d.added
                          ? "bg-money-500/10 text-money-700"
                          : "bg-brand-600 text-white hover:bg-brand-700",
                      )}
                    >
                      {d.added ? (
                        <>
                          <Check className="h-4 w-4" /> Added to pipeline
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> Add to pipeline
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => doResearch(d)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ai-500/10 py-2 text-sm font-semibold text-ai-700 transition hover:bg-ai-500/20"
                    >
                      <Sparkles className="h-4 w-4" /> AI Research
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Research panel */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Card className="ai-glow">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-navy-900">AI Prospect Research</h2>
                <AIBadge />
              </div>
              {researching && (
                <div className="flex items-center gap-3 py-10 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin text-ai-500" />
                  Researching prospect…
                </div>
              )}
              {!researching && !research && (
                <p className="py-10 text-center text-sm text-slate-400">
                  Click <b>AI Research</b> on any lead to generate a full
                  prospect profile, talking points & product angle.
                </p>
              )}
              {!researching && research && (
                <div className="space-y-4 text-sm">
                  <p className="font-semibold text-navy-900">{research.name}</p>
                  <p className="leading-relaxed text-slate-600">
                    {research.data.summary}
                  </p>

                  <Section title="Possible Financial Concerns">
                    {research.data.concerns.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </Section>
                  <Section title="Potential Insurance Needs">
                    {research.data.needs.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </Section>

                  <div>
                    <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <MessageSquareQuote className="h-3.5 w-3.5" /> Conversation
                      Starters
                    </p>
                    <div className="space-y-2">
                      {research.data.starters.map((s) => (
                        <p
                          key={s}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700"
                        >
                          {s}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-gold-500/10 p-3 ring-1 ring-gold-500/20">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-gold-700">
                      <Lightbulb className="h-3.5 w-3.5" /> Suggested Product Angle
                    </p>
                    <p className="mt-1 text-slate-700">
                      {research.data.productAngle}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <ul className="list-inside list-disc space-y-1 text-slate-700 marker:text-ai-400">
        {children}
      </ul>
    </div>
  );
}
