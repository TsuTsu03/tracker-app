"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { ProductMedia, youtubeSearchUrl } from "@/components/product-media";
import {
  PRODUCT_MAP,
  CATEGORY_LABEL,
} from "@/lib/insurance-companies";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Layers,
  PlusCircle,
  UserCheck,
  Wallet,
  PieChart,
  HelpCircle,
  Lock,
  Lightbulb,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export default function ProductPrimerPage() {
  const { slug } = useParams<{ slug: string }>();
  const { companyId } = useTheme();

  // The theme value is only correct after the client mounts (SSR renders the
  // neutral default), so we defer the company-access check until then.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const resolved = PRODUCT_MAP[slug];

  if (!resolved) return notFound();
  const { product, company } = resolved;
  const accent = company.color;
  const isMine = company.id === companyId;
  const videoQuery = `${company.short} ${product.name} explained`;

  // Products outside the advisor's own company are not part of their library.
  if (mounted && !isMine) return <OutsideCompanyGate />;

  return (
    <div className="animate-in mx-auto max-w-5xl space-y-8 pb-10">
      {/* Back */}
      <Link
        href="/company"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to product library
      </Link>

      {/* Hero */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ProductMedia
            seed={slug}
            accent={accent}
            category={product.category}
            title={product.name}
            videoQuery={videoQuery}
          />
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ring-1 ring-black/5"
              style={{ background: accent, color: company.onColor }}
            >
              {company.short
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {company.short}
            </span>
          </div>
          <h1 className="mt-3 font-display text-[2rem] font-medium leading-tight tracking-tight text-navy-900">
            {product.name}
          </h1>
          <p className="mt-1.5 text-base text-slate-600">{product.tagline}</p>
          <span
            className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: accent }}
          >
            {CATEGORY_LABEL[product.category]}
          </span>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {h}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={youtubeSearchUrl(videoQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:border-slate-300"
            >
              <ExternalLink className="h-4 w-4" /> Watch on YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Overview */}
      <Section icon={Lightbulb} title="Overview" accent={accent}>
        <p className="text-[15px] leading-relaxed text-slate-700">
          {product.overview}
        </p>
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Benefits */}
        <Section icon={ShieldCheck} title="Key benefits" accent={accent}>
          <BulletList items={product.benefits} accent={accent} />
        </Section>

        {/* Coverage */}
        <Section icon={Layers} title="What's covered" accent={accent}>
          <BulletList items={product.coverage} accent={accent} />
        </Section>

        {/* Riders */}
        {product.riders && product.riders.length > 0 && (
          <Section icon={PlusCircle} title="Optional riders / add-ons" accent={accent}>
            <div className="flex flex-wrap gap-2">
              {product.riders.map((r) => (
                <span
                  key={r}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {r}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Fund options */}
        {product.fundOptions && product.fundOptions.length > 0 && (
          <Section icon={PieChart} title="Fund options" accent={accent}>
            <BulletList items={product.fundOptions} accent={accent} />
          </Section>
        )}

        {/* Eligibility */}
        <Section icon={UserCheck} title="Eligibility" accent={accent}>
          <BulletList items={product.eligibility} accent={accent} />
        </Section>

        {/* Premium */}
        <Section icon={Wallet} title="Premium & payment" accent={accent}>
          <p className="text-[15px] leading-relaxed text-slate-700">
            {product.premium}
          </p>
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-100">
            Figures are indicative study estimates — always quote from the
            carrier&apos;s official illustration.
          </p>
        </Section>
      </div>

      {/* Ideal for */}
      <div
        className="rounded-2xl p-5 text-white"
        style={{ background: `linear-gradient(120deg, ${accent}, #0a1027)` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          Best pitched to
        </p>
        <p className="mt-1 text-lg font-semibold">{product.idealFor}</p>
      </div>

      {/* FAQs */}
      <Section icon={HelpCircle} title="Frequently asked questions" accent={accent}>
        <div className="space-y-2">
          {product.faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-slate-200 bg-white px-4 py-3 open:bg-slate-50"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-navy-900 marker:content-none">
                {f.q}
                <span className="text-slate-400 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <p className="text-center text-xs text-slate-400">
        Study material compiled for advisor reference. Product names and features
        belong to {company.short}; confirm current details on the official
        website before client presentations.
      </p>
    </div>
  );
}

function OutsideCompanyGate() {
  return (
    <div className="animate-in mx-auto max-w-xl">
      <Link
        href="/company"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to product library
      </Link>
      <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
          <Lock className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-navy-900">
          Not part of your product library
        </h3>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          This product belongs to a different insurance company. You only have
          access to the line-up of the company you registered with.
        </p>
        <Link
          href="/company"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <BookOpen className="h-4 w-4" /> Go to my products
        </Link>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
          style={{ background: accent }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-bold text-navy-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, accent }: { items: string[]; accent: string }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2.5 text-[15px] text-slate-700">
          <Check
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: accent }}
          />
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}
