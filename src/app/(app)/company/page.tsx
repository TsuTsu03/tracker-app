"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useTheme } from "@/components/theme-provider";
import { ProductThumb } from "@/components/product-media";
import { CATEGORY_LABEL, productSlug } from "@/lib/insurance-companies";
import {
  BookOpen,
  ArrowRight,
  Lock,
  Building2,
} from "lucide-react";

export default function CompanyPage() {
  const { company, hasCompany } = useTheme();

  return (
    <div className="animate-in space-y-8">
      <PageHeader
        title="My Company & Products"
        subtitle="Study the product line-up of your insurance company."
        icon={BookOpen}
      />

      {/* ── Product library — scoped to the advisor's registered company ── */}
      {!hasCompany || !company ? (
        <LockedState />
      ) : (
        <>
          {/* Company hero */}
          <div
            className="relative mb-2 overflow-hidden rounded-3xl p-6 text-white sm:p-8"
            style={{ background: company.color, color: company.onColor }}
          >
            <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <span className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-black/10" />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
                <Building2 className="h-3.5 w-3.5" /> Est. {company.founded}
              </span>
              <h3 className="mt-3 font-display text-[1.8rem] font-medium leading-tight tracking-tight sm:text-[2.1rem]">
                {company.name}
              </h3>
              <p className="mt-2 text-sm opacity-90">{company.about}</p>
              <p className="mt-4 text-sm font-semibold">
                {company.products.length} products to study →
              </p>
            </div>
          </div>

          <div className="mb-1 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Product Library — study what you sell
            </h2>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {company.products.map((p) => {
              const slug = productSlug(company.id, p.name);
              return (
                <Link
                  key={slug}
                  href={`/company/${slug}`}
                  className="group card flex flex-col overflow-hidden p-0 hover-lift"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ProductThumb
                      seed={slug}
                      accent={company.color}
                      className="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <span
                      className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white shadow"
                      style={{ background: company.color }}
                    >
                      {CATEGORY_LABEL[p.category]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h4 className="text-base font-bold text-navy-900">
                      {p.name}
                    </h4>
                    <p className="mt-0.5 text-sm text-slate-500">{p.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                      Study primer
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function LockedState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
        <Lock className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-navy-900">
        No company linked to your account yet
      </h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        Your product library is set by the insurance company you chose when you
        registered. If this looks wrong, sign out and sign back in to refresh
        your workspace.
      </p>
    </div>
  );
}
