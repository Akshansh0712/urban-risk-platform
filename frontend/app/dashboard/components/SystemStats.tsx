"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Camera, AlertTriangle, Car, CloudRain } from "lucide-react";
import { fetchAlertStats, fetchCameraList, fetchTraffic, fetchWeather } from "@/lib/api";
import Card from "@/components/ui/card";

interface Stat { label: string; value: number; color: string; icon: React.ElementType; sub: string }

function AnimNum({ value, color }: { value: number; color: string }) {
  const mv = useMotionValue(0);
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.9, ease: "easeOut", onUpdate: (v) => setDisp(Math.round(v)) });
    return c.stop;
  }, [value, mv]);
  return <motion.span key={value} className="text-3xl font-display font-bold" style={{ color }}>{disp}</motion.span>;
}

export default function SystemStats() {
  const [stats, setStats] = useState<Stat[] | null>(null);

  const load = async () => {
    try {
      const [aStats, cams, traf, wx] = await Promise.all([
        fetchAlertStats(), fetchCameraList(), fetchTraffic(1), fetchWeather(1),
      ]);
      const incidents = traf.traffic[0]?.incident_count ?? 0;
      const wxAlert   = (wx.weather[0]?.rainfall_1h ?? 0) > 0 ? 1 : 0;
      setStats([
        { label: "Active Cameras",    value: cams.total,        color: "#3B82F6", icon: Camera,        sub: "Online & streaming" },
        { label: "High Risk Zones",   value: aStats.active_high, color: aStats.active_high > 0 ? "#EF4444" : "#22C55E", icon: AlertTriangle, sub: "Requiring attention" },
        { label: "Traffic Incidents", value: incidents,          color: incidents > 5 ? "#F97316" : "#22C55E", icon: Car, sub: "Active right now" },
        { label: "Weather Alerts",    value: wxAlert,            color: wxAlert > 0 ? "#F97316" : "#22C55E", icon: CloudRain, sub: wx.weather[0]?.weather_desc ?? "Clear" },
      ]);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); const t = setInterval(load, 30_000); return () => clearInterval(t); }, []);

  if (!stats) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[0,1,2,3].map((i) => <div key={i} className="bg-panel border border-border rounded-xl h-24 animate-pulse" />)}
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="flex items-center gap-4 !py-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${s.color}18`, border: `1px solid ${s.color}35` }}>
            <s.icon className="w-5 h-5" style={{ color: s.color }} />
          </div>
          <div>
            <AnimNum value={s.value} color={s.color} />
            <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
            <p className="text-[10px] text-text-muted font-mono">{s.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}