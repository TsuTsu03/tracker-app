# WealthFlow — Production Setup

This app is fully live: real authentication, a real Supabase database, and live
Gemini AI. There is **no mock data** — every screen reads from your own data.

## 1. Environment variables

Copy `.env.example` → `.env.local` and fill in all three values:

```
GOOGLE_AI_API_KEY=...            # https://aistudio.google.com/app/apikey
NEXT_PUBLIC_SUPABASE_URL=...     # Supabase → Project Settings → Data API
NEXT_PUBLIC_SUPABASE_ANON_KEY=...# Supabase → Project Settings → API Keys (anon/public)
```

## 2. Create the database

1. Create a free project at https://supabase.com
2. Open **SQL Editor** and run the migration in
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).

This creates all tables, Row-Level Security policies (each advisor only sees
their own data), and a trigger that — on every new signup — creates the
advisor's profile and seeds a realistic starter book (leads, clients, policies,
tasks, tickets, claims, team, production trend).

## 3. Auth settings (recommended for quick start)

By default Supabase requires email confirmation. For instant sign-in during
development, go to **Authentication → Sign In / Providers → Email** and turn
**"Confirm email"** off. (Leave it on for production.)

## 4. Run

```
npm install
npm run dev
```

Visit http://localhost:3000 → you'll be redirected to **/login**. Create an
account at **/signup**; your workspace is seeded automatically and you land on
the dashboard.

## How it fits together

- **`src/proxy.ts`** — refreshes the Supabase session and gates every route
  (unauthenticated → `/login`). (In Next 16 this file is `proxy.ts`, formerly
  `middleware.ts`.)
- **`src/lib/supabase/server.ts` / `client.ts`** — SSR + browser Supabase clients.
- **`src/lib/data.ts`** — server-side queries; RLS scopes every result to the
  signed-in advisor.
- **`src/app/actions/`** — server actions for auth (`auth.ts`), CRM mutations
  (`crm.ts`), and AI (`ai.ts`). The Gemini key never reaches the browser.
