import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-redirect";

/**
 * OAuth callback — Supabase redirects here after Google sign-in with a `?code`.
 * We exchange it for a session (which sets the auth cookies on the response),
 * then continue to the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Only allow same-origin relative paths. Reject `//host`, `/\host`, and the
  // `@host` userinfo trick (`origin + "@evil.com"` → redirect to evil.com).
  const next = safeNextPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  // Record consent on first OAuth login (the user had to tick the Terms/Privacy
  // box to reach Google). Stamp it once so OAuth signups have the same
  // demonstrable-consent audit trail as email signups.
  if (data.user && !data.user.user_metadata?.terms_accepted_at) {
    await supabase.auth.updateUser({
      data: { terms_accepted_at: new Date().toISOString() },
    });
  }

  return NextResponse.redirect(`${origin}${next}`);
}
