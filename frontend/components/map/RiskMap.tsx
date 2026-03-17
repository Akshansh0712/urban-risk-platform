"use client";
import dynamic from "next/dynamic";
import SkeletonCard from "@/components/ui/SkeletonCard";

// Leaflet requires browser APIs — must be client-side only
const RiskMapLeaflet = dynamic(() => import("./RiskMapLeaflet"), {
  ssr: false,
  loading: () => <SkeletonCard lines={6} className="h-full" />,
});

export default function RiskMap() {
  return <div className="w-full h-full"><RiskMapLeaflet /></div>;
}