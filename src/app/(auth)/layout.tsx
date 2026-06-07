import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-900 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-brand-500/30 via-ai-500/20 to-money-500/20 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-ai-500 to-money-500 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-bold">WealthFlow</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              AI Sales OS
            </p>
          </div>
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight">
            The AI Sales Operating System for Filipino Financial Advisors.
          </h2>
          <p className="mt-4 max-w-md text-slate-300">
            Manage leads, close faster with AI copilots, and grow your book —
            all in one beautiful, intelligent workspace.
          </p>
        </div>
        <p className="relative text-xs text-slate-400">
          Powered by Gemini · Built on Supabase
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
