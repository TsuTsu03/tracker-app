"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState(false);

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    setGoogleError(false);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${
          next ? `?next=${encodeURIComponent(next)}` : ""
        }`,
      },
    });
    // On success the browser is redirected to Google; we only land here on error.
    if (error) {
      setGoogleError(true);
      setGoogleLoading(false);
    }
  };

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <h1 className="font-display text-[1.7rem] font-medium tracking-tight text-navy-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "login"
            ? "Access your wealth workspace and strategic insights."
            : "Join the next generation of financial advisory."}
        </p>
      </div>

      {(state?.error || googleError) && (
        <p className="rounded-xl border border-risk-500/20 bg-risk-500/5 px-3 py-2.5 text-sm text-risk-700">
          {googleError
            ? "Google sign-in failed. Please try again or use email."
            : state?.error}
        </p>
      )}

      {/* Continue with Google — works for both sign-in and sign-up. */}
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={googleLoading}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-hairline bg-surface py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-surface-2 disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          or
        </span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

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

      {mode === "signup" && (
        <label className="flex items-start gap-2.5 text-sm text-slate-500">
          <input
            name="agree"
            type="checkbox"
            value="yes"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline text-brand-600 focus:ring-brand-500/30"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="font-semibold text-brand-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="font-semibold text-brand-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
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

/** Official Google "G" mark (multi-color), sized for the social button. */
function GoogleIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const inputCls =
  "w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

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
