import Link from "next/link";
import { PageHeader, Card, Avatar, Badge, Progress, AIBadge } from "@/components/ui";
import { getClients } from "@/lib/data";
import { peso, relativeDays, daysSince, cn } from "@/lib/utils";
import { UserCheck, ChevronRight, AlertTriangle, Heart } from "lucide-react";

export default async function ClientsPage() {
  const CLIENTS = await getClients();
  const atRisk = [...CLIENTS]
    .filter((c) => c.relationshipScore < 60 || daysSince(c.lastContact) > 120)
    .sort((a, b) => a.relationshipScore - b.relationshipScore)[0];
  const totalAUM = CLIENTS.reduce(
    (s, c) => s + c.policies.reduce((p, pol) => p + pol.faceAmount, 0),
    0,
  );
  const totalPremium = CLIENTS.reduce(
    (s, c) => s + c.policies.reduce((p, pol) => p + pol.premium, 0),
    0,
  );

  return (
    <div className="animate-in">
      <PageHeader
        title="Client Management"
        subtitle={`${CLIENTS.length} clients · ${peso(totalAUM, { compact: true })} total coverage`}
        icon={UserCheck}
        accent="money"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Mini label="Total Clients" value={String(CLIENTS.length)} />
        <Mini label="Coverage in Force" value={peso(totalAUM, { compact: true })} />
        <Mini label="Annual Premium" value={peso(totalPremium, { compact: true })} />
        <Mini
          label="At-Risk Relationships"
          value={String(CLIENTS.filter((c) => c.relationshipScore < 60).length)}
          tone="risk"
        />
      </div>

      {/* AI Relationship Manager banner — derived from live data */}
      {atRisk && (
        <Card className="mb-6 flex flex-wrap items-center gap-3 border-l-4 border-l-ai-500 bg-gradient-to-r from-ai-500/5 to-transparent">
          <AIBadge>Relationship Manager</AIBadge>
          <p className="flex-1 text-sm text-slate-700">
            <b>{atRisk.fullName}</b> hasn&apos;t been contacted in{" "}
            {daysSince(atRisk.lastContact)} days (health score{" "}
            {atRisk.relationshipScore}/100).
            <span className="font-semibold text-ai-700">
              {" "}
              Suggested action: Schedule an Annual Financial Review.
            </span>
          </p>
          <Link
            href={`/clients/${atRisk.id}`}
            className="rounded-lg bg-ai-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-ai-600"
          >
            Review now
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CLIENTS.map((c) => {
          const coverage = c.policies.reduce((s, p) => s + p.faceAmount, 0);
          const premium = c.policies.reduce((s, p) => s + p.premium, 0);
          const stale = daysSince(c.lastContact) > 120;
          return (
            <Link key={c.id} href={`/clients/${c.id}`}>
              <Card className="hover-lift h-full">
                <div className="flex items-start gap-4">
                  <Avatar name={c.fullName} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-semibold text-navy-900">
                        {c.fullName}
                      </p>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-500">{c.occupation}</p>
                    <p className="text-xs text-slate-400">{c.location}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Heart className="h-3 w-3 text-risk-400" /> Relationship
                      Health
                    </span>
                    <span
                      className={cn(
                        "font-bold",
                        c.relationshipScore >= 75
                          ? "text-money-600"
                          : c.relationshipScore >= 60
                            ? "text-gold-600"
                            : "text-risk-600",
                      )}
                    >
                      {c.relationshipScore}/100
                    </span>
                  </div>
                  <Progress
                    value={c.relationshipScore}
                    tone={
                      c.relationshipScore >= 75
                        ? "money"
                        : c.relationshipScore >= 60
                          ? "gold"
                          : "risk"
                    }
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 py-2">
                    <p className="text-xs font-bold text-navy-900">
                      {c.policies.length}
                    </p>
                    <p className="text-[10px] text-slate-400">Policies</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 py-2">
                    <p className="text-xs font-bold text-money-700">
                      {peso(coverage, { compact: true })}
                    </p>
                    <p className="text-[10px] text-slate-400">Coverage</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 py-2">
                    <p className="text-xs font-bold text-navy-900">
                      {peso(premium, { compact: true })}
                    </p>
                    <p className="text-[10px] text-slate-400">Premium/yr</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Last contact {relativeDays(c.lastContact)}
                  </p>
                  {stale && (
                    <Badge tone="Hot">
                      <AlertTriangle className="h-3 w-3" /> Needs attention
                    </Badge>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Mini({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "risk";
}) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={cn(
          "mt-1 text-xl font-bold",
          tone === "risk" ? "text-risk-600" : "text-navy-900",
        )}
      >
        {value}
      </p>
    </Card>
  );
}
