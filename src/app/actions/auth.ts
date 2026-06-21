"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-redirect";

export type AuthState = { error: string } | null;

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
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) return { error: error.message };

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
  const agreed = formData.get("agree") === "yes";

  if (!name || !email || !password)
    return { error: "Name, email and password are required." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };
  // Data Privacy Act requires demonstrable consent — block sign-up without it
  // and record when it was given as an audit trail.
  if (!agreed)
    return {
      error: "Please agree to the Terms of Service and Privacy Policy to continue."
    };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, terms_accepted_at: new Date().toISOString() }
    }
  });
  if (error) return { error: error.message };

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
