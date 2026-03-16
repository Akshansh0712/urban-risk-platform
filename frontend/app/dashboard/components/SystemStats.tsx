"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Camera, AlertTriangle, Car, CloudRain } from "lucide-react";
import { fetchAlertStats, fetchCameraList, fetchTraffic, fetchWeather } from "@/lib/api";
import Card from "@/components/ui/card";

interface StatCard {
  label: string;
  value: number;
  unit?: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevRef.current = value;
    return controls.stop;
  }, [value, motionVal]);

  return (
    <motion.span
      className="text-3xl font-display font-bold"
      style={{ color }}
      key={value}
    >
      {display}
    </motion.span>
  );
}

export default function SystemStats() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [alertStats, camList, traffic, weather] = await Promise.all([
        fetchAlertStats(),
        fetchCameraList(),
        fetchTraffic(1),
        fetchWeather(1),
      ]);

      const latestWeather = weather.weather[0];
      const latestTraffic = traffic.traffic[0];

      const weatherSeverity =
        latestWeather?.weather_main === "Rain" || latestWeather?.rainfall_1h > 0 ? 1 : 0;

      setStats([
        {
          label: "Active Cameras",
          value: camList.total,
          icon: Camera,
          color: "#3B82F6",
          description: "Online and streaming",
        },
        {
          label: "High Risk Zones",
          value: alertStats.active_high,
          icon: AlertTriangle,
          color: alertStats.active_high > 0 ? "#EF4444" : "#22C55E",
          description: "Requiring attention",
        },
        {
          label: "Traffic Incidents",
          value: latestTraffic?.incident_count ?? 0,
          icon: Car,
          color: (latestTraffic?.incident_count ?? 0) > 5 ? "#F97316" : "#22C55E",
          description: "Active right now",
        },
        {
          label: "Weather Alerts",
          value: weatherSeverity,
          icon: CloudRain,
          color: weatherSeverity > 0 ? "#F97316" : "#22C55E",
          description: latestWeather?.weather_desc ?? "Clear",
        },
      ]);
      setLoading(false);
    } catch (err) {
      console.error("Stats load failed:", err);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-panel border border-border rounded-xl p-5 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}
          >
            <s.icon className="w-5 h-5" style={{ color: s.color }} />
          </div>
          <div>
            <AnimatedNumber value={s.value} color={s.color} />
            <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
            <p className="text-[10px] text-text-muted font-mono">{s.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}