"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { COMPANY_MAP, THEME_COOKIE } from "@/lib/insurance-companies";
import { safeNextPath } from "@/lib/safe-redirect";

export type AuthState = { error: string } | null;

async function rememberCompany(id: string) {
  (await cookies()).set(THEME_COOKIE, id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
  });
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  // Only allow same-origin relative paths — a crafted `?next=https://evil.com`
  // link must not become an open-redirect after login. See safeNextPath.
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) return { error: error.message };

  // Restore the advisor's company theme from their account so the right
  // products/colors show after logging in on a new device.
  const company = data.user?.user_metadata?.company;
  if (typeof company === "string" && COMPANY_MAP[company]) {
    await rememberCompany(company);
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const company = String(formData.get("company") ?? "").trim();

  if (!name || !email || !password)
    return { error: "Name, email and password are required." };
  if (!company || !COMPANY_MAP[company])
    return { error: "Please select your insurance company." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, company } }
  });
  if (error) return { error: error.message };

  await rememberCompany(company);

  // If email confirmation is enabled, there's no active session yet.
  if (!data.session) {
    return {
      error:
        "Account created. Please check your email to confirm, then sign in."
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
