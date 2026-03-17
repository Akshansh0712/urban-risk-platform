"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import type { TrafficReading } from "@/lib/types";
import { format } from "date-fns";

const color = (r: number) =>
  r < 0.3 ? "#EF4444" : r < 0.6 ? "#F97316" : "#22C55E";

export default function TrafficChart({ data }: { data: TrafficReading[] }) {
  const rows = data.map((d) => ({
    ...d,
    time: format(new Date(d.recorded_at), "HH:mm"),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />

        <XAxis
          dataKey="time"
          tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
          axisLine={{ stroke: "#1E293B" }}
          tickLine={false}
        />

        <YAxis
          domain={[0, 1]}
          tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: any) => `${(Number(v) * 100).toFixed(0)}%`}
        />

        <Tooltip
          contentStyle={{
            background: "#141A2F",
            border: "1px solid #1E293B",
            borderRadius: 8,
            fontFamily: "monospace",
            fontSize: 11,
          }}
          formatter={(value: any) => {
            const num = typeof value === "number" ? value : parseFloat(String(value));
            return [`${(num * 100).toFixed(1)}%`, "Flow"];
          }}
        />

        <Bar dataKey="congestion_ratio" radius={[3, 3, 0, 0]}>
          {rows.map((r, i) => (
            <Cell key={i} fill={color(r.congestion_ratio)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}