"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";

export function AuthForm({
  mode,
  next,
}: {
  mode: "login" | "signup";
  next?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "login"
            ? "Sign in to your WealthFlow workspace."
            : "Start your AI-powered sales workspace in seconds."}
        </p>
      </div>

      {state?.error && (
        <p className="rounded-xl border border-risk-500/20 bg-risk-500/5 px-3 py-2.5 text-sm text-risk-700">
          {state.error}
        </p>
      )}

      {mode === "signup" && (
        <Field label="Full name">
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Den Jansen Flores"
            className={inputCls}
          />
        </Field>
      )}

      <Field label="Email">
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@email.com"
          className={inputCls}
        />
      </Field>

      <Field label="Password">
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          placeholder="••••••••"
          className={inputCls}
        />
      </Field>

      {next && <input type="hidden" name="next" value={next} />}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition hover:opacity-90 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-500">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
      </span>
      {children}
    </label>
  );
}
