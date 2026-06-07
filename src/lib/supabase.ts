import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Zero-config demo mode.
 *
 * If NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are present,
 * a real Supabase client is returned. Otherwise the app runs entirely on the
 * bundled demo data (see lib/demo-data.ts) — no setup required.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isDemoMode = !url || !anon;

export const supabase: SupabaseClient | null = isDemoMode
  ? null
  : createClient(url!, anon!);
