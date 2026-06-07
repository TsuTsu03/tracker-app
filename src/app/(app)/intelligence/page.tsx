import { getLeads, getClients, getProductionTrend } from "@/lib/data";
import { IntelligenceClient } from "./intelligence-client";

export default async function IntelligencePage() {
  const [leads, clients, trend] = await Promise.all([
    getLeads(),
    getClients(),
    getProductionTrend(),
  ]);

  // Forecast: last 3 actual months + 3 projected at the recent growth rate.
  const recent = trend.slice(-3);
  const actuals = recent.map((t) => ({ month: t.month, actual: t.production }));
  const last = recent[recent.length - 1]?.production ?? 0;
  const prev = recent[0]?.production ?? last;
  const growth = prev > 0 ? Math.min(Math.max(last / prev - 1, 0.03), 0.2) : 0.08;

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const lastIdx = MONTHS.indexOf(recent[recent.length - 1]?.month ?? "Jun");
  let running = last;
  const projected = Array.from({ length: 3 }).map((_, i) => {
    running = Math.round((running * (1 + growth)) / 1000) * 1000;
    return { month: MONTHS[(lastIdx + i + 1) % 12], forecast: running };
  });

  const forecast = [...actuals, ...projected];
  const nextQuarter = projected.reduce((s, p) => s + (p.forecast ?? 0), 0);
  const metrics = {
    thisMonth: last,
    nextQuarter,
    annual: Math.round(((last + nextQuarter / 3) / 2) * 12),
  };

  return (
    <IntelligenceClient
      leads={leads}
      clients={clients}
      forecast={forecast}
      metrics={metrics}
    />
  );
}
