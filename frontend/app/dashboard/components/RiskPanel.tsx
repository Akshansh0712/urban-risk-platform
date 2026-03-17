"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchCurrentRisk, fetchRiskExplain } from "@/lib/api";
import type { RiskAssessment } from "@/lib/types";
import Card from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getRiskColor } from "@/lib/map-config";
import { BrainCircuit, Clock } from "lucide-react";

const FACTORS = [
  { key: "weather", label: "Weather", w: 25 },
  { key: "traffic", label: "Traffic", w: 30 },
  { key: "crowd_events", label: "Crowd Events", w: 20 },
  { key: "camera", label: "Camera AI", w: 15 },
  { key: "social", label: "Social", w: 10 },
] as const;

function Gauge({
  score,
  level,
}: {
  score: number;
  level: "HIGH" | "MEDIUM" | "SAFE";
}) {
  const r = 66;
  const c = 2 * Math.PI * r;
  const color = getRiskColor(level);

  return (
    <div className="flex flex-col items-center">
      <svg width="168" height="168" viewBox="0 0 168 168">
        <circle
          cx="84"
          cy="84"
          r={r}
          fill="none"
          stroke="#1E293B"
          strokeWidth="11"
        />

        <motion.circle
          cx="84"
          cy="84"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - c * score }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          transform="rotate(-90 84 84)"
          style={{ filter: `drop-shadow(0 0 6px ${color}70)` }}
        />

        <text
          x="84"
          y="80"
          textAnchor="middle"
          fill={color}
          fontSize="26"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {Math.round(score * 100)}
        </text>

        <text
          x="84"
          y="99"
          textAnchor="middle"
          fill="#475569"
          fontSize="10"
          fontFamily="monospace"
        >
          RISK SCORE
        </text>
      </svg>

      <StatusBadge level={level} size="lg" />
    </div>
  );
}

export default function RiskPanel() {
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [explain, setExplain] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [r, e] = await Promise.all([
        fetchCurrentRisk(),
        fetchRiskExplain(),
      ]);
      setRisk(r);
      setExplain(e);
      setError(null);
      setLoading(false);
    } catch {
      setError("Failed to load risk data");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <SkeletonCard lines={7} />;

  if (error)
    return (
      <Card className="border-risk-high/30">
        <p className="text-risk-high text-sm">{error}</p>
        <button onClick={load} className="text-xs text-accent mt-2">
          ↺ Retry
        </button>
      </Card>
    );

  if (!risk) return null;

  const reasons = explain?.explanation?.reasons ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Gauge card */}
      <Card className="flex flex-col items-center py-5 gap-1">
        <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-3">
          {risk.zone_id} · {risk.city}
        </p>

        <Gauge score={risk.risk_score} level={risk.risk_level} />

        <div className="flex items-center gap-1.5 mt-3">
          <Clock className="w-3 h-3 text-text-muted" />
          <span className="text-[10px] text-text-muted font-mono">
            {new Date(risk.computed_at).toLocaleTimeString()}
          </span>
        </div>
      </Card>

      {/* Contributing factors */}
      <Card>
        <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-4">
          Contributing Factors
        </p>

        <div className="space-y-3">
          {FACTORS.map(({ key, label, w }) => {
            const f = risk.contributing_factors[key];
            const score = f?.score ?? 0;

            const col =
              score >= 0.7
                ? "#EF4444"
                : score >= 0.4
                ? "#F97316"
                : "#22C55E";

            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-text-secondary">{label}</span>

                  <span className="text-xs font-mono" style={{ color: col }}>
                    {Math.round(score * 100)}%
                    <span className="text-text-muted ml-1">({w}%w)</span>
                  </span>
                </div>

                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: col }}
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 100}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI explanation */}
      {reasons.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-4 h-4 text-accent" />

            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
              AI Explanation
            </p>
          </div>

          <ul className="space-y-2">
            {reasons.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent font-mono text-xs mt-0.5 shrink-0">
                  →
                </span>

                <span className="text-xs text-text-secondary leading-relaxed">
                  {r}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-[10px] text-text-muted font-mono mt-3 pt-3 border-t border-border">
            model: {risk.model_version}
          </p>
        </Card>
      )}
    </div>
  );
}