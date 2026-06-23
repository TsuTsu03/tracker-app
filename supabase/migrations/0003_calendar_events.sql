-- WealthFlow — calendar events
-- Personal schedule entries (daily + monthly). Same multi-tenant model as the
-- rest of the schema: every row is owned by an advisor and RLS isolates it.
-- Apply to the WealthFlow project: `supabase db push` or paste into the SQL
-- editor of THAT project (not any other Supabase project).

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  advisor_id  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null,
  description text not null default '',
  location    text not null default '',
  starts_at   timestamptz not null default now(),
  ends_at     timestamptz not null default now(),
  all_day     boolean not null default false,
  -- Personal | Meeting | Follow-up | Review | Reminder
  category    text not null default 'Personal',
  created_at  timestamptz not null default now()
);

create index if not exists events_advisor_idx on public.events (advisor_id);
create index if not exists events_starts_idx  on public.events (advisor_id, starts_at);

-- Row Level Security — each advisor sees only their own events.
alter table public.events enable row level security;

drop policy if exists "own rows" on public.events;
create policy "own rows" on public.events
  for all using (advisor_id = auth.uid()) with check (advisor_id = auth.uid());
