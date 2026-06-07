// Mock "AI" engine for zero-config demo mode.
// Swap these functions with real Claude API / Supabase Edge Function calls later.

import type { Lead } from "./types";

export const AI_THINKING_MS = 900;

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function prospectResearch(name: string, occupation = "professional") {
  return {
    summary: `${name} is an established ${occupation} with a stable, above-average income and a growing set of financial responsibilities. Public signals suggest career progression and increasing assets — a strong window for protection and wealth-building conversations.`,
    concerns: [
      "Income protection if unable to work",
      "Insufficient emergency liquidity",
      "No structured retirement vehicle",
      "Estate / wealth-transfer inefficiency",
    ],
    needs: [
      "Life insurance (income replacement)",
      "Critical illness & health coverage",
      "VUL for long-term wealth accumulation",
      "Education fund (if with dependents)",
    ],
    starters: [
      `"${name.split(" ")[0]}, what would happen to your family's lifestyle if your income stopped for 12 months?"`,
      `"How are you currently setting aside for retirement outside of SSS/GSIS?"`,
      `"If we could grow your savings tax-efficiently while protecting your family, would that be worth 20 minutes?"`,
    ],
    productAngle:
      "Lead with a VUL that blends protection + investment, positioned as 'forced savings with a safety net.' Anchor on legacy and lifestyle continuity.",
    questions: [
      "What financial goal keeps you up at night?",
      "Who depends on your income today?",
      "When do you ideally want to stop working?",
      "Have you reviewed your coverage in the last 3 years?",
    ],
  };
}

export function objectionResponses(objection: string) {
  const o = objection.toLowerCase();
  const topic = o.includes("expensive") || o.includes("afford") || o.includes("mahal")
    ? "price"
    : o.includes("already") || o.includes("meron")
      ? "existing"
      : o.includes("think") || o.includes("isip")
        ? "stall"
        : "general";

  const banks: Record<string, Record<string, string>> = {
    price: {
      Soft: "I completely understand — budget matters. That's exactly why we start small and scale as your income grows. Many clients begin with as little as ₱2,000/month. Can we find a number that feels comfortable for you?",
      Consultative: "Let's reframe 'expensive.' What's expensive is your family losing your income with no plan. We can right-size coverage to your cashflow today and review it yearly. May I show you a starter option?",
      Aggressive: "Here's the truth: it's only expensive until the day you need it — then it's the best decision you ever made. The cheapest time to buy protection is right now, at your age. Shall we lock your rate today?",
      Educational: "Premiums are priced on age and health — both will only increase. Securing coverage now actually lowers your lifetime cost. Let me show you how the math works over 10 years.",
    },
    existing: {
      Soft: "That's great that you're already protected! May I do a quick, no-pressure review to make sure your coverage still matches your current life stage? Many policies become outdated as income and family grow.",
      Consultative: "Wonderful. The question isn't whether you have insurance — it's whether it's enough. Most employer plans end when you leave the company. Can we check your gap together?",
      Aggressive: "Having insurance and having the RIGHT insurance are two different things. Most people are underinsured by 60%. Let me find your blind spot in 10 minutes — free of charge.",
      Educational: "Employer coverage typically caps at 1–2x salary and ends with your job. A personal policy is portable and built around YOUR goals. Here's the difference side by side.",
    },
    stall: {
      Soft: "Of course, this is an important decision. While you think it over, may I send you a simple one-pager so you're deciding with full information? When's a good day to reconnect?",
      Consultative: "Totally fair. Usually 'I'll think about it' means one of three things — price, trust, or timing. Which one is it for you? Let's address it now so you can decide with clarity.",
      Aggressive: "I respect that — but tomorrow isn't guaranteed, and neither is your insurability. What specifically do you need to think about? Let's solve it right here.",
      Educational: "Take your time. Just know that approval depends on your health today. One medical change can make coverage costly or impossible. Here's why timing matters more than people think.",
    },
    general: {
      Soft: "I hear you, and there's no pressure at all. My job is just to make sure you have the right information. What would make this an easy 'yes' for you?",
      Consultative: "Help me understand your hesitation a bit more — what's the real concern behind that? Once I know, I can tailor this to fit you perfectly.",
      Aggressive: "Let's not overthink this. You came this far because protecting your family matters. Let's take the next step today and adjust later if needed.",
      Educational: "Great question. Let me give you the facts so you can decide confidently — no jargon, just the essentials you need to know.",
    },
  };
  return banks[topic];
}

export function meetingSummary() {
  return {
    concerns: [
      "Worried about kids' college tuition (eldest enters college in 3 yrs)",
      "No income protection if unable to work",
      "Wants to retire by 60 but has no formal plan",
    ],
    painPoints: ["Scattered savings", "Over-reliant on business cashflow"],
    objections: ["Concerned about premium affordability during lean months"],
    budget: "₱8,000 – ₱12,000 / month",
    nextAction:
      "Send VUL proposal (₱120k/yr) with flexible top-up + education rider. Follow up in 3 days.",
  };
}

export function followUpMessage(opts: {
  name: string;
  channel: string;
  tone: string;
  language: string;
}) {
  const { name, tone, language } = opts;
  const first = name.split(" ")[0];
  if (language === "Taglish") {
    if (tone === "Casual")
      return `Hi ${first}! 😊 Salamat ulit sa time kanina. Na-excite ako kasi perfect yung VUL plan sa goals mo — protection plus may ipon ka pa. Pwede ka ba this week para i-walk through ko sayo yung numbers? Wala pong pressure, kwentuhan lang. 🙌`;
    return `Hi ${first}, maraming salamat po sa inyong oras. Base sa ating napag-usapan, naihanda ko na po ang inyong financial proposal na naka-align sa inyong mga goals. Kailan po kayo available para pag-usapan? Salamat po!`;
  }
  if (tone === "Casual")
    return `Hey ${first}! 👋 Really enjoyed our chat. I put together a plan that fits exactly what you mentioned — protection + growth. Free for a quick 15-min call this week to walk you through it? No pressure at all!`;
  if (tone === "Formal")
    return `Dear ${first},\n\nThank you for your time. As discussed, I have prepared a tailored financial proposal aligned with your goals and budget. I would be glad to schedule a brief follow-up at your convenience.\n\nWarm regards,`;
  return `Hi ${first}, thanks again for the great conversation! I've prepared a proposal based on what matters most to you. When works best for a quick walkthrough this week?`;
}

export function leadHealthAlerts(leads: Lead[]) {
  return leads
    .filter((l) => l.temperature === "Hot" && l.stage !== "Closed Won" && l.stage !== "Closed Lost")
    .map((l) => ({
      lead: l,
      days: Math.floor((Date.now() - new Date(l.lastContact).getTime()) / 86400000),
    }))
    .filter((x) => x.days >= 7)
    .sort((a, b) => b.days - a.days);
}

export function generateProposal(input: {
  age: number;
  income: number;
  dependents: number;
  goal: string;
}) {
  const annualIncome = input.income * 12;
  const recommendedCover = Math.round((annualIncome * 10) / 1000000) * 1000000;
  const existing = Math.round(recommendedCover * 0.2);
  const gap = recommendedCover - existing;
  const premium = Math.round((gap * 0.012) / 1000) * 1000;
  return {
    recommendedCover,
    existing,
    gap,
    annualPremium: premium,
    monthlyPremium: Math.round(premium / 12 / 100) * 100,
    products: [
      { name: "WealthLink VUL", alloc: 60, purpose: "Protection + investment growth" },
      { name: "HealthShield Rider", alloc: 25, purpose: "Critical illness & hospitalization" },
      ...(input.dependents > 0
        ? [{ name: "EduSave Rider", alloc: 15, purpose: "Children's education fund" }]
        : [{ name: "Retirement Top-up", alloc: 15, purpose: "Tax-efficient retirement" }]),
    ],
    script: `Based on your income of ₱${input.income.toLocaleString()}/month and ${input.dependents} dependent(s), your family would need roughly ₱${recommendedCover.toLocaleString()} to maintain their lifestyle. You currently have about ₱${existing.toLocaleString()}, leaving a protection gap of ₱${gap.toLocaleString()}. My recommendation closes that gap for about ₱${Math.round(premium / 12 / 100) * 100}/month — less than a daily coffee, for complete peace of mind around your goal of "${input.goal}".`,
  };
}
