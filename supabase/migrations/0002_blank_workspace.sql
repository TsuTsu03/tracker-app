-- ─────────────────────────────────────────────────────────────────────────────
-- 0002 — Blank workspace
--
-- WealthFlow ships with NO mock data. New advisors start with a completely
-- empty book: no leads, no clients, no tasks/tickets/claims, no team or
-- production history. Everything they see is data they (or the AI) created.
--
-- This migration:
--   1. Replaces the starter-seed function with a no-op, so future signups get
--      a blank workspace (the on_auth_user_created trigger still creates the
--      profile row — only the demo data is gone).
--   2. Purges the demo rows already inserted into existing accounts.
--
-- Safe to run multiple times.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Future signups: seed nothing. Keep the signature so handle_new_user()
--    keeps working without modification.
create or replace function public.seed_starter_data(uid uuid, advisor_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Intentionally empty: advisors begin with a blank workspace.
  return;
end $$;

-- 2. Existing accounts: remove the previously seeded demo data so every
--    screen is blank until the advisor adds real records.
truncate table
  public.leads,
  public.clients,
  public.tasks,
  public.tickets,
  public.claims,
  public.team_members,
  public.production_trend
restart identity;
