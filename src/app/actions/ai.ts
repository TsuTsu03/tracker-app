"use server";

/**
 * AI Server Actions — all Gemini calls happen here (server-side).
 * API key never reaches the browser.
 *
 * Each action returns a typed result and silently falls back to the
 * bundled mock when GOOGLE_AI_API_KEY is not set (demo mode still works).
 */

import { promptJSON, promptText, isAIEnabled } from "@/lib/gemini";
import {
  prospectResearch as mockProspect,
  objectionResponses as mockObjection,
  followUpMessage as mockFollowUp,
  meetingSummary as mockMeetingSummary,
  generateProposal as mockProposal,
} from "@/lib/ai";

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

// ─── Actions ────────────────────────────────────────────────────────────────

export async function aiProspectResearch(
  name: string,
  occupation: string,
): Promise<ProspectResearchResult & { live: boolean }> {
  const fallback = mockProspect(name, occupation);

  if (!isAIEnabled) return { ...fallback, live: false };

  const prompt = `You are an expert financial advisor coach for the Philippine market.
Given this prospect:
- Name: ${name}
- Occupation: ${occupation}

Return a JSON object with these exact keys:
{
  "summary": "2-3 sentence professional summary of this prospect's likely financial situation (PH context)",
  "concerns": ["array of 4 likely financial concerns"],
  "needs": ["array of 4 insurance/investment needs"],
  "starters": ["array of 3 conversation starter questions (use Filipino names/context)"],
  "productAngle": "1 paragraph — best product angle for this prospect",
  "questions": ["array of 4 discovery questions"]
}`;

  const result = await promptJSON<ProspectResearchResult>(prompt, fallback);
  return { ...result, live: true };
}

export async function aiObjectionResponses(
  objection: string,
): Promise<ObjectionResult & { live: boolean }> {
  const fallback = objectionResponses(objection);

  if (!isAIEnabled) return { ...fallback, live: false };

  const prompt = `You are a top-performing financial advisor trainer in the Philippines.
A prospect said: "${objection}"

Write 4 distinct responses to this objection, one for each style.
Return JSON with exactly these keys: "Soft", "Consultative", "Aggressive", "Educational".
Each value is a 2-4 sentence response. Use natural Filipino English (some Tagalog/Taglish is fine).
Make them persuasive and warm, NOT pushy or robotic.`;

  const result = await promptJSON<ObjectionResult>(prompt, fallback);
  return { ...result, live: true };
}

function objectionResponses(objection: string): ObjectionResult {
  // Thin wrapper so we can call mockObjection inside this file
  const r = mockObjection(objection);
  return r as ObjectionResult;
}

export async function aiFollowUpMessage(opts: {
  name: string;
  occupation: string;
  stage: string;
  channel: "Messenger" | "SMS" | "Email";
  tone: string;
  language: "Taglish" | "English";
}): Promise<{ message: string; live: boolean }> {
  const fallback = mockFollowUp({
    name: opts.name,
    channel: opts.channel,
    tone: opts.tone,
    language: opts.language,
  });

  if (!isAIEnabled) return { message: fallback, live: false };

  const first = opts.name.split(" ")[0];
  const channelNote =
    opts.channel === "SMS"
      ? "Keep it under 160 characters."
      : opts.channel === "Email"
        ? "Include a subject line as the first line prefixed with 'Subject:'."
        : "Conversational messenger tone, use emojis sparingly.";

  const prompt = `You are a financial advisor in the Philippines crafting a follow-up message.
Prospect: ${opts.name} (${opts.occupation}), pipeline stage: "${opts.stage}"
Channel: ${opts.channel}. Tone: ${opts.tone}. Language: ${opts.language}.
${channelNote}

Write ONE follow-up message addressed to ${first}.
- Language: ${opts.language === "Taglish" ? "Mix Filipino and English naturally" : "English only"}
- Tone: ${opts.tone}
- Goal: re-engage, keep it warm, lead toward next meeting/decision
- Do NOT sound like a sales script. Be genuine.
Return ONLY the message text, nothing else.`;

  const message = await promptText(prompt, fallback);
  return { message, live: true };
}

export async function aiStructureNotes(rawNotes: string): Promise<{
  structured: string;
  live: boolean;
}> {
  const fallback = `**Family Situation**
- Details from your notes

**Concerns & Goals**
- (AI not enabled — add GOOGLE_AI_API_KEY to .env.local)

**Budget**
- TBD

**Next Action**
- Follow up`;

  if (!isAIEnabled) return { structured: fallback, live: false };

  const prompt = `You are a financial advisor's assistant in the Philippines.
Convert these rough meeting notes into clean, structured CRM notes in markdown.

Raw notes: """${rawNotes}"""

Use these sections (only include sections with actual content):
**Family Situation**, **Current Coverage**, **Concerns & Goals**, **Budget**, **Interest**, **Objections**, **Next Action**

Use bullet points. Be concise. Return ONLY the formatted markdown.`;

  const structured = await promptText(prompt, fallback);
  return { structured, live: true };
}

export async function aiMeetingSummary(rawNotes?: string): Promise<
  MeetingSummaryResult & { live: boolean }
> {
  const fallback = mockMeetingSummary();

  if (!isAIEnabled) return { ...fallback, live: false };

  const context = rawNotes
    ? `Based on these meeting notes: """${rawNotes}"""`
    : `Based on a typical discovery meeting with a PH professional.`;

  const prompt = `You are a financial advisor coach in the Philippines.
${context}

Extract and return a JSON object:
{
  "concerns": ["array of 2-3 key client concerns"],
  "painPoints": ["array of 2 pain points"],
  "objections": ["array of 1-2 objections raised"],
  "budget": "budget range mentioned (e.g. ₱8,000–₱12,000/month)",
  "nextAction": "specific next step the advisor should take"
}`;

  const result = await promptJSON<MeetingSummaryResult>(prompt, fallback);
  return { ...result, live: true };
}

export async function aiGenerateProposal(input: {
  age: number;
  income: number;
  dependents: number;
  goal: string;
}): Promise<ProposalResult & { live: boolean }> {
  const base = mockProposal(input);

  if (!isAIEnabled) return { ...base, live: false };

  // Keep the financial math from the mock (deterministic), only enhance the script
  const prompt = `You are a financial advisor in the Philippines presenting a proposal.
Client details:
- Age: ${input.age}
- Monthly income: ₱${input.income.toLocaleString()}
- Dependents: ${input.dependents}
- Goal: "${input.goal}"
- Recommended coverage: ₱${base.recommendedCover.toLocaleString()}
- Protection gap: ₱${base.gap.toLocaleString()}
- Suggested premium: ₱${base.monthlyPremium.toLocaleString()}/month

Write a compelling 3-4 sentence presentation script the advisor says to the client.
Make it conversational, emotional, and relevant to Filipino family values.
End with a soft close. Return ONLY the script text.`;

  const script = await promptText(prompt, base.script);
  return { ...base, script, live: true };
}

/** Returns whether Gemini is live or in demo mode */
export async function getAIStatus(): Promise<{
  enabled: boolean;
  model: string;
}> {
  return {
    enabled: isAIEnabled,
    model: isAIEnabled ? "gemini-1.5-flash (live)" : "demo mode",
  };
}
