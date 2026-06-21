import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { COMPANY_MAP, THEME_COOKIE } from "@/lib/insurance-companies";
import { safeNextPath } from "@/lib/safe-redirect";

/**
 * OAuth callback — Supabase redirects here after Google sign-in with a `?code`.
 * We exchange it for a session (which sets the auth cookies on the response),
 * restore the advisor's company theme, then continue to the app.
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

  // Restore the advisor's saved company theme, if they have one.
  const company = data.user?.user_metadata?.company;
  if (typeof company === "string" && COMPANY_MAP[company]) {
    (await cookies()).set(THEME_COOKIE, company, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return NextResponse.redirect(`${origin}${next}`);
}
