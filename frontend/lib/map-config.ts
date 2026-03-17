export const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const DEFAULT_CENTER: [number, number] = [22.7196, 75.8577];
export const DEFAULT_ZOOM = 13;

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