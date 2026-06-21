"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { peso } from "@/lib/utils";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-hairline)",
  boxShadow: "0 12px 30px -16px rgba(18,38,30,0.30)",
  fontSize: 12,
  padding: "8px 12px",
};

const GRID = "var(--color-slate-100)";
const AXIS = "var(--color-slate-400)";

export function ProductionAreaChart({
  data,
}: {
  data: { month: string; production: number; target: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="prod" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke={AXIS} />
        <YAxis
          tickFormatter={(v) => peso(v, { compact: true })}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke={AXIS}
          width={48}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => peso(Number(v))}
        />
        <Area
          type="monotone"
          dataKey="target"
          stroke="var(--color-slate-300)"
          strokeDasharray="5 5"
          strokeWidth={2}
          fill="none"
        />
        <Area
          type="monotone"
          dataKey="production"
          stroke="var(--color-brand-500)"
          strokeWidth={2.5}
          fill="url(#prod)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FunnelBars({
  data,
}: {
  data: { stage: string; value: number }[];
}) {
  const colors = [
    "var(--color-brand-700)",
    "var(--color-brand-500)",
    "var(--color-brand-400)",
    "var(--color-gold-500)",
    "var(--color-money-500)",
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          width={92}
          fontSize={12}
          stroke={AXIS}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-slate-50)" }} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniSpark({
  data,
  color = "var(--color-money-500)",
}: {
  data: { v: number }[];
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ForecastChart({
  data,
}: {
  data: { month: string; actual?: number; forecast?: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke={AXIS} />
        <YAxis
          tickFormatter={(v) => peso(v, { compact: true })}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke={AXIS}
          width={48}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => peso(Number(v))} />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--color-brand-500)"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="var(--color-ai-500)"
          strokeWidth={2.5}
          strokeDasharray="6 5"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
