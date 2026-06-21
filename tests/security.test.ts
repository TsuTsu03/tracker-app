import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { safeNextPath } from "@/lib/safe-redirect";
import { clamp } from "@/lib/ai-guard";

/**
 * Security regression tests — these lock in the pre-push hardening so the
 * vulnerabilities can never silently come back:
 *   1. open-redirect guard on the post-login / OAuth `next` destination
 *   2. unauthenticated callers cannot reach paid AI server actions
 *   3. user-supplied prompt text is length-capped (token-cost abuse)
 */

describe("safeNextPath — open-redirect guard", () => {
  it("allows legitimate same-origin relative paths (with query/fragment)", () => {
    for (const p of ["/dashboard", "/clients", "/leads?stage=hot", "/x#y", "/"]) {
      expect(safeNextPath(p)).toBe(p);
    }
  });

  it("rejects absolute external URLs", () => {
    expect(safeNextPath("https://evil.com")).toBe("/dashboard");
    expect(safeNextPath("http://evil.com")).toBe("/dashboard");
    expect(safeNextPath("javascript:alert(1)")).toBe("/dashboard");
  });

  it("rejects protocol-relative and backslash bypasses", () => {
    expect(safeNextPath("//evil.com")).toBe("/dashboard");
    expect(safeNextPath("/\\evil.com")).toBe("/dashboard");
    // sanity: a genuine single-slash path with a slash later is still allowed
    expect(safeNextPath("/clients/123")).toBe("/clients/123");
  });

  it("rejects the @userinfo trick (origin + value -> origin@evil.com)", () => {
    expect(safeNextPath("@evil.com")).toBe("/dashboard");
  });

  it("falls back for empty, whitespace, or non-string input", () => {
    expect(safeNextPath("")).toBe("/dashboard");
    expect(safeNextPath("dashboard")).toBe("/dashboard"); // no leading slash
    expect(safeNextPath(null)).toBe("/dashboard");
    expect(safeNextPath(undefined)).toBe("/dashboard");
    expect(safeNextPath(123 as unknown)).toBe("/dashboard");
  });

  it("honours a custom fallback", () => {
    expect(safeNextPath("//evil.com", "/login")).toBe("/login");
  });
});

describe("clamp — prompt-input length cap", () => {
  it("truncates oversized input to the limit", () => {
    expect(clamp("x".repeat(10_000), 4000)).toHaveLength(4000);
  });

  it("leaves short input untouched and coerces nullish to empty string", () => {
    expect(clamp("hello", 4000)).toBe("hello");
    expect(clamp(undefined)).toBe("");
    expect(clamp(null)).toBe("");
  });
});

describe("AI server actions — authentication guard", () => {
  // Default mock: an authenticated advisor. Individual tests override it.
  const requireUser = vi.fn();
  vi.doMock("@/lib/ai-guard", async (importActual) => {
    const actual = await importActual<typeof import("@/lib/ai-guard")>();
    return { ...actual, requireUser };
  });

  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    process.env.GROQ_API_KEY = "test-key";
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: "{}" } }] }),
      text: async () => "",
    } as Response);
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("blocks an unauthenticated caller BEFORE any external request", async () => {
    requireUser.mockRejectedValueOnce(new Error("Unauthorized"));
    const { aiObjectionResponses } = await import("@/app/actions/ai");
    await expect(aiObjectionResponses("masyadong mahal")).rejects.toThrow(/Unauthorized/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("proceeds to call the model once the caller is authenticated", async () => {
    requireUser.mockResolvedValueOnce({ id: "advisor-1" });
    const { aiObjectionResponses } = await import("@/app/actions/ai");
    await aiObjectionResponses("test");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
