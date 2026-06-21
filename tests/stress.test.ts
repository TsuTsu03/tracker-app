import { describe, it, expect } from "vitest";
import { calcProposal } from "@/lib/proposal";
import { extractJSON } from "@/lib/groq";

/**
 * Stress tests — pathological, hostile, and boundary inputs. The goal is not
 * throughput but resilience: the pure functions must never hang, throw on
 * unexpected input, blow up memory, or return corrupt invariants.
 */

describe("calcProposal (stress — extreme & hostile inputs)", () => {
  const hostile: Array<[string, { age: number; income: number; dependents: number }]> = [
    ["zero everything", { age: 0, income: 0, dependents: 0 }],
    ["negative income", { age: 30, income: -50_000, dependents: 2 }],
    ["negative dependents", { age: 30, income: 50_000, dependents: -3 }],
    ["huge income (overflow probe)", { age: 30, income: Number.MAX_SAFE_INTEGER, dependents: 1 }],
    ["fractional income", { age: 30.5, income: 12_345.678, dependents: 1 }],
    ["NaN income", { age: 30, income: NaN, dependents: 1 }],
    ["Infinity income", { age: 30, income: Infinity, dependents: 1 }],
  ];

  for (const [label, input] of hostile) {
    it(`does not throw and returns a shaped result for: ${label}`, () => {
      const r = calcProposal(input);
      // never throws; always returns the documented shape
      expect(r).toHaveProperty("recommendedCover");
      expect(r).toHaveProperty("gap");
      expect(Array.isArray(r.products)).toBe(true);
      // allocations always sum to 100 regardless of garbage input
      expect(r.products.reduce((s, p) => s + p.alloc, 0)).toBe(100);
    });
  }

  it("keeps gap == recommendedCover - existing as a hard invariant under fuzzing", () => {
    for (let i = 0; i < 10_000; i++) {
      const r = calcProposal({
        age: Math.random() * 200 - 50,
        income: Math.random() * 1e9 - 1e6,
        dependents: Math.floor(Math.random() * 20) - 5,
      });
      if (Number.isFinite(r.recommendedCover) && Number.isFinite(r.existing)) {
        expect(r.gap).toBeCloseTo(r.recommendedCover - r.existing, 5);
      }
    }
  });
});

describe("extractJSON (stress — pathological strings & ReDoS probes)", () => {
  it("handles a very large (~5MB) noisy payload in bounded time", () => {
    const filler = "x".repeat(5_000_000);
    const text = "prose " + filler + ' {"deep":true} ' + filler + " end";
    const start = performance.now();
    const out = extractJSON(text);
    expect(performance.now() - start).toBeLessThan(2000);
    // the inner object is between two huge filler blocks; extractor returns a slice
    expect(out.length).toBeGreaterThan(0);
  });

  it("does not stack-overflow on deeply nested braces", () => {
    const depth = 50_000;
    const text = "{".repeat(depth) + "}".repeat(depth);
    expect(() => extractJSON(text)).not.toThrow();
  });

  it("survives long fence-only / brace-only adversarial strings", () => {
    const cases = [
      "```".repeat(100_000),
      "{".repeat(500_000),
      "[".repeat(500_000),
      "\n".repeat(1_000_000),
      "}{".repeat(250_000),
    ];
    for (const c of cases) {
      const start = performance.now();
      expect(() => extractJSON(c)).not.toThrow();
      // each must complete fast — guards against catastrophic backtracking
      expect(performance.now() - start).toBeLessThan(1000);
    }
  });

  it("returns input unchanged when there is no JSON, even for huge strings", () => {
    const noJson = "no json ".repeat(500_000);
    expect(extractJSON(noJson)).toBe(noJson.trim());
  });
});
