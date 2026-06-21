import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/ai-guard", async (importActual) => {
  const actual = await importActual<typeof import("@/lib/ai-guard")>();
  return { ...actual, requireUser: vi.fn().mockResolvedValue({ id: "test-user" }) };
});

import { calcProposal } from "@/lib/proposal";
import { extractJSON } from "@/lib/groq";
import { aiObjectionResponses } from "@/app/actions/ai";

/**
 * Load tests — sustained, realistic volume. These assert the system stays
 * correct AND fast under high throughput. Thresholds are deliberately loose so
 * they pass on slow CI, but tight enough to catch an O(n^2) regression.
 */

describe("calcProposal (load)", () => {
  it("handles 200k varied proposals correctly and quickly", () => {
    const N = 200_000;
    const start = performance.now();
    for (let i = 0; i < N; i++) {
      const r = calcProposal({
        age: 25 + (i % 40),
        income: 8_000 + (i % 200) * 1_000,
        dependents: i % 5,
      });
      // invariants must hold for every single call
      if (r.gap < 0 || r.recommendedCover < 0) throw new Error("negative output");
      if (r.products.reduce((s, p) => s + p.alloc, 0) !== 100) {
        throw new Error("alloc != 100");
      }
    }
    const ms = performance.now() - start;
    const opsPerSec = (N / ms) * 1000;
    // pure arithmetic — should comfortably clear 100k ops/sec
    expect(opsPerSec).toBeGreaterThan(100_000);
  });
});

describe("extractJSON (load)", () => {
  it("parses 50k noisy LLM-style payloads", () => {
    const N = 50_000;
    const start = performance.now();
    for (let i = 0; i < N; i++) {
      const payload = '```json\n{"score":' + (i % 100) + ',"ok":true}\n```';
      const parsed = JSON.parse(extractJSON(payload));
      if (parsed.ok !== true) throw new Error("bad parse");
    }
    const ms = performance.now() - start;
    expect((N / ms) * 1000).toBeGreaterThan(20_000);
  });
});

describe("AI action throughput (load)", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    process.env.GROQ_API_KEY = "test-key";
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                Soft: "a",
                Consultative: "b",
                Aggressive: "c",
                Educational: "d",
              }),
            },
          },
        ],
      }),
      text: async () => "",
    } as Response);
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("resolves 500 concurrent objection calls without dropping any", async () => {
    const N = 500;
    const results = await Promise.all(
      Array.from({ length: N }, (_, i) => aiObjectionResponses("objection #" + i)),
    );
    expect(results).toHaveLength(N);
    expect(fetchMock).toHaveBeenCalledTimes(N);
    for (const r of results) expect(r.Soft).toBe("a");
  });
});
