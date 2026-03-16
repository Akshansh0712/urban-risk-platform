// frontend/components/RiskMap.tsx

import { scoreToRiskLevel, getRiskColor, DEFAULT_CENTER } from "@/lib/map-config";

export default function RiskMap() {
  const riskScore = 0.8;

  const riskLevel = scoreToRiskLevel(riskScore);
  const color = getRiskColor(riskLevel);

  return (
    <div>
      <h2>Risk Level: {riskLevel}</h2>
      <p>Color: {color}</p>
      <p>Map Center: {DEFAULT_CENTER.join(", ")}</p>
    </div>
  );
}