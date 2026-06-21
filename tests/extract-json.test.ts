import { describe, it, expect } from "vitest";
import { extractJSON } from "@/lib/groq";

/**
 * extractJSON is the safety net for the #1 LLM failure mode: the model wraps its
 * JSON in prose or ```fences```. These cases mirror what Groq/Llama actually returns.
 */
describe("extractJSON (unit)", () => {
  it("returns clean JSON untouched", () => {
    const json = '{"a":1,"b":"x"}';
    expect(JSON.parse(extractJSON(json))).toEqual({ a: 1, b: "x" });
  });

  it("strips ```json fenced code blocks", () => {
    const text = '```json\n{"ok":true}\n```';
    expect(JSON.parse(extractJSON(text))).toEqual({ ok: true });
  });

  it("strips bare ``` fences", () => {
    const text = '```\n{"ok":true}\n```';
    expect(JSON.parse(extractJSON(text))).toEqual({ ok: true });
  });

  it("extracts an object embedded in surrounding prose", () => {
    const text = 'Sure! Here is your result:\n{"score":80}\nHope that helps!';
    expect(JSON.parse(extractJSON(text))).toEqual({ score: 80 });
  });

  it("extracts a JSON array", () => {
    const text = 'Here you go: [1,2,3] done';
    expect(JSON.parse(extractJSON(text))).toEqual([1, 2, 3]);
  });

  it("keeps nested objects balanced to the final closing brace", () => {
    const text = 'Result: {"a":{"b":2},"c":3} thanks';
    expect(JSON.parse(extractJSON(text))).toEqual({ a: { b: 2 }, c: 3 });
  });

  it("passes through text with no JSON unchanged (parse will fail upstream)", () => {
    expect(extractJSON("no json here")).toBe("no json here");
  });
});
