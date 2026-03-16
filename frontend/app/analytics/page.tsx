"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ZAxis,
} from "recharts";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Card from "@/components/ui/card";
import SkeletonCard from "@/components/ui/SkeletonCard";
import RiskTrendChart from "@/components/charts/RiskTrendChart";
import TrafficChart from "@/components/charts/TrafficChart";
import { fetchRiskHistory, fetchTraffic, fetchTrafficWeather } from "@/lib/api";
import type { RiskHistoryPoint, TrafficReading, TrafficWeatherPoint } from "@/lib/types";

const HOUR_OPTIONS = [6, 12, 24, 48, 72];

export default function AnalyticsPage() {
  const [hours, setHours] = useState(24);
  const [riskHistory, setRiskHistory] = useState<RiskHistoryPoint[]>([]);
  const [traffic, setTraffic] = useState<TrafficReading[]>([]);
  const [scatter, setScatter] = useState<TrafficWeatherPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [rh, tr, sc] = await Promise.all([
        fetchRiskHistory(hours),
        fetchTraffic(hours * 2),
        fetchTrafficWeather(hours),
      ]);
      setRiskHistory(rh.data);
      setTraffic(tr.traffic);
      setScatter(sc.data);
    } catch (err) {
      console.error("Analytics load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [hours]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60 overflow-hidden">
        <Navbar title="Analytics" />
        <motion.main
          className="flex-1 overflow-y-auto p-5 space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Date range selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-mono uppercase tracking-widest mr-2">
              Time Range:
            </span>
            {HOUR_OPTIONS.map((h) => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`text-xs px-3 py-1.5 rounded font-mono border transition-colors
                  ${hours === h
                    ? "bg-accent/20 text-accent border-accent/40"
                    : "text-text-muted border-border hover:border-accent/30 hover:text-text-secondary"
                  }`}
              >
                {h}h
              </button>
            ))}
          </div>

          {/* Chart 1 — Risk Trend */}
          <Card>
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">
              Risk Score Trend — Last {hours}h
            </p>
            <div className="h-64">
              {loading ? (
                <div className="w-full h-full bg-border/20 rounded animate-pulse" />
              ) : riskHistory.length === 0 ? (
                <p className="text-text-secondary text-sm mt-8 text-center">Awaiting data...</p>
              ) : (
                <RiskTrendChart data={riskHistory} />
              )}
            </div>
          </Card>

          {/* Chart 2 — Traffic Density */}
          <Card>
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">
              Traffic Congestion Flow — Last {hours}h
            </p>
            <div className="h-64">
              {loading ? (
                <div className="w-full h-full bg-border/20 rounded animate-pulse" />
              ) : traffic.length === 0 ? (
                <p className="text-text-secondary text-sm mt-8 text-center">Awaiting data...</p>
              ) : (
                <TrafficChart data={traffic} />
              )}
            </div>
          </Card>

          {/* Chart 3 — Weather vs Incidents */}
          <Card>
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-1">
              Rainfall vs. Traffic Incidents
            </p>
            <p className="text-[10px] text-text-muted font-mono mb-4">
              Dot size = congestion ratio · Correlation analysis
            </p>
            <div className="h-64">
              {loading ? (
                <div className="w-full h-full bg-border/20 rounded animate-pulse" />
              ) : scatter.length === 0 ? (
                <p className="text-text-secondary text-sm mt-8 text-center">Awaiting data...</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis
                      dataKey="rainfall_1h"
                      name="Rainfall (mm)"
                      tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
                      axisLine={{ stroke: "#1E293B" }}
                      tickLine={false}
                      label={{ value: "Rainfall (mm)", position: "insideBottom", offset: -4, fill: "#475569", fontSize: 10 }}
                    />
                    <YAxis
                      dataKey="incident_count"
                      name="Incidents"
                      tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ZAxis dataKey="congestion_ratio" range={[40, 200]} />
                    <Tooltip
                      contentStyle={{
                        background: "#141A2F",
                        border: "1px solid #1E293B",
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        fontSize: "11px",
                      }}
                      cursor={{ strokeDasharray: "3 3", stroke: "#1E293B" }}
                    />
                    <Scatter
                      data={scatter}
                      fill="#3B82F6"
                      fillOpacity={0.7}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.main>
      </div>
    </div>
  );
}