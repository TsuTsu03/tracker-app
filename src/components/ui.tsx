import { cn, initials, stringToHue } from "@/lib/utils";
import { Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";

/**
 * Skeleton — a content-shaped loading placeholder (see `.skeleton` in
 * globals.css). Compose several to mirror a page's real layout while its data
 * streams in. `aria-hidden` because the shape carries no semantic content; the
 * route's own loading affordance is the live region.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("skeleton rounded-md", className)} aria-hidden="true" />
  );
}

/**
 * Delta — an honest change indicator. Takes a fractional change (0.24 → "+24%")
 * and colors itself by sign: money-green up, clay-red down. Render this ONLY
 * when a real prior-period comparison exists — never fabricate a delta to
 * decorate a metric. Pass `neutralZero` to render exact-zero change in a quiet
 * neutral tone instead of green.
 */
export function Delta({
  value,
  neutralZero = true,
}: {
  value: number;
  neutralZero?: boolean;
}) {
  const isZero = Math.round(value * 100) === 0;
  const up = value >= 0;
  const tone =
    isZero && neutralZero
      ? "bg-slate-500/10 text-slate-600"
      : up
        ? "bg-money-500/10 text-money-700"
        : "bg-risk-500/10 text-risk-600";
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const pctValue = Math.round(value * 100);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
        tone,
      )}
    >
      {!isZero && <Icon className="h-3 w-3" aria-hidden="true" />}
      {pctValue > 0 ? "+" : ""}
      {pctValue}%
    </span>
  );
}

export function Avatar({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  // Quiet, monochrome-ish initials: a low-saturation tint derived from the
  // name gives each person a stable identity without the rainbow-gradient
  // look. Flat fill, hairline ring — editorial, not loud.
  const hue = stringToHue(name);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ring-inset",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `hsl(${hue} 24% 93%)`,
        color: `hsl(${hue} 30% 34%)`,
        boxShadow: `inset 0 0 0 1px hsl(${hue} 24% 86%)`,
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
    <span className="inline-flex items-center gap-1 rounded-full bg-ai-500/8 px-2 py-0.5 text-[11px] font-semibold text-ai-600 ring-1 ring-inset ring-ai-500/20">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
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
    score >= 80
      ? "var(--color-brand-600)"
      : score >= 60
        ? "var(--color-gold-500)"
        : "var(--color-risk-500)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-slate-200)"
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
          style={{ transition: "stroke-dashoffset 0.9s var(--ease-out)" }}
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
        className={cn("h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out)]", colors[tone])}
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
    brand: "bg-brand-50 text-brand-700 ring-brand-600/15",
    money: "bg-money-500/10 text-money-700 ring-money-600/15",
    gold: "bg-gold-500/10 text-gold-600 ring-gold-600/20",
    ai: "bg-ai-500/8 text-ai-600 ring-ai-500/20",
  };
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset",
              accents[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="font-display text-[1.7rem] font-medium leading-tight tracking-tight text-navy-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
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
