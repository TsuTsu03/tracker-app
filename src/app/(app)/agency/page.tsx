import { PageHeader, Card, Avatar, Badge, Progress, AIBadge } from "@/components/ui";
import { ADVISORS, FUNNEL } from "@/lib/demo-data";
import { peso, num, cn } from "@/lib/utils";
import {
  Building2,
  Trophy,
  TrendingUp,
  Users,
  Target,
  AlertTriangle,
  Award,
  CalendarCheck,
} from "lucide-react";

export default function AgencyPage() {
  const ranked = [...ADVISORS].sort((a, b) => b.production - a.production);
  const totalProduction = ADVISORS.reduce((s, a) => s + a.production, 0);
  const totalAppts = ADVISORS.reduce((s, a) => s + a.appointments, 0);
  const totalApps = ADVISORS.reduce((s, a) => s + a.applications, 0);
  const avgConversion = Math.round(
    ADVISORS.reduce((s, a) => s + a.conversion, 0) / ADVISORS.length,
  );

  const insights = [
    {
      icon: AlertTriangle,
      tone: "risk" as const,
      text: "Paolo Rivera is struggling with prospecting — only 12 appointments (avg 22). Recommend pairing with a top performer for joint fieldwork.",
    },
    {
      icon: Target,
      tone: "gold" as const,
      text: "Miguel Torres has strong activity but a 33% conversion (team avg 39%). Suggest closing-skills coaching via the AI Sales Coach.",
    },
    {
      icon: Trophy,
      tone: "money" as const,
      text: "Jasmine Yu leads on persistency (96%) and conversion (48%). Have her run a unit huddle on referral techniques.",
    },
  ];

  return (
    <div className="animate-in">
      <PageHeader
        title="Agency Dashboard"
        subtitle="Apex Wealth + Summit Group · Makati Branch"
        icon={Building2}
      />

      {/* Team KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Team Production" value={peso(totalProduction, { compact: true })} sub="MTD APE" icon={TrendingUp} tone="money" />
        <Kpi label="Appointments" value={num(totalAppts)} sub="this month" icon={CalendarCheck} tone="brand" />
        <Kpi label="Applications" value={num(totalApps)} sub="submitted" icon={Award} tone="ai" />
        <Kpi label="Avg Conversion" value={`${avgConversion}%`} sub="appt → app" icon={Target} tone="gold" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Leaderboard */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-navy-900">
              <Trophy className="h-4 w-4 text-gold-500" /> Advisor Leaderboard
            </h3>
            <Badge tone="In Force">Live</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2.5 pr-3 font-semibold">#</th>
                  <th className="px-2 py-2.5 font-semibold">Advisor</th>
                  <th className="px-2 py-2.5 font-semibold">Appts</th>
                  <th className="px-2 py-2.5 font-semibold">Apps</th>
                  <th className="px-2 py-2.5 font-semibold">Production</th>
                  <th className="px-2 py-2.5 font-semibold">Persistency</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((a, i) => (
                  <tr
                    key={a.id}
                    className={cn(
                      "border-b border-slate-50",
                      a.name.includes("Den Jansen") && "bg-brand-500/5",
                    )}
                  >
                    <td className="py-3 pr-3">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                          i === 0
                            ? "bg-gold-500 text-white"
                            : i === 1
                              ? "bg-slate-300 text-white"
                              : i === 2
                                ? "bg-amber-700 text-white"
                                : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={a.avatarSeed} size={34} />
                        <div>
                          <p className="font-semibold text-navy-900">
                            {a.name}
                            {a.name.includes("Den Jansen") && (
                              <span className="ml-1.5 text-xs font-normal text-brand-600">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">{a.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-slate-700">{a.appointments}</td>
                    <td className="px-2 py-3 text-slate-700">{a.applications}</td>
                    <td className="px-2 py-3 font-semibold text-money-700">
                      {peso(a.production, { compact: true })}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <Progress value={a.persistency} tone="money" />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {a.persistency}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Manager Insights */}
        <Card className="ai-glow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-navy-900">Manager Insights</h3>
            <AIBadge />
          </div>
          <div className="space-y-3">
            {insights.map((ins, i) => {
              const colors = {
                risk: "bg-risk-500/5 ring-risk-500/15 text-risk-600",
                gold: "bg-gold-500/5 ring-gold-500/15 text-gold-700",
                money: "bg-money-500/5 ring-money-500/15 text-money-700",
              };
              return (
                <div
                  key={i}
                  className={cn("rounded-xl p-3 ring-1", colors[ins.tone])}
                >
                  <div className="flex items-start gap-2.5">
                    <ins.icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-sm leading-relaxed text-slate-700">
                      {ins.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
              <Users className="h-4 w-4 text-brand-500" /> Team Funnel
            </p>
            <div className="space-y-2.5">
              {FUNNEL.map((f) => (
                <div key={f.stage}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">{f.stage}</span>
                    <span className="font-semibold text-navy-900">{f.value}</span>
                  </div>
                  <Progress value={(f.value / FUNNEL[0].value) * 100} tone="brand" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "money" | "brand" | "ai" | "gold";
}) {
  const colors = {
    money: "from-money-500 to-money-700",
    brand: "from-brand-500 to-brand-700",
    ai: "from-ai-500 to-ai-600",
    gold: "from-gold-400 to-gold-600",
  };
  return (
    <Card className="hover-lift">
      <div
        className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow",
          colors[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </Card>
  );
}
