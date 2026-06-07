import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Avatar, Badge, Progress, AIBadge } from "@/components/ui";
import { CLIENTS } from "@/lib/demo-data";
import { peso, formatDate, relativeDays, cn } from "@/lib/utils";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldCheck,
  Users2,
  Target,
  Sparkles,
  CalendarCheck,
  FileSignature,
  CheckCircle2,
  Banknote,
  HandCoins,
  Flag,
} from "lucide-react";

const TIMELINE_ICON = {
  meeting: CalendarCheck,
  application: FileSignature,
  approval: CheckCircle2,
  payment: Banknote,
  claim: HandCoins,
  milestone: Flag,
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = CLIENTS.find((c) => c.id === id);
  if (!client) notFound();

  const coverage = client.policies.reduce((s, p) => s + p.faceAmount, 0);
  const premium = client.policies.reduce((s, p) => s + p.premium, 0);

  return (
    <div className="animate-in">
      <Link
        href="/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      {/* Header */}
      <Card className="mb-6 overflow-hidden p-0">
        <div className="bg-gradient-to-br from-brand-600 to-navy-800 p-6 text-white">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={client.fullName} size={72} />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{client.fullName}</h1>
              <p className="text-white/80">
                {client.occupation} · {client.location}
              </p>
              <p className="text-sm text-white/60">
                Client since {formatDate(client.clientSince)}
              </p>
            </div>
            <div className="flex gap-2">
              <a className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/25">
                <Phone className="mr-1.5 inline h-4 w-4" /> Call
              </a>
              <Link
                href="/follow-ups"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-white/90"
              >
                <Mail className="mr-1.5 inline h-4 w-4" /> Message
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
          <HeadStat label="Relationship Health" value={`${client.relationshipScore}/100`} tone={client.relationshipScore < 60 ? "risk" : "money"} />
          <HeadStat label="Total Coverage" value={peso(coverage, { compact: true })} />
          <HeadStat label="Annual Premium" value={peso(premium, { compact: true })} />
          <HeadStat label="Last Contact" value={relativeDays(client.lastContact)} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-6">
          {/* AI Relationship */}
          <Card className={cn(client.relationshipScore < 60 && "border-l-4 border-l-risk-500")}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-navy-900">
                <Heart className="h-4 w-4 text-risk-400" /> Relationship Health
              </h3>
              <AIBadge />
            </div>
            <Progress
              value={client.relationshipScore}
              tone={client.relationshipScore >= 75 ? "money" : client.relationshipScore >= 60 ? "gold" : "risk"}
            />
            <p className="mt-3 text-sm text-slate-600">
              {client.relationshipScore < 60 ? (
                <>
                  ⚠️ This relationship needs attention. Last contact was{" "}
                  {relativeDays(client.lastContact)}.{" "}
                  <span className="font-semibold text-ai-700">
                    Suggested action: Schedule an Annual Financial Review.
                  </span>
                </>
              ) : (
                <>
                  ✅ Healthy relationship. Great candidate for a{" "}
                  <span className="font-semibold text-money-700">
                    top-up or referral introduction.
                  </span>
                </>
              )}
            </p>
          </Card>

          <Card>
            <h3 className="mb-3 font-semibold text-navy-900">Contact</h3>
            <div className="space-y-2.5 text-sm">
              <Row icon={Phone} value={client.phone} />
              <Row icon={Mail} value={client.email} />
              <Row icon={MapPin} value={client.location} />
              <Row icon={Users2} value={`${client.civilStatus} · ${client.dependents} dependents`} />
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
              <Target className="h-4 w-4 text-brand-500" /> Goals
            </h3>
            <div className="flex flex-wrap gap-2">
              {client.goals.map((g) => (
                <Badge key={g} tone="In Force">
                  {g}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {client.notes}
            </p>
          </Card>

          <Card>
            <h3 className="mb-3 font-semibold text-navy-900">Beneficiaries</h3>
            <div className="space-y-2">
              {client.beneficiaries.map((b) => (
                <div
                  key={b.name}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={b.name} size={32} />
                    <div>
                      <p className="text-sm font-medium text-navy-900">{b.name}</p>
                      <p className="text-xs text-slate-400">{b.relation}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-brand-600">{b.share}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Middle: policies */}
        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-navy-900">
              <ShieldCheck className="h-4 w-4 text-money-500" /> Policies
            </h3>
            <div className="space-y-3">
              {client.policies.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-navy-900">{p.product}</p>
                      <p className="text-xs text-slate-400">
                        {p.type} · {p.frequency}
                      </p>
                    </div>
                    <Badge tone={p.status}>{p.status}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Face Amount</p>
                      <p className="font-semibold text-navy-900">
                        {peso(p.faceAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Premium</p>
                      <p className="font-semibold text-money-700">
                        {peso(p.premium)}/{p.frequency === "Annual" ? "yr" : p.frequency === "Monthly" ? "mo" : "qtr"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-400">Next Due</p>
                      <p
                        className={cn(
                          "font-semibold",
                          new Date(p.nextDue) < new Date()
                            ? "text-risk-600"
                            : "text-navy-900",
                        )}
                      >
                        {formatDate(p.nextDue)}
                        {new Date(p.nextDue) < new Date() && " · overdue"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: timeline */}
        <div>
          <Card>
            <h3 className="mb-4 font-semibold text-navy-900">
              Relationship Timeline
            </h3>
            <ol className="relative space-y-5 border-l-2 border-slate-100 pl-6">
              {[...client.timeline].reverse().map((e, i) => {
                const Icon = TIMELINE_ICON[e.type];
                return (
                  <li key={i} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white",
                        e.type === "payment"
                          ? "bg-money-500"
                          : e.type === "claim"
                            ? "bg-gold-500"
                            : e.type === "approval"
                              ? "bg-brand-500"
                              : "bg-slate-300",
                      )}
                    >
                      <Icon className="h-3 w-3 text-white" />
                    </span>
                    <p className="text-sm font-medium text-navy-900">{e.label}</p>
                    <p className="text-xs text-slate-400">{formatDate(e.date)}</p>
                  </li>
                );
              })}
            </ol>
            <Link
              href="/servicing"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <Sparkles className="h-4 w-4 text-ai-500" /> View servicing & claims
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeadStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "risk" | "money";
}) {
  return (
    <div className="p-4">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-lg font-bold",
          tone === "risk"
            ? "text-risk-600"
            : tone === "money"
              ? "text-money-700"
              : "text-navy-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-slate-700">
      <Icon className="h-4 w-4 text-slate-400" />
      {value}
    </div>
  );
}
