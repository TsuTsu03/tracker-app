"use server";

/**
 * AI Server Actions — all Gemini calls happen here (server-side).
 * The API key never reaches the browser.
 */

import { promptJSON, promptText } from "@/lib/gemini";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ProspectResearchResult = {
  summary: string;
  concerns: string[];
  needs: string[];
  starters: string[];
  productAngle: string;
  questions: string[];
};

export type ObjectionResult = Record<
  "Soft" | "Consultative" | "Aggressive" | "Educational",
  string
>;

export type MeetingSummaryResult = {
  concerns: string[];
  painPoints: string[];
  objections: string[];
  budget: string;
  nextAction: string;
};

export type ProposalResult = {
  recommendedCover: number;
  existing: number;
  gap: number;
  annualPremium: number;
  monthlyPremium: number;
  products: { name: string; alloc: number; purpose: string }[];
  script: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcProposal(input: {
  age: number;
  income: number;
  dependents: number;
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
  };
}

// ─── Actions ────────────────────────────────────────────────────────────────

export async function aiProspectResearch(
  name: string,
  occupation: string,
): Promise<ProspectResearchResult> {
  return promptJSON<ProspectResearchResult>(`You are an expert financial advisor coach for the Philippine market.
Given this prospect:
- Name: ${name}
- Occupation: ${occupation}

Return a JSON object with these exact keys:
{
  "summary": "2-3 sentence professional summary of this prospect's likely financial situation (PH context)",
  "concerns": ["array of 4 likely financial concerns"],
  "needs": ["array of 4 insurance/investment needs"],
  "starters": ["array of 3 conversation starter questions — use Filipino context, quoted as the advisor speaking"],
  "productAngle": "1 paragraph — best product angle for this prospect",
  "questions": ["array of 4 discovery questions the advisor should ask"]
}`);
}

export async function aiObjectionResponses(
  objection: string,
): Promise<ObjectionResult> {
  return promptJSON<ObjectionResult>(`You are a top-performing financial advisor trainer in the Philippines.
A prospect said: "${objection}"

Write 4 distinct responses to this objection — one per style.
Return JSON with exactly these keys: "Soft", "Consultative", "Aggressive", "Educational".
Each value is 2-4 sentences. Natural Filipino English (some Taglish is fine). Warm, persuasive, NOT robotic.`);
}

export async function aiFollowUpMessage(opts: {
  name: string;
  occupation: string;
  stage: string;
  channel: "Messenger" | "SMS" | "Email";
  tone: string;
  language: "Taglish" | "English";
}): Promise<string> {
  const first = opts.name.split(" ")[0];
  const channelNote =
    opts.channel === "SMS"
      ? "Keep it under 160 characters."
      : opts.channel === "Email"
        ? "Include a subject line as the first line prefixed 'Subject:'."
        : "Conversational messenger tone, use 1-2 emojis naturally.";

  return promptText(`You are a financial advisor in the Philippines writing a follow-up message.
Prospect: ${opts.name} (${opts.occupation}), pipeline stage: "${opts.stage}"
Channel: ${opts.channel}. Tone: ${opts.tone}.
Language: ${opts.language === "Taglish" ? "Mix Filipino and English naturally (Taglish)" : "English only"}.
${channelNote}

Write ONE warm follow-up message to ${first}. Goal: re-engage, lead toward next meeting.
Do NOT sound like a sales script — be genuine and personal.
Return ONLY the message text.`);
}

export async function aiStructureNotes(rawNotes: string): Promise<string> {
  return promptText(`You are a financial advisor's assistant in the Philippines.
Convert these rough meeting notes into clean, structured CRM notes in markdown.

Raw notes: """${rawNotes}"""

Use only sections that have actual content from these: **Family Situation**, **Current Coverage**, **Concerns & Goals**, **Budget**, **Interest**, **Objections**, **Next Action**
Use bullet points. Be concise. Return ONLY the formatted markdown.`);
}

export async function aiMeetingSummary(rawNotes?: string): Promise<MeetingSummaryResult> {
  const context = rawNotes
    ? `Based on these meeting notes: """${rawNotes}"""`
    : "Based on a typical discovery meeting with a Filipino professional prospect.";

  return promptJSON<MeetingSummaryResult>(`You are a financial advisor coach in the Philippines.
${context}

Return a JSON object:
{
  "concerns": ["2-3 key client concerns"],
  "painPoints": ["2 pain points"],
  "objections": ["1-2 objections raised"],
  "budget": "budget range mentioned (e.g. ₱8,000–₱12,000/month)",
  "nextAction": "specific next step the advisor should take"
}`);
}

export async function aiGenerateProposal(input: {
  age: number;
  income: number;
  dependents: number;
  goal: string;
}): Promise<ProposalResult> {
  const base = calcProposal(input);

  const script = await promptText(`You are a financial advisor in the Philippines presenting a proposal.
Client: age ${input.age}, monthly income ₱${input.income.toLocaleString()}, ${input.dependents} dependent(s).
Goal: "${input.goal}"
Recommended coverage: ₱${base.recommendedCover.toLocaleString()}, protection gap: ₱${base.gap.toLocaleString()}
Suggested premium: ₱${base.monthlyPremium.toLocaleString()}/month

Write a compelling 3-4 sentence presentation script the advisor says to the client.
Conversational, emotional, resonates with Filipino family values. End with a soft close.
Return ONLY the script text.`);

  return { ...base, script };
}
