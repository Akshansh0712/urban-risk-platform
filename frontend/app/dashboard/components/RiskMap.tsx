"use client";
import dynamic from "next/dynamic";

// Mapbox must be client-side only
const HeatmapLayer = dynamic(() => import("@/components/map/HeatmapLayer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-panel border border-border rounded-xl flex items-center justify-center">
      <p className="text-text-muted font-mono text-sm animate-pulse">Loading map...</p>
    </div>
  ),
});

export default function RiskMap() {
  return (
    <div className="w-full h-full">
      <HeatmapLayer />
    </div>
  );
}