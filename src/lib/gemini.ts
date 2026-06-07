/**
 * Google Gemini client — server-side only.
 * Model: gemini-flash-latest (rolling alias to the current free fast model)
 * Set GOOGLE_AI_API_KEY in .env.local — get one at: https://aistudio.google.com/app/apikey
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel(json = false) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set in .env.local");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      // Force the model to emit a raw JSON document — no prose, no fences.
      ...(json ? { responseMimeType: "application/json" as const } : {}),
    },
  });
}

/** Pull the first balanced JSON object/array out of a noisy string. */
function extractJSON(text: string): string {
  const clean = text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/```$/i, "")
    .trim();
  // Already valid? cheapest path.
  if (clean.startsWith("{") || clean.startsWith("[")) return clean;
  // Otherwise grab from the first brace/bracket to its matching last one.
  const start = clean.search(/[{[]/);
  if (start === -1) return clean;
  const open = clean[start];
  const close = open === "{" ? "}" : "]";
  const end = clean.lastIndexOf(close);
  if (end > start) return clean.slice(start, end + 1);
  return clean;
}

/** Prompt Gemini and parse the returned JSON. */
export async function promptJSON<T>(prompt: string): Promise<T> {
  const model = getModel(true);
  const result = await model.generateContent(
    prompt + "\n\nRespond with ONLY valid JSON — no markdown fences, no explanation.",
  );
  const text = result.response.text().trim();
  try {
    return JSON.parse(extractJSON(text)) as T;
  } catch {
    throw new Error(
      `Gemini did not return valid JSON. Raw response:\n${text.slice(0, 500)}`,
    );
  }
}

/** Prompt Gemini and return plain text. */
export async function promptText(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
