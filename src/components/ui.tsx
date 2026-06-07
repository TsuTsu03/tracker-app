import { cn, initials, stringToHue } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function Avatar({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const hue = stringToHue(name);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-sm ring-2 ring-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 45%))`,
      }}
    >
      {initials(name)}
    </span>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}

const badgeStyles: Record<string, string> = {
  Hot: "bg-risk-500/10 text-risk-600 ring-risk-500/20",
  Warm: "bg-gold-500/10 text-gold-600 ring-gold-500/20",
  Cold: "bg-sky-500/10 text-sky-600 ring-sky-500/20",
  High: "bg-risk-500/10 text-risk-600 ring-risk-500/20",
  Medium: "bg-gold-500/10 text-gold-600 ring-gold-500/20",
  Low: "bg-slate-500/10 text-slate-600 ring-slate-500/20",
  "In Force": "bg-money-500/10 text-money-700 ring-money-500/20",
  Released: "bg-money-500/10 text-money-700 ring-money-500/20",
  Approved: "bg-money-500/10 text-money-700 ring-money-500/20",
  Resolved: "bg-money-500/10 text-money-700 ring-money-500/20",
  "Grace Period": "bg-gold-500/10 text-gold-600 ring-gold-500/20",
  Processing: "bg-brand-500/10 text-brand-600 ring-brand-500/20",
  "In Progress": "bg-brand-500/10 text-brand-600 ring-brand-500/20",
  Submitted: "bg-brand-500/10 text-brand-600 ring-brand-500/20",
  Pending: "bg-slate-500/10 text-slate-600 ring-slate-500/20",
  Open: "bg-gold-500/10 text-gold-600 ring-gold-500/20",
  Lapsed: "bg-risk-500/10 text-risk-600 ring-risk-500/20",
};

export function Badge({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tone && badgeStyles[tone]
          ? badgeStyles[tone]
          : "bg-slate-500/10 text-slate-600 ring-slate-500/20",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function AIBadge({ children = "AI" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ai-500/10 px-2.5 py-0.5 text-xs font-semibold text-ai-600 ring-1 ring-inset ring-ai-500/25">
      <Sparkles className="h-3 w-3" />
      {children}
    </span>
  );
}

export function ScoreRing({
  score,
  size = 56,
}: {
  score: number;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#f43f5e";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#eceef5"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ color, fontSize: size * 0.28 }}
      >
        {score}
      </span>
    </div>
  );
}

export function Progress({
  value,
  tone = "brand",
  className,
}: {
  value: number;
  tone?: "brand" | "money" | "gold" | "ai" | "risk";
  className?: string;
}) {
  const colors: Record<string, string> = {
    brand: "bg-brand-500",
    money: "bg-money-500",
    gold: "bg-gold-500",
    ai: "bg-ai-500",
    risk: "bg-risk-500",
  };
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700", colors[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  accent = "brand",
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: "brand" | "money" | "gold" | "ai";
  actions?: React.ReactNode;
}) {
  const accents: Record<string, string> = {
    brand: "from-brand-500 to-brand-700",
    money: "from-money-500 to-money-700",
    gold: "from-gold-400 to-gold-600",
    ai: "from-ai-500 to-ai-600",
  };
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
              accents[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}
