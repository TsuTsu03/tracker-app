import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Radar,
  GraduationCap,
  BrainCircuit,
  FileText,
  ShieldCheck,
  Globe,
  Check,
  TrendingUp,
} from "lucide-react";

/**
 * Public marketing landing (the Stitch "Advisor OS" page) — shown at `/` to
 * logged-out visitors. Authenticated users are redirected to /dashboard by the
 * proxy before this renders.
 *
 * Built to the Stitch layout, but with HONEST copy: the Stitch mock's invented
 * metrics, fake client logos and false CRM integrations are replaced with what
 * WealthFlow actually does (real PH carriers, Groq Llama 3.3, web-grounded AI).
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-navy-900">
      <LandingNav />

      <main>
        <Hero />
        <Stats />
        <AdvisorOS />
        <Intelligence />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

function LandingNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-hairline bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 ring-1 ring-white/10">
            <span className="font-display text-lg font-semibold leading-none text-gold-200">
              W
            </span>
          </span>
          <span className="font-display text-lg font-semibold text-navy-900">
            WealthFlow
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#platform" className="text-sm font-medium text-slate-600 transition-colors hover:text-navy-900">
            Platform
          </a>
          <a href="#intelligence" className="text-sm font-medium text-slate-600 transition-colors hover:text-navy-900">
            Intelligence
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-navy-900"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="platform" className="relative overflow-hidden pt-28 lg:pt-36">
      {/* ambient brand/gold glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45rem 30rem at 85% -5%, rgba(233,193,118,0.10), transparent 60%), radial-gradient(40rem 30rem at 0% 110%, rgba(10,37,46,0.05), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-5 pb-24 lg:grid-cols-2 lg:px-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gold-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold-600">
            <Sparkles className="h-3.5 w-3.5" /> Powered by Groq · Llama 3.3
          </span>

          <h1 className="mt-7 font-display text-[2.5rem] font-medium leading-[1.1] tracking-tight text-navy-950 sm:text-[3.25rem]">
            The intelligent operating system for Filipino financial advisors.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            Find real prospects from the live web, score every lead, auto-draft
            follow-ups and generate proposals in seconds — one calm, intelligent
            workflow from first contact to policy servicing.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg border border-hairline bg-surface px-7 py-3.5 text-sm font-semibold text-navy-900 transition hover:bg-surface-2"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-600" /> Free AI on Groq
            </span>
          </div>
        </div>

        {/* Product preview card (illustrative) */}
        <div className="relative">
          <div className="rotate-1 rounded-2xl border border-hairline bg-surface p-5 shadow-[0_30px_80px_-30px_rgba(10,37,46,0.35)] transition-transform duration-500 hover:rotate-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">
                  MTD Production
                </p>
                <p className="font-display text-2xl font-medium text-navy-900">
                  ₱1.28M
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-money-500/10 px-2.5 py-1 text-xs font-semibold text-money-700 ring-1 ring-money-500/20">
                <ArrowUpRight className="h-3.5 w-3.5" /> +24%
              </span>
            </div>
            <div className="my-4 h-px bg-hairline" />
            <p className="mb-3 text-[11px] uppercase tracking-wider text-slate-400">
              Pipeline velocity
            </p>
            <div className="flex items-end gap-1.5">
              {[40, 55, 48, 70, 62, 85, 78, 100, 92].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t bg-brand-500/50"
                  style={{ height: `${h * 0.5}px` }}
                />
              ))}
              <TrendingUp className="ml-1 h-4 w-4 text-money-600" />
            </div>
          </div>
          {/* floating gold stat */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-brand-600 p-5 text-white shadow-xl lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-75">
              Conversion lift
            </p>
            <p className="font-display text-2xl font-bold text-gold-200">
              Needs-based
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "Live web", label: "Real prospects, not invented" },
    { value: "Llama 3.3", label: "Free AI on Groq" },
    { value: "7", label: "AI copilots, end to end" },
  ];
  return (
    <section className="bg-surface-2 py-20">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group rounded-xl border border-hairline bg-surface p-8 text-center transition-colors hover:border-gold-400"
            >
              <p className="font-display text-4xl font-medium text-navy-950 transition-transform group-hover:scale-105">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: CalendarClock,
    title: "AI Meeting Assistant",
    body: "Prep briefs from real client data, turn rough notes into clean CRM entries, and extract concerns, budget and the next step — grounded only in what you actually captured.",
    span: "md:col-span-8",
    dark: false,
    bullets: ["Real-data meeting briefs", "Notes → structured CRM"],
  },
  {
    icon: Radar,
    title: "AI Lead Generator",
    body: "Finds real prospects from the live web by profession and location, with source links — not invented names.",
    span: "md:col-span-4",
    dark: true,
    bullets: [],
  },
  {
    icon: GraduationCap,
    title: "AI Sales Coach",
    body: "Handle objections four ways, roleplay tough personas, and score real call transcripts like an MDRT mentor.",
    span: "md:col-span-4",
    dark: false,
    bullets: [],
  },
  {
    icon: BrainCircuit,
    title: "Pipeline & Business Intelligence",
    body: "A drag-and-drop pipeline plus an AI mentor that diagnoses your funnel from your real numbers — and a proposal generator that does the math and the script.",
    span: "md:col-span-8",
    dark: false,
    accent: true,
    bullets: [],
  },
];

function AdvisorOS() {
  return (
    <section className="bg-surface py-28">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
        <div className="mb-14 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium tracking-tight text-navy-950 sm:text-4xl">
              The Advisor OS
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              One workspace where client intelligence meets operational mastery.
              We&apos;ve removed the friction so you can focus on the advice.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`${f.span} group relative overflow-hidden rounded-2xl border p-9 ${
                f.dark
                  ? "border-transparent bg-brand-600 text-white"
                  : f.accent
                    ? "border-gold-400/30 bg-gold-200/30"
                    : "border-hairline bg-surface-2"
              }`}
            >
              <f.icon
                className={`mb-5 h-10 w-10 ${
                  f.dark ? "text-gold-200" : "text-brand-600"
                } transition-transform duration-300 group-hover:scale-110`}
              />
              <h3
                className={`font-display text-xl font-medium ${
                  f.dark ? "text-white" : "text-navy-900"
                }`}
              >
                {f.title}
              </h3>
              <p
                className={`mt-3 max-w-md leading-relaxed ${
                  f.dark ? "text-white/70" : "text-slate-600"
                }`}
              >
                {f.body}
              </p>
              {f.bullets.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {f.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2.5 text-sm font-medium text-navy-900"
                    >
                      <Check className="h-4 w-4 text-gold-600" /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Intelligence() {
  const points = [
    {
      icon: Globe,
      title: "Grounded in real data",
      body: "Lead discovery and prospect research run live web searches (Tavily) and cite their sources — so the AI surfaces real businesses and people, not hallucinations.",
    },
    {
      icon: ShieldCheck,
      title: "Private & scoped to you",
      body: "Every record is row-level-secured to your account in Supabase. You only ever see — and the AI only ever reasons over — your own pipeline.",
    },
  ];
  return (
    <section
      id="intelligence"
      className="relative overflow-hidden bg-brand-600 py-28 text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-gold-400/10 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-20 px-5 lg:grid-cols-2 lg:px-12">
        <div>
          <span className="mb-7 inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-200">
              <BrainCircuit className="h-5 w-5 text-brand-950" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Intelligence engine
            </span>
          </span>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-[2.75rem]">
            Powered by Llama 3.3 on Groq
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
            WealthFlow runs on Groq&apos;s fast Llama 3.3 70B — free to start —
            and grounds its answers in real web data and your own CRM, so the
            output is useful and honest, not generic chatbot filler.
          </p>

          <div className="mt-10 space-y-7">
            {points.map((p) => (
              <div key={p.title} className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20">
                  <p.icon className="h-5 w-5 text-gold-200" />
                </span>
                <div>
                  <h4 className="font-display text-lg font-medium text-white">
                    {p.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* concentric badge */}
        <div className="relative flex justify-center">
          <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-full border border-white/15 p-10">
            <div className="flex h-full w-full items-center justify-center rounded-full border border-white/25 p-10">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-gold-200/25 to-transparent">
                <span className="font-display text-3xl font-bold text-gold-200">
                  WF·AI
                </span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-1/4 hidden rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md lg:block">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gold-200" />
              <span className="text-[11px] font-medium text-white/70">
                Researching prospect…
              </span>
            </div>
            <p className="font-display text-sm italic text-white/90">
              &ldquo;3 high-intent leads found on the web.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      id="carriers"
      className="relative overflow-hidden bg-surface py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 -left-64 h-[600px] w-[600px] rounded-full bg-gold-400/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1280px] px-5 text-center lg:px-12">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium tracking-tight text-navy-950 sm:text-4xl">
          Ready to grow your practice?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          Start your AI-powered sales workspace in seconds. Free AI, real data,
          built for the way Filipino advisors actually sell.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-10 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center rounded-lg border border-hairline bg-surface px-10 py-4 text-sm font-bold text-navy-900 transition hover:bg-surface-2"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-8 text-xs uppercase tracking-widest text-slate-400">
          No credit card required · Free AI on Groq
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-2">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-5 py-10 text-center sm:flex-row sm:text-left lg:px-12">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <span className="font-display text-base font-semibold leading-none text-gold-200">
              W
            </span>
          </span>
          <span className="font-display text-base font-semibold text-navy-900">
            WealthFlow
          </span>
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} WealthFlow · AI Sales OS for Filipino
          financial advisors · Powered by Llama 3.3 on Groq
        </p>
        <div className="flex flex-wrap justify-center gap-5 text-sm">
          <Link href="/privacy" className="text-slate-500 hover:text-navy-900">
            Privacy
          </Link>
          <Link href="/terms" className="text-slate-500 hover:text-navy-900">
            Terms
          </Link>
          <Link href="/login" className="text-slate-500 hover:text-navy-900">
            Sign in
          </Link>
          <Link href="/signup" className="text-slate-500 hover:text-navy-900">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}
