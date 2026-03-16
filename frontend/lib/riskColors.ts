export function getRiskColor(level: "HIGH" | "MEDIUM" | "SAFE") {
  switch (level) {
    case "HIGH":
      return "#EF4444"; // red
    case "MEDIUM":
      return "#F97316"; // orange
    case "SAFE":
      return "#22C55E"; // green
    default:
      return "#64748B"; // neutral
  }
}