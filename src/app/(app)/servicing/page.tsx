import { PageHeader, Card, Badge, Avatar } from "@/components/ui";
import { CLIENTS, TICKETS, CLAIMS } from "@/lib/demo-data";
import { peso, formatDate, daysSince, cn } from "@/lib/utils";
import {
  ShieldCheck,
  Banknote,
  HandCoins,
  Ticket,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function ServicingPage() {
  // Build premium tracking from client policies
  const premiums = CLIENTS.flatMap((c) =>
    c.policies.map((p) => ({
      client: c.fullName,
      seed: c.fullName,
      product: p.product,
      amount: p.premium,
      due: p.nextDue,
      status: p.status,
    })),
  ).sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  const overdue = premiums.filter((p) => new Date(p.due) < new Date());
  const claimSteps = ["Submitted", "Processing", "Approved", "Released"];

  return (
    <div className="animate-in">
      <PageHeader
        title="Client Servicing"
        subtitle="Premiums, claims & service tickets — keep every policy in force"
        icon={ShieldCheck}
        accent="money"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Mini label="Policies In Force" value={String(premiums.filter((p) => p.status === "In Force").length)} icon={ShieldCheck} tone="money" />
        <Mini label="Overdue / Grace" value={String(overdue.length)} icon={AlertTriangle} tone="risk" />
        <Mini label="Open Tickets" value={String(TICKETS.filter((t) => t.status !== "Resolved").length)} icon={Ticket} tone="gold" />
        <Mini label="Active Claims" value={String(CLAIMS.filter((c) => c.status !== "Released").length)} icon={HandCoins} tone="brand" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Premium tracking */}
        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
            <Banknote className="h-4 w-4 text-money-500" /> Premium Tracking
          </h3>
          <div className="space-y-2.5">
            {premiums.map((p, i) => {
              const isOverdue = new Date(p.due) < new Date();
              const soon = daysSince(p.due) > -45 && !isOverdue;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3",
                    isOverdue
                      ? "border-risk-500/20 bg-risk-500/5"
                      : "border-slate-100",
                  )}
                >
                  <Avatar name={p.seed} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">
                      {p.client}
                    </p>
                    <p className="truncate text-xs text-slate-500">{p.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-money-700">
                      {peso(p.amount, { compact: true })}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isOverdue
                          ? "font-semibold text-risk-600"
                          : soon
                            ? "text-gold-600"
                            : "text-slate-400",
                      )}
                    >
                      {isOverdue ? "Overdue · " : "Due "}
                      {formatDate(p.due)}
                    </p>
                  </div>
                  {p.status !== "In Force" && (
                    <Badge tone={p.status}>{p.status}</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Claims tracking */}
        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
            <HandCoins className="h-4 w-4 text-gold-500" /> Claims Tracking
          </h3>
          <div className="space-y-4">
            {CLAIMS.map((c) => {
              const step = claimSteps.indexOf(c.status);
              return (
                <div key={c.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-navy-900">
                        {c.client}
                      </p>
                      <p className="text-xs text-slate-500">
                        {c.type} · {c.policy}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-money-700">
                      {peso(c.amount, { compact: true })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {claimSteps.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              "h-3 w-3 rounded-full",
                              i <= step ? "bg-money-500" : "bg-slate-200",
                            )}
                          />
                          <span
                            className={cn(
                              "mt-1 text-[10px]",
                              i <= step
                                ? "font-semibold text-money-700"
                                : "text-slate-400",
                            )}
                          >
                            {s}
                          </span>
                        </div>
                        {i < claimSteps.length - 1 && (
                          <div
                            className={cn(
                              "mx-1 h-0.5 flex-1",
                              i < step ? "bg-money-400" : "bg-slate-200",
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Service tickets */}
      <Card className="mt-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
          <Ticket className="h-4 w-4 text-brand-500" /> Service Tickets
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2.5 pr-3 font-semibold">Client</th>
                <th className="px-3 py-2.5 font-semibold">Request</th>
                <th className="px-3 py-2.5 font-semibold">Priority</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">Age</th>
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((t) => (
                <tr key={t.id} className="border-b border-slate-50">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={t.client} size={32} />
                      <span className="font-medium text-navy-900">{t.client}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{t.request}</td>
                  <td className="px-3 py-3">
                    <Badge tone={t.priority}>{t.priority}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone={t.status}>{t.status}</Badge>
                  </td>
                  <td className="px-3 py-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {daysSince(t.created)}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Mini({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "money" | "risk" | "gold" | "brand";
}) {
  const colors = {
    money: "text-money-600 bg-money-500/10",
    risk: "text-risk-600 bg-risk-500/10",
    gold: "text-gold-600 bg-gold-500/10",
    brand: "text-brand-600 bg-brand-500/10",
  };
  return (
    <Card>
      <div className={cn("mb-2 flex h-9 w-9 items-center justify-center rounded-lg", colors[tone])}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xl font-bold text-navy-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </Card>
  );
}
