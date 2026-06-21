import { describe, it, expect } from "vitest";
import { calcProposal } from "@/lib/proposal";

describe("calcProposal (unit)", () => {
  it("recommends ~10x annual income, rounded to the nearest million", () => {
    // 50k/mo -> 600k/yr -> 6M cover
    const r = calcProposal({ age: 35, income: 50_000, dependents: 2 });
    expect(r.recommendedCover).toBe(6_000_000);
  });

  it("derives gap as cover minus 20% assumed existing coverage", () => {
    const r = calcProposal({ age: 35, income: 50_000, dependents: 2 });
    expect(r.existing).toBe(1_200_000); // 20% of 6M
    expect(r.gap).toBe(r.recommendedCover - r.existing);
  });

  it("keeps annual and monthly premium internally consistent", () => {
    const r = calcProposal({ age: 40, income: 80_000, dependents: 1 });
    // monthly is annual/12 rounded to nearest 100
    expect(r.monthlyPremium).toBe(Math.round(r.annualPremium / 12 / 100) * 100);
    expect(r.annualPremium).toBeGreaterThan(0);
  });

  it("includes an education rider when there are dependents", () => {
    const r = calcProposal({ age: 35, income: 50_000, dependents: 3 });
    expect(r.products.map((p) => p.name)).toContain("EduSave Rider");
  });

  it("swaps in a retirement top-up when there are no dependents", () => {
    const r = calcProposal({ age: 45, income: 60_000, dependents: 0 });
    const names = r.products.map((p) => p.name);
    expect(names).toContain("Retirement Top-up");
    expect(names).not.toContain("EduSave Rider");
  });

  it("always allocates product percentages summing to 100", () => {
    for (const dependents of [0, 1, 4]) {
      const r = calcProposal({ age: 30, income: 40_000, dependents });
      const total = r.products.reduce((s, p) => s + p.alloc, 0);
      expect(total).toBe(100);
    }
  });

  it("handles low income without producing negative numbers", () => {
    const r = calcProposal({ age: 25, income: 8_000, dependents: 0 });
    expect(r.recommendedCover).toBeGreaterThanOrEqual(0);
    expect(r.gap).toBeGreaterThanOrEqual(0);
    expect(r.annualPremium).toBeGreaterThanOrEqual(0);
  });
});
