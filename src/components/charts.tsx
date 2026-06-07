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
  border: "1px solid rgba(15,24,56,0.08)",
  boxShadow: "0 10px 30px -10px rgba(15,24,56,0.25)",
  fontSize: 12,
  padding: "8px 12px",
};

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
            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
        <YAxis
          tickFormatter={(v) => peso(v, { compact: true })}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke="#94a3b8"
          width={48}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => peso(Number(v))}
        />
        <Area
          type="monotone"
          dataKey="target"
          stroke="#cbd5e1"
          strokeDasharray="5 5"
          strokeWidth={2}
          fill="none"
        />
        <Area
          type="monotone"
          dataKey="production"
          stroke="#4f46e5"
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
  const colors = ["#6366f1", "#7c3aed", "#8b5cf6", "#f59e0b", "#10b981"];
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
          stroke="#64748b"
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8fafc" }} />
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
  color = "#10b981",
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
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
        <YAxis
          tickFormatter={(v) => peso(v, { compact: true })}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke="#94a3b8"
          width={48}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => peso(Number(v))} />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#4f46e5"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          strokeDasharray="6 5"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
