# WealthFlow — AI Sales OS for Financial Advisors

> _From lead generation to policy servicing, everything a Financial Advisor needs in one platform._

A modern, AI-powered CRM & sales operating system built for Philippine financial advisors. Replaces the scattered mess of Excel, Messenger, Viber, and notebooks with one centralized, beautiful platform.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Recharts**, and **Supabase** — running in **zero-config demo mode** so you can explore it immediately.

---

## ✨ Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

No setup needed — the app boots on rich bundled demo data. To go live, copy `.env.example` → `.env.local` and add your Supabase keys.

---

## 🎨 Design — psychology of color

The palette is chosen to earn trust and signal growth, which is exactly what an advisor sells:

| Color | Meaning | Used for |
|-------|---------|----------|
| **Navy / Indigo** | trust, stability, security, authority | brand, sidebar, primary actions |
| **Emerald** | money, growth, prosperity, "go" | premiums, production, positive metrics |
| **Gold / Amber** | premium, wealth, optimism | high-value highlights, warnings |
| **Violet** | intelligence, innovation | every AI feature (the "magic") |
| **Rose** | risk, urgency, churn | at-risk leads/clients (used sparingly) |
| **Slate** | calm, clarity | neutral canvas |

Clean cards, soft shadows, glassmorphism topbar, subtle motion, fully responsive.

---

## 🧩 Modules

| Module | Page | Highlights |
|--------|------|-----------|
| **Dashboard** | `/dashboard` | KPIs, production trend, funnel, AI lead-health alerts, live activity |
| **Lead Database** | `/leads` | Searchable/filterable table, AI score, slide-over profile drawer |
| **Sales Pipeline** | `/pipeline` | HubSpot-style **drag-and-drop** Kanban across 10 stages |
| **AI Lead Generator** ⭐ | `/lead-generator` | Discover & qualify public business leads, one-click AI prospect research |
| **Clients** | `/clients` + `/clients/[id]` | Relationship-health scoring, policies, beneficiaries, timeline |
| **AI Meeting Assistant** | `/meetings` | Meeting briefs, note structuring, AI summary & next action |
| **AI Sales Coach** | `/coach` | Objection handling (4 styles), roleplay simulator, call scoring |
| **AI Proposal Generator** | `/proposals` | Needs analysis, protection-gap math, premium & presentation script |
| **Follow-up Automation** | `/follow-ups` | Smart reminder cadence, Taglish/English message generator, re-engagement |
| **Client Servicing** | `/servicing` | Premium tracking, claims pipeline, service tickets |
| **Agency Dashboard** | `/agency` | Team KPIs, advisor leaderboard, AI manager insights |
| **Business Intelligence** | `/intelligence` | Personal AI advisor, revenue forecast, opportunity & lapse prediction |

---

## 🏗️ Architecture

```
src/
  app/
    (app)/            # authenticated shell (sidebar + topbar) wraps all pages
      dashboard/ leads/ pipeline/ lead-generator/ clients/[id]/
      meetings/ coach/ proposals/ follow-ups/ servicing/ agency/ intelligence/
  components/          # shell, sidebar, topbar, ui primitives, charts
  lib/
    types.ts          # domain model (Lead, Client, Policy, Advisor, …)
    demo-data.ts      # rich PH-context sample data (zero-config mode)
    ai.ts             # mock AI engine — swap for Claude API / Edge Functions
    supabase.ts       # auto demo/live switch based on env vars
    utils.ts          # peso formatting, dates, avatars
```

### Going live
1. Add Supabase keys to `.env.local` — `lib/supabase.ts` auto-switches out of demo mode.
2. Create tables matching `lib/types.ts` and swap demo-data reads for Supabase queries.
3. Replace the mock functions in `lib/ai.ts` with real Claude API calls (e.g. via a Supabase Edge Function) for genuine lead scoring, research, and message generation.

---

## 📜 Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```

_Demo mode — all data is fictional and for demonstration only._
