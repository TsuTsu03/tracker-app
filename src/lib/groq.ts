/**
 * Groq client — server-side only.
 * Model: llama-3.3-70b-versatile (free, fast, OpenAI-compatible).
 *
 * Drop-in replacement for the old Gemini client — same promptJSON / promptText
 * surface, so the AI Server Actions don't change. Uses plain fetch against
 * Groq's OpenAI-compatible endpoint, so there's no SDK dependency.
 *
 * Set GROQ_API_KEY in .env.local — get one (free) at: https://console.groq.com/keys
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

type ChatMessage = { role: "system" | "user"; content: string };

async function chat(
  messages: ChatMessage[],
  opts: { json?: boolean; temperature?: number } = {},
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set in .env.local");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: opts.temperature ?? 0.7,
      max_tokens: 1024,
      messages,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? "").trim();
}

/** Pull the first balanced JSON object/array out of a noisy string. */
export function extractJSON(text: string): string {
  const clean = text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/```$/i, "")
    .trim();
  if (clean.startsWith("{") || clean.startsWith("[")) return clean;
  const start = clean.search(/[{[]/);
  if (start === -1) return clean;
  const open = clean[start];
  const close = open === "{" ? "}" : "]";
  const end = clean.lastIndexOf(close);
  if (end > start) return clean.slice(start, end + 1);
  return clean;
}

/** Prompt Groq and parse the returned JSON. */
export async function promptJSON<T>(prompt: string): Promise<T> {
  const text = await chat(
    [
      {
        role: "system",
        content:
          "You are a precise assistant that replies with ONLY valid JSON — no markdown fences, no commentary.",
      },
      { role: "user", content: prompt },
    ],
    { json: true },
  );
  try {
    return JSON.parse(extractJSON(text)) as T;
  } catch {
    throw new Error(
      `Groq did not return valid JSON. Raw response:\n${text.slice(0, 500)}`,
    );
  }
}

/** Prompt Groq and return plain text. */
export async function promptText(prompt: string): Promise<string> {
  return chat([{ role: "user", content: prompt }]);
}
