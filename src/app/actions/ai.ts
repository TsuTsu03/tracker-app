"use server";

/**
 * AI Server Actions — all Gemini calls happen here (server-side).
 * The API key never reaches the browser.
 */

import { promptJSON, promptText } from "@/lib/groq";
import { tavilySearch, formatResultsForPrompt } from "@/lib/tavily";
import { calcProposal } from "@/lib/proposal";
import { requireUser, clamp } from "@/lib/ai-guard";
import {
  MDRT_CORE,
  MDRT_DISCOVERY,
  MDRT_OBJECTIONS,
} from "@/lib/coach-knowledge";

// ─── Types ──────────────────────────────────────────────────────────────────

export type SourceLink = { title: string; url: string };

export type ProspectResearchResult = {
  summary: string;
  concerns: string[];
  needs: string[];
  starters: string[];
  productAngle: string;
  questions: string[];
  /** Real web pages the research was grounded on (Tavily). */
  sources: SourceLink[];
};

export type DiscoveredLead = {
  name: string;
  business: string;
  occupation: string;
  location: string;
  bracket: string;
  temp: "Hot" | "Warm" | "Cold";
  reason: string;
  /** The real web source this prospect was found in (Tavily). */
  source?: string;
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

export type MeetingBriefResult = {
  risks: string[];
  talkingPoints: string[];
  questions: { category: string; items: string[] }[];
};

export type BusinessAdviceResult = {
  weaknesses: string[];
  recommendations: string[];
  plan: string[];
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
  business?: string,
): Promise<ProspectResearchResult> {
  await requireUser();
  name = clamp(name, 200);
  occupation = clamp(occupation, 200);
  business = clamp(business, 200);
  // Ground in REAL web data first — search for this actual person/business.
  const query = [name, occupation, business, "Philippines"]
    .filter(Boolean)
    .join(" ");
  const search = await tavilySearch(query, { maxResults: 6 });
  const context = formatResultsForPrompt(search);

  const data = await promptJSON<Omit<ProspectResearchResult, "sources">>(
    `${MDRT_CORE}

${MDRT_DISCOVERY}

You are researching a real prospect for a Filipino financial advisor. Base your
analysis ONLY on the REAL web search results below — do not invent facts about
this specific person. Where the results are thin, reason from what this kind of
profession typically faces in the PH market, but never fabricate specific claims
(named deals, exact figures) that aren't supported by the results.

PROSPECT: ${name}${business ? ` — ${business}` : ""} (${occupation})

REAL WEB SEARCH RESULTS:
"""
${context || "No results found."}
"""

Return a JSON object with these exact keys:
{
  "summary": "2-3 sentence professional summary grounded in the results above (PH context)",
  "concerns": ["array of 4 likely financial concerns for this prospect"],
  "needs": ["array of 4 insurance/investment needs"],
  "starters": ["array of 3 conversation starters — Filipino context, quoted as the advisor speaking; reference something real from the results when possible"],
  "productAngle": "1 paragraph — best product angle for this prospect",
  "questions": ["array of 4 discovery questions the advisor should ask"]
}`,
  );

  return {
    ...data,
    sources: search.results.slice(0, 4).map((r) => ({
      title: r.title,
      url: r.url,
    })),
  };
}

export async function aiDiscoverLeads(
  profession: string,
  location: string,
): Promise<DiscoveredLead[]> {
  await requireUser();
  profession = clamp(profession, 200);
  location = clamp(location, 200);
  // Real prospecting = real web search, not invented archetypes. We search for
  // actual businesses/professionals, then have the LLM structure what it found.
  const search = await tavilySearch(
    `${profession} in ${location}, Philippines — list of businesses, clinics, firms, owners, contact directory`,
    { maxResults: 10, depth: "advanced" },
  );
  const context = formatResultsForPrompt(search);

  if (!search.results.length) return [];

  const result = await promptJSON<{ leads: DiscoveredLead[] }>(
    `You are a prospecting researcher for a Filipino financial advisor. Below are
REAL web search results about "${profession}" in "${location}", Philippines.

Extract up to 6 REAL prospects (actual businesses, firms, clinics, or named
professionals) that appear in these results. Use the ACTUAL business/person name
and the matching source URL — do NOT invent names, businesses, or URLs that are
not present in the results. If a person's name isn't given, use the business name
and set the role generically (e.g. "Owner / Principal Dentist").

REAL WEB SEARCH RESULTS:
"""
${context}
"""

Return JSON with this exact shape:
{
  "leads": [
    {
      "name": "the real person's name if shown, else the business name",
      "business": "the real business/firm/clinic name from the results",
      "occupation": "specific role within ${profession}",
      "location": "${location}",
      "bracket": "estimated monthly income range in pesos for this kind of business, e.g. ₱150k–250k/mo (clearly an estimate)",
      "temp": "Hot | Warm | Cold — your qualification of buying readiness",
      "reason": "1 sentence: why they're a strong insurance/investment prospect, referencing what the result actually says",
      "source": "the exact source URL from the results this prospect came from"
    }
  ]
}
Only include prospects actually supported by the results. Return ONLY the JSON.`,
  );
  return result.leads ?? [];
}

export async function aiObjectionResponses(
  objection: string,
): Promise<ObjectionResult> {
  await requireUser();
  objection = clamp(objection);
  return promptJSON<ObjectionResult>(`${MDRT_CORE}

${MDRT_OBJECTIONS}

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
  await requireUser();
  opts = { ...opts, name: clamp(opts.name, 200), occupation: clamp(opts.occupation, 200), stage: clamp(opts.stage, 100), tone: clamp(opts.tone, 100) };
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
  await requireUser();
  rawNotes = clamp(rawNotes, 8000);
  return promptText(`You are a financial advisor's assistant in the Philippines.
Convert these rough meeting notes into clean, structured CRM notes in markdown.

Raw notes: """${rawNotes}"""

Use only sections that have actual content from these: **Family Situation**, **Current Coverage**, **Concerns & Goals**, **Budget**, **Interest**, **Objections**, **Next Action**
Use bullet points. Be concise. Return ONLY the formatted markdown.`);
}

export async function aiMeetingSummary(
  rawNotes: string,
): Promise<MeetingSummaryResult> {
  await requireUser();
  const notes = clamp(rawNotes, 8000).trim();
  if (!notes)
    throw new Error("Meeting notes are required — nothing to summarize.");

  return promptJSON<MeetingSummaryResult>(`You are a financial advisor coach in the Philippines.
Summarize ONLY what is actually in these real meeting notes — do NOT invent
concerns, budgets, names, or objections that aren't supported by the text. If a
field has nothing in the notes, return an empty array (or "" for budget).

MEETING NOTES:
"""${notes}"""

Return a JSON object:
{
  "concerns": ["key client concerns mentioned"],
  "painPoints": ["pain points mentioned"],
  "objections": ["objections raised, if any"],
  "budget": "budget range if mentioned (e.g. ₱8,000–₱12,000/month), else \\"\\"",
  "nextAction": "the next step implied by the notes"
}`);
}

/**
 * Builds a meeting brief for an EXISTING lead, grounded strictly in that lead's
 * real CRM fields — no invented facts. Used by the Meeting Assistant "Prepare"
 * tab (replacing the old fake `sleep` + hardcoded talking points).
 */
export async function aiMeetingBrief(lead: {
  fullName: string;
  occupation?: string;
  age?: number;
  company?: string;
  civilStatus?: string;
  dependents?: number;
  monthlyIncome?: number;
  location?: string;
  stage?: string;
  temperature?: string;
  scoreReasons?: string[];
}): Promise<MeetingBriefResult> {
  await requireUser();
  const facts = [
    `Name: ${lead.fullName}`,
    lead.occupation && `Occupation: ${lead.occupation}`,
    lead.company && `Company: ${lead.company}`,
    lead.age && `Age: ${lead.age}`,
    lead.civilStatus && `Civil status: ${lead.civilStatus}`,
    lead.dependents != null && `Dependents: ${lead.dependents}`,
    lead.monthlyIncome &&
      `Monthly income: ₱${lead.monthlyIncome.toLocaleString()}`,
    lead.location && `Location: ${lead.location}`,
    lead.stage && `Pipeline stage: ${lead.stage}`,
    lead.temperature && `Buying signal: ${lead.temperature}`,
    lead.scoreReasons?.length &&
      `Score reasons: ${lead.scoreReasons.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  return promptJSON<MeetingBriefResult>(`${MDRT_CORE}

${MDRT_DISCOVERY}

Prepare a meeting brief for this REAL lead, using ONLY the CRM facts below.
Reason about risks and discovery questions from these facts and standard PH
needs-based practice — but do NOT invent specific facts (named policies, exact
figures, family details) that aren't given.

CRM FACTS:
"""${facts}"""

Return a JSON object:
{
  "risks": ["3-4 protection/retirement/estate gaps inferred from the facts"],
  "talkingPoints": ["3 angles to open value, tailored to this lead"],
  "questions": [
    { "category": "Protection", "items": ["2 discovery questions"] },
    { "category": "Retirement", "items": ["2 discovery questions"] },
    { "category": "Investment", "items": ["2 discovery questions"] },
    { "category": "Education", "items": ["2 discovery questions"] }
  ]
}`);
}

export async function aiBusinessAdvice(
  question: string,
  stats: {
    totalLeads: number;
    hotLeads: number;
    staleHotLeads: number;
    pipelineValue: number;
    closedWon: number;
    closedLost: number;
    atRiskClients: number;
  },
): Promise<BusinessAdviceResult> {
  await requireUser();
  question = clamp(question, 1000);
  return promptJSON<BusinessAdviceResult>(`${MDRT_CORE}

You are mentoring this advisor's PRACTICE — diagnose their funnel from real data
and prescribe what a Top-of-the-Table producer would do next.

The advisor asks: "${question}"

Here is their REAL current CRM data:
- Total leads: ${stats.totalLeads}
- Hot leads: ${stats.hotLeads} (of which ${stats.staleHotLeads} have gone 7+ days without contact)
- Open pipeline value (potential annual premium): ₱${stats.pipelineValue.toLocaleString()}
- Closed Won: ${stats.closedWon} · Closed Lost: ${stats.closedLost}
- At-risk clients (relationship health < 60): ${stats.atRiskClients}

Coach THIS advisor using THIS data. Return a JSON object:
{
  "weaknesses": ["2-3 specific, data-grounded gaps — reference the numbers and name the funnel stage or habit at fault, MDRT-mentor style"],
  "recommendations": ["3 concrete, prioritized moves a TOT producer would make — include a benchmark or activity ratio where relevant"],
  "plan": ["3 action items framed as Today / This week / This month, each tied to a real number from the data above"]
}
Reference the actual numbers. NEVER invent client or prospect names — refer to
people only generically (e.g. "your stale hot leads", "an at-risk client") since
you don't have their real names. Sound like a real MDRT mentor, not a generic chatbot.`);
}

export async function aiGenerateProposal(input: {
  age: number;
  income: number;
  dependents: number;
  goal: string;
}): Promise<ProposalResult> {
  await requireUser();
  input = { ...input, goal: clamp(input.goal, 500) };
  const base = calcProposal(input);

  const script = await promptText(`${MDRT_CORE}

Now present this proposal as the advisor speaking to the client.
Client: age ${input.age}, monthly income ₱${input.income.toLocaleString()}, ${input.dependents} dependent(s).
Goal: "${input.goal}"
Recommended coverage: ₱${base.recommendedCover.toLocaleString()}, protection gap: ₱${base.gap.toLocaleString()}
Suggested premium: ₱${base.monthlyPremium.toLocaleString()}/month

Write a compelling 3-4 sentence presentation script the advisor says to the client.
Conversational, emotional, resonates with Filipino family values. End with a soft close.
Return ONLY the script text.`);

  return { ...base, script };
}

// ─── Sales Coach: Roleplay ───────────────────────────────────────────────────

export type RoleplayTurn = { role: "ai" | "me"; text: string };

/**
 * The AI plays a prospect persona so the advisor can practice live. It stays in
 * character, reacts realistically to the advisor's last message, and gradually
 * warms up (or pushes back harder) based on how well the advisor handles it.
 */
export async function aiRoleplayReply(opts: {
  persona: string;
  personaDesc: string;
  history: RoleplayTurn[];
}): Promise<string> {
  await requireUser();
  const transcript = opts.history
    .slice(-40)
    .map((t) => `${t.role === "me" ? "ADVISOR" : "CLIENT"}: ${clamp(t.text, 1000)}`)
    .join("\n");

  return promptText(`${MDRT_CORE}

You are running a sales ROLEPLAY to train a Filipino financial advisor. You are
NOT the coach right now — you ROLE-PLAY the prospect below. Stay fully in
character as a real Filipino client.

PERSONA: ${clamp(opts.persona, 200)} — ${clamp(opts.personaDesc, 1000)}

Rules:
- Reply ONLY as the client, in first person, 1-3 sentences. No narration, no labels.
- React realistically to the advisor's LAST message. If they used a weak,
  pushy, or product-first line, stay skeptical or raise a real objection. If they
  showed genuine discovery, empathy, or reframed to your family/goals, warm up
  a little and reveal more.
- Use natural Filipino English / light Taglish.
- Never break character or coach the advisor.

Conversation so far:
${transcript}

Now give the client's next reply.`);
}

// ─── Sales Coach: Call Review ────────────────────────────────────────────────

export type CallScoreResult = {
  overall: number;
  verdict: string;
  summary: string;
  scores: { rapport: number; discovery: number; closing: number; confidence: number };
  strengths: string[];
  improvements: string[];
  tip: string;
};

/**
 * Scores a call transcript like an MDRT mentor reviewing a recording: rates the
 * four core competencies 0-100, then gives concrete, transcript-grounded
 * coaching the advisor can act on next call.
 */
export async function aiScoreCall(transcript: string): Promise<CallScoreResult> {
  await requireUser();
  transcript = clamp(transcript, 12000);
  return promptJSON<CallScoreResult>(`${MDRT_CORE}

${MDRT_DISCOVERY}

You are reviewing a recorded sales call transcript like an MDRT mentor. Score
honestly based ONLY on what the transcript shows — reward real discovery,
needs-based reframing, and a clear ask for the next step; penalize product-dumping,
weak closes, and missed buying signals.

TRANSCRIPT:
"""${transcript}"""

Return a JSON object:
{
  "overall": 0-100 overall call score,
  "verdict": "3-5 word verdict, e.g. 'Solid call, weak close'",
  "summary": "1-2 sentence honest summary of how the call went",
  "scores": {
    "rapport": 0-100,
    "discovery": 0-100,
    "closing": 0-100,
    "confidence": 0-100
  },
  "strengths": ["2-3 specific things the advisor did well, quoting/paraphrasing the transcript"],
  "improvements": ["2-3 specific, transcript-grounded things to fix"],
  "tip": "1 concrete coaching tip with an example line the advisor could have used (Taglish ok)"
}
Base every score and comment on the actual transcript. Be a real mentor, not generic.`);
}
