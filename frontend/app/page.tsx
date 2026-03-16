"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { fetchLatestRisk } from "@/lib/api";
import type { LatestRisk } from "@/lib/types";

import { Zap, ArrowRight } from "lucide-react";
import { getRiskColor } from "@/lib/riskColors";

/* Leaflet hero map (client only) */
const HeroMap = dynamic(
  () => import("@/components/map/HeatmapLayer"),
  { ssr: false }
);

export default function LandingPage() {
  const router = useRouter();
  const [risk, setRisk] = useState<LatestRisk | null>(null);

  useEffect(() => {
    fetchLatestRisk().then(setRisk).catch(() => {});
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* OpenStreetMap + Leaflet background */}
      <div className="absolute inset-0">
        <HeroMap />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">

        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center">
            <Zap className="w-6 h-6 text-accent" />
          </div>
        </motion.div>

        {/* Live risk badge */}
        {risk && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-6"
          >
            <div
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border text-sm font-mono"
              style={{
                background: `${getRiskColor(risk.risk_level)}20`,
                borderColor: `${getRiskColor(risk.risk_level)}50`,
              }}
            >
              {/* Pulsing dot */}
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getRiskColor(risk.risk_level) }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />

              <span style={{ color: getRiskColor(risk.risk_level) }}>
                LIVE — {risk.city} Risk Level: {risk.risk_level} (
                {(risk.risk_score * 100).toFixed(0)}%)
              </span>
            </div>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-display font-bold text-text-primary mb-4 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Urban Risk
          <br />
          <span className="text-accent">Intelligence</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          AI-powered real-time monitoring and prediction of urban safety risks.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-display font-semibold px-8 py-4 rounded-xl transition-colors text-base"
          >
            Start Monitoring <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-panel/80 backdrop-blur border border-border hover:border-accent/40 text-text-primary font-medium px-8 py-4 rounded-xl transition-colors text-base"
          >
            View Live Demo
          </button>
        </motion.div>

      </div>
    </div>
  );
}