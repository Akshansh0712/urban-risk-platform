// frontend/lib/map-config.ts

export const DEFAULT_CENTER: [number, number] = [22.7196, 75.8577];

export const DEFAULT_ZOOM = 12;

export const RISK_COLORS = {
  HIGH: "#EF4444",
  MEDIUM: "#F97316",
  SAFE: "#22C55E",
} as const;

export type RiskLevel = "HIGH" | "MEDIUM" | "SAFE";

export function getRiskColor(level: RiskLevel): string {
  return RISK_COLORS[level];
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 0.7) return "HIGH";
  if (score >= 0.4) return "MEDIUM";
  return "SAFE";
}