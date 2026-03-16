"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

import type { TrafficReading } from "@/lib/types";
import { format } from "date-fns";

interface Props {
  data: TrafficReading[];
}

function barColor(ratio: number): string {
  if (ratio < 0.3) return "#22C55E"; // low congestion
  if (ratio < 0.6) return "#F97316"; // medium
  return "#EF4444"; // high congestion
}

export default function TrafficChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    time: format(new Date(d.recorded_at), "HH:mm"),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={formatted}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />

        <XAxis
          dataKey="time"
          tick={{
            fill: "#475569",
            fontSize: 10,
            fontFamily: "monospace",
          }}
          axisLine={{ stroke: "#1E293B" }}
          tickLine={false}
        />

        <YAxis
          domain={[0, 1]}
          tick={{
            fill: "#475569",
            fontSize: 10,
            fontFamily: "monospace",
          }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
        />

        <Tooltip
          contentStyle={{
            background: "#141A2F",
            border: "1px solid #1E293B",
            borderRadius: 8,
            fontFamily: "monospace",
            fontSize: 11,
          }}
          formatter={(value) => [
            `${(Number(value) * 100).toFixed(1)}%`,
            "Flow",
          ]}
        />

        <Bar dataKey="congestion_ratio" radius={[3, 3, 0, 0]}>
          {formatted.map((entry, index) => (
            <Cell
              key={index}
              fill={barColor(entry.congestion_ratio)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}