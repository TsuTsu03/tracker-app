import Link from "next/link";
import { Card, AIBadge, Avatar, Badge, ScoreRing, Delta } from "@/components/ui";
import { ProductionAreaChart, FunnelBars } from "@/components/charts";
import {
  getLeads,
  getTasks,
  getClaims,
  getProductionTrend,
  getFunnel,
  getProfile,
} from "@/lib/data";
import { leadHealthAlerts } from "@/lib/ai";
import { peso, num, cn, relativeDays } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  Target,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Clock,
  Flame,
  Hand,
} from "lucide-react";

export default async function DashboardPage() {
  const [LEADS, TASKS, CLAIMS, PRODUCTION_TREND, FUNNEL, profile] =
    await Promise.all([
      getLeads(),
      getTasks(),
      getClaims(),
      getProductionTrend(),
      getFunnel(),
      getProfile(),
    ]);
  const advisorName = profile?.name ?? "Advisor";

  const hotLeads = LEADS.filter((l) => l.temperature === "Hot").length;
  const pipelineValue = LEADS.filter(
    (l) => l.stage !== "Closed Lost",
  ).reduce((s, l) => s + l.potentialPremium, 0);
  const alerts = leadHealthAlerts(LEADS);
  const todayTasks = TASKS.filter((t) => !t.done);

  const closedWon = LEADS.filter((l) => l.stage === "Closed Won");
  const wonLeads = closedWon.length;
  const decided = wonLeads + LEADS.filter((l) => l.stage === "Closed Lost").length;
  const conversion = decided ? Math.round((wonLeads / decided) * 100) : 0;

  const lastMonth = PRODUCTION_TREND[PRODUCTION_TREND.length - 1];
  const prevMonth = PRODUCTION_TREND[PRODUCTION_TREND.length - 2];
  const mtdProduction = lastMonth?.production ?? 0;
  const mtdPctOfTarget = lastMonth?.target
    ? Math.round((mtdProduction / lastMonth.target) * 100)
    : 0;
  // Honest month-over-month production delta — derived from the real trend, not
  // a decorative figure. `null` when there's no prior month to compare against.
  const productionDelta =
    prevMonth && prevMonth.production
      ? (mtdProduction - prevMonth.production) / prevMonth.production
      : null;

  const openLeads = LEADS.filter((l) => l.stage !== "Closed Lost").length;

  // Live activity derived from real records
  const ACTIVITY_FEED = [
    ...CLAIMS.filter((c) => c.status === "Released" || c.status === "Approved").map(
      (c) => ({
        who: c.client,
        what: `claim ${c.status.toLowerCase()} — ${peso(c.amount, { compact: true })}`,
        when: relativeDays(c.filed),
        type: "win" as const,
      }),
    ),
    ...alerts.slice(0, 2).map((a) => ({
      who: a.lead.fullName,
      what: `no contact in ${a.days} days`,
      when: relativeDays(a.lead.lastContact),
      type: "risk" as const,
    })),
    ...closedWon.slice(0, 2).map((l) => ({
      who: l.fullName,
      what: `closed — ${peso(l.potentialPremium, { compact: true })}/yr`,
      when: relativeDays(l.lastContact),
      type: "win" as const,
    })),
  ].slice(0, 5);

  // KPI cards. `delta` is an honest fractional MoM change (only where the data
  // supports a real comparison); `meta` is a quiet, neutral context figure.
  // No metric ever fabricates a green up-trend to look healthy.
  const stats = [
    {
      label: "Active Leads",
      value: num(LEADS.filter((l) => !l.stage.startsWith("Closed")).length),
      sub: `${hotLeads} hot`,
      icon: Users,
      tone: "brand" as const,
      meta: `${LEADS.length} total`,
    },
    {
      label: "Pipeline Value",
      value: peso(pipelineValue, { compact: true }),
      sub: "potential APE",
      icon: Target,
      tone: "ai" as const,
      meta: `${openLeads} open`,
    },
    {
      label: "MTD Production",
      value: peso(mtdProduction, { compact: true }),
      sub: `${mtdPctOfTarget}% of target`,
      icon: Banknote,
      tone: "money" as const,
      delta: productionDelta,
    },
    {
      label: "Conversion Rate",
      value: `${conversion}%`,
      sub: `${wonLeads} closed won`,
      icon: TrendingUp,
      tone: "gold" as const,
      meta: `${decided} decided`,
    },
  ];

  const toneMap = {
    brand: "bg-brand-50 text-brand-700 ring-brand-600/15",
    ai: "bg-ai-500/8 text-ai-600 ring-ai-500/20",
    money: "bg-money-500/10 text-money-700 ring-money-600/15",
    gold: "bg-gold-500/10 text-gold-600 ring-gold-600/20",
  };

  return (
    <div className="animate-in space-y-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="flex items-center gap-2 font-display text-[1.9rem] font-medium tracking-tight text-navy-900">
            Kumusta, {advisorName.split(" ")[0]}!
            <Hand className="h-6 w-6 text-gold-500" aria-hidden="true" />
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            You have <b className="text-navy-900">{todayTasks.length} tasks</b>{" "}
            and <b className="text-risk-600">{alerts.length} leads</b> needing
            attention today.
          </p>
        </div>
        <Link
          href="/lead-generator"
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" /> Find New Leads
        </Link>
      </div>

      {/* KPI cards */}
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="hover-lift">
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset",
                  toneMap[s.tone],
                )}
              >
                <s.icon className="h-5 w-5" />
              </div>
              {"delta" in s && s.delta != null ? (
                <Delta value={s.delta} />
              ) : "meta" in s && s.meta ? (
                <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">
                  {s.meta}
                </span>
              ) : null}
            </div>
            <p className="mt-4 font-display text-[1.7rem] font-medium leading-none text-navy-900">
              {s.value}
            </p>
            <p className="mt-1.5 text-sm font-medium text-navy-800">{s.label}</p>
            <p className="mt-0.5 text-xs text-slate-500">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Production chart */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-navy-900">Production Trend</h2>
              <p className="text-xs text-slate-500">
                Monthly APE vs target — last 6 months
              </p>
            </div>
            <Badge tone="In Force">On track</Badge>
          </div>
          <ProductionAreaChart data={PRODUCTION_TREND} />
        </Card>

        {/* Conversion funnel */}
        <Card>
          <div className="mb-4">
            <h2 className="font-semibold text-navy-900">Sales Funnel</h2>
            <p className="text-xs text-slate-500">This quarter</p>
          </div>
          <FunnelBars data={FUNNEL} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* AI Lead Health Alerts */}
        <Card className="lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy-900">Lead Health</h2>
            <AIBadge>AI Monitor</AIBadge>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 4).map(({ lead, days }) => (
              <Link
                key={lead.id}
                href="/pipeline"
                className="flex items-center gap-3 rounded-xl border border-risk-500/15 bg-risk-500/5 p-3 transition hover:bg-risk-500/10"
              >
                <Avatar name={lead.avatarSeed ?? lead.fullName} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">
                    {lead.fullName}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-risk-600">
                    <AlertTriangle className="h-3 w-3" />
                    No contact in {days} days
                  </p>
                </div>
                <Badge tone="Hot">
                  <Flame className="h-3 w-3" /> {lead.aiScore}
                </Badge>
              </Link>
            ))}
            {alerts.length === 0 && (
              <p className="flex items-center gap-1.5 text-sm text-money-700">
                <CheckCircle2 className="h-4 w-4" />
                All hot leads engaged
              </p>
            )}
          </div>
        </Card>

        {/* Today's tasks */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy-900">Today&apos;s Focus</h2>
            <Link href="/follow-ups" className="text-xs font-semibold text-brand-600">
              View all
            </Link>
          </div>
          <div className="space-y-2.5">
            {todayTasks.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-2",
                    t.priority === "High"
                      ? "ring-risk-400 text-risk-500"
                      : "ring-slate-300 text-slate-300",
                  )}
                >
                  <Clock className="h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-navy-900">
                    {t.title}
                  </p>
                  <p className="text-xs text-slate-400">{t.type}</p>
                </div>
                <Badge tone={t.priority}>{t.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity feed */}
        <Card>
          <h2 className="mb-4 font-semibold text-navy-900">Live Activity</h2>
          <div className="space-y-3">
            {ACTIVITY_FEED.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    a.type === "win"
                      ? "bg-money-500/10 text-money-600"
                      : a.type === "risk"
                        ? "bg-risk-500/10 text-risk-600"
                        : "bg-ai-500/10 text-ai-600",
                  )}
                >
                  {a.type === "win" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : a.type === "risk" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm leading-snug text-navy-900">
                    <b>{a.who}</b> {a.what}
                  </p>
                  <p className="text-xs text-slate-400">{a.when}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top AI-scored opportunities */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-navy-900">
              Top Opportunities
            </h2>
            <p className="text-xs text-slate-500">
              Ranked by AI buying-potential score
            </p>
          </div>
          <Link
            href="/leads"
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            View all leads
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...LEADS]
            .filter((l) => !l.stage.startsWith("Closed"))
            .sort((a, b) => b.aiScore - a.aiScore)
            .slice(0, 3)
            .map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 hover-lift"
              >
                <ScoreRing score={l.aiScore} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy-900">
                    {l.fullName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {l.occupation}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge tone={l.temperature}>{l.temperature}</Badge>
                    <span className="text-xs font-medium text-money-700">
                      {peso(l.potentialPremium, { compact: true })}/yr
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
