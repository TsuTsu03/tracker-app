"use client";

import { useState } from "react";
import { PageHeader, Card, AIBadge, Badge, Avatar } from "@/components/ui";
import {
  aiProspectResearch,
  aiDiscoverLeads,
  type ProspectResearchResult,
} from "@/app/actions/ai";
import { createLead } from "@/app/actions/crm";
import { cn } from "@/lib/utils";
import {
  Radar,
  Search,
  Sparkles,
  Briefcase,
  MapPin,
  Loader2,
  Plus,
  Check,
  Lightbulb,
  MessageSquareQuote,
  Link as LinkIcon,
} from "lucide-react";

/** Show a clean host (e.g. "facebook.com") instead of a long raw URL. */
function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

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
  temp: "Hot" | "Warm" | "Cold";
  bracket: string;
  reason: string;
  source?: string;
  added?: boolean;
};

export default function LeadGeneratorPage() {
  const [profession, setProfession] = useState("Dentists");
  const [location, setLocation] = useState("Quezon City");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Discovered[]>([]);
  const [research, setResearch] = useState<{
    name: string;
    data: ProspectResearchResult;
  } | null>(null);
  const [researching, setResearching] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setResearch(null);
    try {
      const leads = await aiDiscoverLeads(profession, location);
      setResults(leads.map((l) => ({ ...l })));
      if (!leads.length)
        setError(
          "No real prospects found on the web for that profession + location. Try a broader location or another category.",
        );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setError(
        msg.includes("TAVILY")
          ? "Web search isn't configured yet — add TAVILY_API_KEY to .env.local (free key at app.tavily.com) to pull real prospects."
          : "Search is busy right now — please try again in a moment.",
      );
    }
    setLoading(false);
  };

  const add = async (i: number) => {
    const d = results[i];
    if (!d || d.added) return;
    // Optimistically mark as added, then persist to the pipeline.
    setResults((r) => r.map((x, idx) => (idx === i ? { ...x, added: true } : x)));
    const res = await createLead({
      fullName: d.name,
      occupation: d.occupation,
      company: d.business,
      location: d.location,
      temperature: d.temp,
      source: "AI Lead Generator",
    });
    if (res?.error) {
      // Roll back the optimistic flag if the insert failed.
      setResults((r) => r.map((x, idx) => (idx === i ? { ...x, added: false } : x)));
      setError("Couldn't add to pipeline — please try again.");
    }
  };

  const doResearch = async (d: Discovered) => {
    setResearching(true);
    setResearch(null);
    try {
      const data = await aiProspectResearch(d.name, d.occupation, d.business);
      setResearch({ name: d.name, data });
    } catch {
      setError("Couldn't research that prospect right now — please try again.");
    }
    setResearching(false);
  };

  return (
    <div className="animate-in">
      <PageHeader
        title="AI Lead Generator"
        subtitle="Finds real prospects from the live web by profession & location — research and add them to your pipeline"
        icon={Radar}
        accent="ai"
        actions={<AIBadge>Live Web Search</AIBadge>}
      />

      {/* Search panel */}
      <Card className="ai-ring mb-6">
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
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
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

      {error && (
        <p className="rounded-xl border border-risk-500/20 bg-risk-500/5 px-3 py-2.5 text-sm text-risk-700">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Results */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4 text-ai-500" />
              Found <b>{results.length}</b> real {profession.toLowerCase()}{" "}
              prospect{results.length === 1 ? "" : "s"} on the web in {location},
              qualified by AI.
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
                          <Briefcase className="h-3 w-3" /> {d.occupation}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {d.location}
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
                      {d.source && (
                        <a
                          href={d.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-brand-600 hover:underline"
                        >
                          <LinkIcon className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {sourceHost(d.source)}
                          </span>
                        </a>
                      )}
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
            <Card className="ai-ring">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-navy-900">AI Prospect Research</h2>
                <AIBadge>Llama 3.3 + Web</AIBadge>
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

                  {research.data.sources?.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Sources
                      </p>
                      <div className="space-y-1">
                        {research.data.sources.map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 truncate text-xs font-medium text-brand-600 hover:underline"
                          >
                            <LinkIcon className="h-3 w-3 shrink-0" />
                            <span className="truncate">{s.title || sourceHost(s.url)}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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
