"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { RiskHistoryPoint } from "@/lib/types";
import { format } from "date-fns";

const LINES = [
  { key: "risk_score",    color: "#3B82F6", label: "Overall"  },
  { key: "weather_score", color: "#06B6D4", label: "Weather"  },
  { key: "traffic_score", color: "#F97316", label: "Traffic"  },
  { key: "crowd_score",   color: "#A855F7", label: "Crowd"    },
  { key: "camera_score",  color: "#EAB308", label: "Camera"   },
];

export default function RiskTrendChart({ data }: { data: RiskHistoryPoint[] }) {
  const rows = data.map((d) => ({ ...d, time: format(new Date(d.computed_at), "HH:mm") }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={rows} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <defs>
          {LINES.map((l) => (
            <linearGradient key={l.key} id={`g-${l.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={l.color} stopOpacity={0.28} />
              <stop offset="95%" stopColor={l.color} stopOpacity={0}    />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
        <XAxis dataKey="time"
          tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
          axisLine={{ stroke: "#1E293B" }} tickLine={false} />
        <YAxis domain={[0, 1]}
          tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
          axisLine={false} tickLine={false}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <Tooltip
          contentStyle={{ background: "#141A2F", border: "1px solid #1E293B", borderRadius: 8, fontFamily: "monospace", fontSize: 11 }}
          labelStyle={{ color: "#94A3B8" }}
          formatter={(value) => {
          const num = typeof value === "number" ? value : parseFloat(String(value));
          return [`${(num * 100).toFixed(1)}%`];
        }}
        />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace", color: "#94A3B8" }} />
        {LINES.map((l) => (
          <Area key={l.key} type="monotone" dataKey={l.key} name={l.label}
            stroke={l.color} fill={`url(#g-${l.key})`} strokeWidth={1.5} dot={false} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}