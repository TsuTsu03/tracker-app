/**
 * Google Gemini client — server-side only.
 * Free tier: gemini-1.5-flash → 15 RPM, 1,500 RPD, 1M TPM (no credit card needed).
 * Get your key at: https://aistudio.google.com/app/apikey
 *
 * If GOOGLE_AI_API_KEY is not set, the app silently falls back to the bundled
 * demo/mock AI responses — zero-config mode still works.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;

export const isAIEnabled = Boolean(apiKey);

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!apiKey) return null;
  if (!_genAI) _genAI = new GoogleGenerativeAI(apiKey);
  return _genAI;
}

/** Returns the free flash model, or null in demo mode. */
export function getModel() {
  const genAI = getGenAI();
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });
}

/** Prompt Gemini and parse the JSON it returns. Falls back to `fallback` on any error. */
export async function promptJSON<T>(
  prompt: string,
  fallback: T,
): Promise<T> {
  const model = getModel();
  if (!model) return fallback;

  try {
    const result = await model.generateContent(
      prompt +
        "\n\nRespond with ONLY valid JSON — no markdown fences, no explanation.",
    );
    const text = result.response.text().trim();
    // Strip accidental ```json fences if the model adds them
    const clean = text.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();
    return JSON.parse(clean) as T;
  } catch (err) {
    console.error("[Gemini] error, using fallback:", err);
    return fallback;
  }
}

/** Prompt Gemini for plain text. Falls back to `fallback` on any error. */
export async function promptText(
  prompt: string,
  fallback: string,
): Promise<string> {
  const model = getModel();
  if (!model) return fallback;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("[Gemini] error, using fallback:", err);
    return fallback;
  }
}
