"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { fetchLatestRisk } from "@/lib/api";
import type { LatestRisk } from "@/lib/types";
import { getRiskColor } from "@/lib/map-config";
import { Zap, ArrowRight, Activity } from "lucide-react";

// Leaflet landing map — client only
const LandingMap = dynamic(() => import("@/components/map/LandingMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-background" />,
});

export default function LandingPage() {
  const router = useRouter();
  const [risk, setRisk] = useState<LatestRisk | null>(null);

  useEffect(() => {
    fetchLatestRisk().then(setRisk).catch(() => {});
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Full-screen OSM map bg */}
      <div className="absolute inset-0">
        <LandingMap />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">

        {/* Logo */}
        <motion.div className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center">
            <Zap className="w-6 h-6 text-accent" />
          </div>
        </motion.div>

        {/* Live risk badge */}
        {risk && (
          <motion.div className="mb-6"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-sm font-mono"
              style={{ background: `${getRiskColor(risk.risk_level)}12`, borderColor: `${getRiskColor(risk.risk_level)}35` }}>
              <motion.span className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getRiskColor(risk.risk_level) }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }} />
              <Activity className="w-3.5 h-3.5" style={{ color: getRiskColor(risk.risk_level) }} />
              <span style={{ color: getRiskColor(risk.risk_level) }}>
                {risk.city} · {risk.risk_level} · {Math.round(risk.risk_score * 100)}% risk
              </span>
            </div>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-display font-bold text-text-primary mb-4 leading-tight"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          Urban Risk<br />
          <span className="text-accent">Intelligence</span>
        </motion.h1>

        <motion.p className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}>
          AI-powered real-time monitoring and prediction of urban safety risks.
          Powered by OpenStreetMap, Leaflet, and open data.
        </motion.p>

        {/* CTAs */}
        <motion.div className="flex gap-4"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}>
          <button onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-display font-semibold px-8 py-4 rounded-xl transition-all text-base tracking-wide">
            Start Monitoring <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => router.push("/login")}
            className="flex items-center gap-2 bg-panel/80 backdrop-blur border border-border hover:border-accent/40 text-text-primary font-medium px-8 py-4 rounded-xl transition-all text-base">
            Sign In
          </button>
        </motion.div>
      </div>
    </div>
  );
}