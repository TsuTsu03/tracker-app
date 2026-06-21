import Link from "next/link";
import { ShieldCheck, BrainCircuit, BadgeCheck, LineChart } from "lucide-react";

/**
 * Auth stage — the Stitch "Advisor OS" auth framing.
 *
 * Login:  a single white card floating over the premium office photo.
 * Signup: a two-column card (deep-navy value panel + white form) over the
 *         abstract navy background.
 *
 * The form itself (<AuthForm/>) is passed in as children and rendered inside
 * the white panel; this component only supplies the background, the card frame,
 * the brand mark and the value panel.
 */
export function AuthStage({
  mode,
  children,
}: {
  mode: "login" | "signup";
  children: React.ReactNode;
}) {
  const bg = mode === "login" ? "/auth/office.png" : "/auth/abstract.png";

  return (
    <div className="relative min-h-screen w-full">
      {/* Full-bleed premium background */}
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bg}')` }}
      />
      <div
        aria-hidden
        className="fixed inset-0 bg-brand-950/55 backdrop-blur-[2px]"
      />

      {/* Centered card */}
      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        {mode === "login" ? (
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-[0_30px_80px_-25px_rgba(0,13,19,0.55)] ring-1 ring-black/5 sm:p-9">
            <div className="mb-7 flex flex-col items-center text-center">
              <BrandMark />
            </div>
            {children}
            <AuthFooterLinks />
          </div>
        ) : (
          <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-25px_rgba(0,13,19,0.55)] ring-1 ring-black/5 lg:grid-cols-[5fr_7fr]">
            <ValuePanel />
            <div className="p-7 sm:p-9">
              {children}
              <AuthFooterLinks />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Navy square with a gold "W" — the Stitch auth brand mark. */
function BrandMark() {
  return (
    <Link href="/login" className="flex flex-col items-center gap-3">
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 shadow-sm ring-1 ring-white/10">
        <span className="font-display text-2xl font-semibold leading-none text-gold-200">
          W
        </span>
      </span>
    </Link>
  );
}

/** The deep-navy value panel beside the sign-up form (desktop only). */
function ValuePanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-600 p-10 text-white lg:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold-400/10 blur-2xl"
      />
      {/* Wordmark */}
      <div className="relative flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-200">
          <span className="font-display text-lg font-semibold leading-none text-brand-950">
            W
          </span>
        </span>
        <span className="font-display text-lg font-semibold">WealthFlow</span>
      </div>

      {/* Value proposition (no fabricated testimonial / names) */}
      <div className="relative">
        <h2 className="font-display text-[1.7rem] font-medium leading-snug tracking-tight">
          Architect your clients&apos; futures with precision.
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
          The AI sales OS that turns prospecting, follow-ups and proposals into
          one calm, intelligent workflow.
        </p>
      </div>

      {/* Feature bullets */}
      <ul className="relative space-y-3 text-sm text-white/80">
        {[
          { icon: BrainCircuit, label: "Predictive lead scoring & rebalancing" },
          { icon: LineChart, label: "Real-time pipeline & production insight" },
          { icon: BadgeCheck, label: "Built for Filipino financial advisors" },
        ].map((f) => (
          <li key={f.label} className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <f.icon className="h-3.5 w-3.5 text-gold-400" />
            </span>
            {f.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AuthFooterLinks() {
  return (
    <div className="mt-7 flex flex-col items-center gap-3 border-t border-hairline pt-5">
      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Bank-grade encryption · Powered by Llama 3.3 on Groq
      </p>
      <div className="flex items-center gap-5 text-xs text-slate-400">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Security</span>
      </div>
    </div>
  );
}
