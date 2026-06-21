import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { LEGAL } from "@/lib/legal";

/**
 * Shared chrome for the public legal pages (/privacy, /terms). Renders the
 * back-to-home nav, the title block, a standing "not legal advice" notice, and
 * a prose container that styles plain <h2>/<p>/<ul> children via child variants
 * (no typography plugin needed).
 */
export function LegalDoc({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-navy-900">
      <header className="border-b border-hairline bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <span className="font-display text-base font-semibold leading-none text-gold-200">
                W
              </span>
            </span>
            <span className="font-display text-base font-semibold text-navy-900">
              {LEGAL.appName}
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-display text-3xl font-medium tracking-tight text-navy-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Effective {LEGAL.effectiveDate} · Last updated {LEGAL.lastUpdated}
        </p>
        <p className="mt-5 text-base leading-relaxed text-slate-600">{intro}</p>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold-400/30 bg-gold-200/30 px-4 py-3 text-sm text-navy-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
          <p>
            This is a starting template drafted against Philippine law. It is{" "}
            <strong>not legal advice</strong>. Replace the bracketed placeholders
            and have it reviewed by Philippine counsel (and registered with the{" "}
            <strong>National Privacy Commission</strong> where required) before
            you rely on it.
          </p>
        </div>

        <article
          className="mt-10 text-sm leading-relaxed text-slate-600 [&_a]:font-medium [&_a]:text-brand-600 [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-navy-900 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-navy-900 [&_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:text-navy-900 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6"
        >
          {children}
        </article>

        <footer className="mt-16 border-t border-hairline pt-6 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {LEGAL.appName}. Questions about this
            document? Contact{" "}
            <a href={`mailto:${LEGAL.contactEmail}`} className="text-brand-600 underline">
              {LEGAL.contactEmail}
            </a>
            .
          </p>
          <p className="mt-2 flex gap-4">
            <Link href="/privacy" className="hover:text-navy-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-navy-900">
              Terms of Service
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
