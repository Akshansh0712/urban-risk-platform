"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchCurrentRisk, fetchRiskExplain } from "@/lib/api";
import type { RiskAssessment } from "@/lib/types";
import Card from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getRiskColor } from "@/lib/riskColors";
import { BrainCircuit, Clock } from "lucide-react";

const FACTORS = [
  { key: "weather", label: "Weather", weight: 25 },
  { key: "traffic", label: "Traffic", weight: 30 },
  { key: "crowd_events", label: "Crowd Events", weight: 20 },
  { key: "camera", label: "Camera AI", weight: 15 },
  { key: "social", label: "Social", weight: 10 },
] as const;

// Circular gauge SVG
function RiskGauge({ score, level }: { score: number; level: "HIGH" | "MEDIUM" | "SAFE" }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const color = getRiskColor(level);
  const dash = circ * score;

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#1E293B" strokeWidth="12" />
        <motion.circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${circ}`}
          strokeDashoffset={circ - dash}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
        <text x="90" y="85" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold" fontFamily="monospace">
          {(score * 100).toFixed(0)}
        </text>
        <text x="90" y="105" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="monospace">
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
      const [r, e] = await Promise.all([fetchCurrentRisk(), fetchRiskExplain()]);
      setRisk(r);
      setExplain(e);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError("Failed to load risk data");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <SkeletonCard lines={6} />;
  if (error)
    return (
      <Card className="border-risk-high/30">
        <p className="text-risk-high text-sm">{error}</p>
        <button onClick={load} className="text-xs text-accent mt-2">Retry</button>
      </Card>
    );
  if (!risk) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Gauge */}
      <Card className="flex flex-col items-center py-6">
        <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">
          {risk.zone_id} · {risk.city}
        </p>
        <RiskGauge score={risk.risk_score} level={risk.risk_level} />
        <div className="flex items-center gap-1.5 mt-4">
          <Clock className="w-3 h-3 text-text-muted" />
          <span className="text-[10px] text-text-muted font-mono">
            {new Date(risk.computed_at).toLocaleTimeString()}
          </span>
        </div>
      </Card>

      {/* Contributing Factors */}
      <Card>
        <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">
          Contributing Factors
        </p>
        <div className="space-y-3">
          {FACTORS.map(({ key, label, weight }) => {
            const factor = risk.contributing_factors[key];
            const score = factor?.score ?? 0;
            const color = score >= 0.7 ? "#EF4444" : score >= 0.4 ? "#F97316" : "#22C55E";
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-text-secondary">{label}</span>
                  <span className="text-xs font-mono" style={{ color }}>
                    {(score * 100).toFixed(0)}%
                    <span className="text-text-muted ml-1">({weight}%w)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* XAI Explanation */}
      {explain?.explanation?.reasons && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-4 h-4 text-accent" />
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
              AI Explanation
            </p>
          </div>
          <ul className="space-y-2">
            {explain.explanation.reasons.map((reason, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent font-mono text-xs mt-0.5">→</span>
                <span className="text-xs text-text-secondary">{reason}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-text-muted font-mono mt-3">
            Model: {risk.model_version}
          </p>
        </Card>
      )}
    </div>
  );
}