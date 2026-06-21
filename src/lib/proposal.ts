/**
 * Pure proposal math — no I/O, no AI. Extracted so it can be unit-tested and
 * reused. Computes a needs-based coverage recommendation from basic inputs.
 */

export type ProposalInput = {
  age: number;
  income: number; // monthly income in pesos
  dependents: number;
};

export type ProposalBase = {
  recommendedCover: number;
  existing: number;
  gap: number;
  annualPremium: number;
  monthlyPremium: number;
  products: { name: string; alloc: number; purpose: string }[];
};

export function calcProposal(input: ProposalInput): ProposalBase {
  const annualIncome = input.income * 12;
  const recommendedCover = Math.round((annualIncome * 10) / 1000000) * 1000000;
  const existing = Math.round(recommendedCover * 0.2);
  const gap = recommendedCover - existing;
  const premium = Math.round((gap * 0.012) / 1000) * 1000;
  return {
    recommendedCover,
    existing,
    gap,
    annualPremium: premium,
    monthlyPremium: Math.round(premium / 12 / 100) * 100,
    products: [
      { name: "WealthLink VUL", alloc: 60, purpose: "Protection + investment growth" },
      { name: "HealthShield Rider", alloc: 25, purpose: "Critical illness & hospitalization" },
      ...(input.dependents > 0
        ? [{ name: "EduSave Rider", alloc: 15, purpose: "Children's education fund" }]
        : [{ name: "Retirement Top-up", alloc: 15, purpose: "Tax-efficient retirement" }]),
    ],
  };
}
