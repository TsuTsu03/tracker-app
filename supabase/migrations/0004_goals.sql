-- WealthFlow — production goals (incentive trips / MDRT / APE targets)
-- An advisor sets a target APE by a deadline (e.g. "Japan Incentive — ₱1,000,000
-- by 2026-06-30"). `current_ape` is editable by the advisor because credited APE
-- differs from raw policy APE (double/triple-credit closings). Same multi-tenant
-- model as the rest of the schema. Apply to the WealthFlow project.

create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  advisor_id  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null,
  target_ape  numeric not null default 0,
  current_ape numeric not null default 0,
  deadline    date not null,
  note        text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists goals_advisor_idx on public.goals (advisor_id);

alter table public.goals enable row level security;

drop policy if exists "own rows" on public.goals;
create policy "own rows" on public.goals
  for all using (advisor_id = auth.uid()) with check (advisor_id = auth.uid());
