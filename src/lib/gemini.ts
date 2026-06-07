/**
 * Google Gemini client — server-side only.
 * Model: gemini-flash-latest (rolling alias to the current free fast model)
 * Set GOOGLE_AI_API_KEY in .env.local — get one at: https://aistudio.google.com/app/apikey
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not set in .env.local");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  });
}

/** Prompt Gemini and parse the returned JSON. */
export async function promptJSON<T>(prompt: string): Promise<T> {
  const model = getModel();
  const result = await model.generateContent(
    prompt + "\n\nRespond with ONLY valid JSON — no markdown fences, no explanation.",
  );
  const text = result.response.text().trim();
  const clean = text.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();
  return JSON.parse(clean) as T;
}

/** Prompt Gemini and return plain text. */
export async function promptText(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
