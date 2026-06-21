import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// The AI actions now require an authenticated advisor. Stub the auth guard so
// these tests exercise the prompt/parse path; clamp() stays real.
vi.mock("@/lib/ai-guard", async (importActual) => {
  const actual = await importActual<typeof import("@/lib/ai-guard")>();
  return { ...actual, requireUser: vi.fn().mockResolvedValue({ id: "test-user" }) };
});

import {
  aiObjectionResponses,
  aiScoreCall,
  aiRoleplayReply,
} from "@/app/actions/ai";
import { requireUser } from "@/lib/ai-guard";

/**
 * Integration tests for the AI server actions. We mock global fetch so the Groq
 * client's real code path runs (prompt building, request shape, JSON parsing)
 * WITHOUT hitting the network or spending rate-limit quota.
 */

/** Build a Groq/OpenAI-shaped chat completion response. */
function groqResponse(content: string) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ choices: [{ message: { content } }] }),
    text: async () => content,
  } as Response;
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  process.env.GROQ_API_KEY = "test-key";
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** The prompt text sent to Groq in the most recent fetch call. */
function lastUserPrompt(): string {
  const body = JSON.parse(fetchMock.mock.calls.at(-1)![1]!.body as string);
  return body.messages.map((m: { content: string }) => m.content).join("\n");
}

describe("aiObjectionResponses (integration)", () => {
  it("sends MDRT coaching context + the objection, and parses the 4 styles", async () => {
    fetchMock.mockResolvedValue(
      groqResponse(
        JSON.stringify({
          Soft: "a",
          Consultative: "b",
          Aggressive: "c",
          Educational: "d",
        }),
      ),
    );

    const result = await aiObjectionResponses("Masyadong mahal.");

    expect(result).toEqual({
      Soft: "a",
      Consultative: "b",
      Aggressive: "c",
      Educational: "d",
    });
    const prompt = lastUserPrompt();
    expect(prompt).toContain("Masyadong mahal.");
    expect(prompt).toMatch(/MDRT|needs-based|objection/i);
  });

  it("requests JSON mode from Groq for structured calls", async () => {
    fetchMock.mockResolvedValue(groqResponse("{}"));
    await aiObjectionResponses("test");
    const body = JSON.parse(fetchMock.mock.calls.at(-1)![1]!.body as string);
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.model).toBe("llama-3.3-70b-versatile");
  });
});

describe("aiScoreCall (integration)", () => {
  it("includes the transcript and parses the scorecard even with fenced output", async () => {
    const scorecard = {
      overall: 72,
      verdict: "Solid, weak close",
      summary: "Good discovery.",
      scores: { rapport: 80, discovery: 75, closing: 50, confidence: 70 },
      strengths: ["asked about family"],
      improvements: ["never asked for the close"],
      tip: "Try a trial close.",
    };
    // Simulate the model wrapping JSON in a markdown fence — must still parse.
    fetchMock.mockResolvedValue(
      groqResponse("```json\n" + JSON.stringify(scorecard) + "\n```"),
    );

    const result = await aiScoreCall("Advisor: hi\nClient: hello");

    expect(result.overall).toBe(72);
    expect(result.scores.closing).toBe(50);
    expect(lastUserPrompt()).toContain("Advisor: hi");
  });

  it("throws a clear error when Groq returns non-JSON", async () => {
    fetchMock.mockResolvedValue(groqResponse("sorry, I cannot do that"));
    await expect(aiScoreCall("x")).rejects.toThrow(/valid JSON/i);
  });
});

describe("aiRoleplayReply (integration)", () => {
  it("stays a text call (no JSON mode) and feeds the conversation history", async () => {
    fetchMock.mockResolvedValue(groqResponse("Bakit ko kailangan yan?"));

    const reply = await aiRoleplayReply({
      persona: "Skeptical Client",
      personaDesc: "Doubts everything",
      history: [
        { role: "ai", text: "Why should I consider this?" },
        { role: "me", text: "Because it protects your family." },
      ],
    });

    expect(reply).toBe("Bakit ko kailangan yan?");
    const body = JSON.parse(fetchMock.mock.calls.at(-1)![1]!.body as string);
    expect(body.response_format).toBeUndefined(); // plain text, not JSON mode
    const prompt = lastUserPrompt();
    expect(prompt).toContain("Skeptical Client");
    expect(prompt).toContain("protects your family");
  });
});

describe("Authorization guard (integration)", () => {
  it("rejects unauthenticated callers before any Groq request is made", async () => {
    vi.mocked(requireUser).mockRejectedValueOnce(new Error("Unauthorized"));
    await expect(aiObjectionResponses("test")).rejects.toThrow(/Unauthorized/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("Groq client error handling (integration)", () => {
  it("surfaces a missing API key", async () => {
    delete process.env.GROQ_API_KEY;
    await expect(aiRoleplayReply({ persona: "x", personaDesc: "y", history: [] })).rejects.toThrow(
      /GROQ_API_KEY/,
    );
  });

  it("surfaces a failed Groq request with status code", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "rate limited",
    } as Response);
    await expect(
      aiRoleplayReply({ persona: "x", personaDesc: "y", history: [] }),
    ).rejects.toThrow(/429/);
  });
});
