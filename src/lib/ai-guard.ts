/**
 * Guards for the AI Server Actions.
 *
 * Server Actions are publicly-reachable POST endpoints — the proxy only gates
 * page navigation, not action invocation. Every action that spends a paid
 * third-party API call (Groq, Tavily) MUST therefore verify the caller is a
 * signed-in advisor, and clamp attacker-controlled text before it reaches the
 * model (token-cost abuse / prompt bloat).
 */

import { createClient } from "@/lib/supabase/server";

/** Throws "Unauthorized" unless the request carries a valid Supabase session. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/**
 * Cap user-supplied text before it's interpolated into a prompt. Defends the
 * (now authenticated) endpoints against runaway token cost from huge payloads.
 */
export function clamp(text: string | undefined | null, max = 4000): string {
  return String(text ?? "").slice(0, max);
}
