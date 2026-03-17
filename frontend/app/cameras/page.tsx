"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Card from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { fetchCameraList, fetchCameraStats, getCameraStreamUrl } from "@/lib/api";
import type { CameraStats } from "@/lib/types";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

function CameraCard({ cam }: { cam: CameraStats }) {
  const [stats, setStats]   = useState<CameraStats>(cam);
  const [offline, setOff]   = useState(false);
  const stream = getCameraStreamUrl(cam.camera_id);

  useEffect(() => {
    const t = setInterval(async () => {
      try { setStats(await fetchCameraStats(cam.camera_id)); setOff(false); }
      catch { setOff(true); }
    }, 5_000);
    return () => clearInterval(t);
  }, [cam.camera_id]);

  return (
    <Card className="flex flex-col gap-3 !p-4">
      {/* Stream */}
      <div className="relative w-full aspect-video bg-background rounded-lg overflow-hidden border border-border">
        {offline ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <WifiOff className="w-6 h-6 text-risk-high" />
            <span className="text-xs text-text-muted font-mono">STREAM OFFLINE</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={stream} alt={cam.name}
            className="w-full h-full object-cover"
            onError={() => setOff(true)} />
        )}
        {/* Live dot */}
        <div className="absolute top-2 right-2">
          {offline
            ? <WifiOff className="w-3.5 h-3.5 text-risk-high" />
            : <motion.div className="w-2.5 h-2.5 rounded-full bg-risk-safe"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }} />}
        </div>
        {/* YOLO label */}
        {!offline && (
          <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-text-muted">
            YOLO · LIVE
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">{stats.name}</p>
          <p className="text-[10px] text-text-muted font-mono">{stats.camera_id}</p>
        </div>
        <StatusBadge level={stats.risk_level} size="sm" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { l: "Persons",  v: stats.person_count },
          { l: "Vehicles", v: stats.vehicle_count },
          { l: "Density",  v: `${Math.round(stats.crowd_density * 100)}%` },
        ].map((s) => (
          <div key={s.l} className="bg-background rounded-lg p-2 border border-border">
            <p className="text-sm font-mono font-bold text-text-primary">{s.v}</p>
            <p className="text-[10px] text-text-muted">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Online status */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-border">
        {stats.is_online
          ? <Wifi className="w-3 h-3 text-risk-safe" />
          : <WifiOff className="w-3 h-3 text-risk-high" />}
        <span className={`text-[10px] font-mono ${stats.is_online ? "text-risk-safe" : "text-risk-high"}`}>
          {stats.is_online ? "ONLINE" : "OFFLINE"}
        </span>
        <span className="text-[10px] text-text-muted ml-auto font-mono">
          Score {Math.round(stats.risk_score * 100)}%
        </span>
      </div>
    </Card>
  );
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<CameraStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { const d = await fetchCameraList(); setCameras(d.cameras); setLoading(false); }
    catch { setError("Failed to load cameras"); setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60 overflow-hidden">
        <Navbar title="Camera Feeds" />
        <motion.main className="flex-1 overflow-y-auto p-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
              YOLO-Detected Feeds · {cameras.length} cameras
            </p>
            <button onClick={load}
              className="flex items-center gap-2 text-xs text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors font-mono">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0,1,2].map((i) => <SkeletonCard key={i} lines={4} />)}
            </div>
          )}
          {error && (
            <Card className="border-risk-high/30">
              <p className="text-risk-high">{error}</p>
              <button onClick={load} className="text-xs text-accent mt-2">↺ Retry</button>
            </Card>
          )}
          {!loading && !error && !cameras.length && (
            <Card><p className="text-text-secondary">Awaiting camera data...</p></Card>
          )}
          {!loading && cameras.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cameras.map((c) => <CameraCard key={c.camera_id} cam={c} />)}
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}