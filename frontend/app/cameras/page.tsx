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
  const [stats, setStats] = useState<CameraStats>(cam);
  const [offline, setOffline] = useState(false);
  const streamUrl = getCameraStreamUrl(cam.camera_id);

  useEffect(() => {
    const refresh = async () => {
      try {
        const updated = await fetchCameraStats(cam.camera_id);
        setStats(updated);
        setOffline(false);
      } catch {
        setOffline(true);
      }
    };
    const t = setInterval(refresh, 5_000);
    return () => clearInterval(t);
  }, [cam.camera_id]);

  return (
    <Card className="flex flex-col gap-3">
      {/* Stream */}
      <div className="relative w-full aspect-video bg-background rounded-lg overflow-hidden border border-border">
        {offline ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <WifiOff className="w-6 h-6 text-risk-high" />
            <span className="text-xs text-text-muted font-mono">OFFLINE</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={streamUrl}
            alt={`${cam.name} stream`}
            className="w-full h-full object-cover"
            onError={() => setOffline(true)}
          />
        )}
        <div className="absolute top-2 right-2">
          {offline ? (
            <WifiOff className="w-3.5 h-3.5 text-risk-high" />
          ) : (
            <motion.div
              className="w-2 h-2 rounded-full bg-risk-safe"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">{stats.name}</p>
          <p className="text-[10px] text-text-muted font-mono">{stats.camera_id}</p>
        </div>
        <StatusBadge level={stats.risk_level} size="sm" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Persons", value: stats.person_count },
          { label: "Vehicles", value: stats.vehicle_count },
          { label: "Density", value: `${(stats.crowd_density * 100).toFixed(0)}%` },
        ].map((s) => (
          <div key={s.label} className="bg-background rounded-lg p-2 border border-border">
            <p className="text-sm font-mono font-bold text-text-primary">{s.value}</p>
            <p className="text-[10px] text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<CameraStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await fetchCameraList();
      setCameras(data.cameras);
      setLoading(false);
    } catch {
      setError("Failed to load cameras");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60 overflow-hidden">
        <Navbar title="Camera Feeds" />
        <motion.main
          className="flex-1 overflow-y-auto p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
              Live YOLO-Detected Feeds · {cameras.length} cameras
            </p>
            <button
              onClick={load}
              className="flex items-center gap-2 text-xs text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} lines={4} />)}
            </div>
          )}

          {error && (
            <Card className="border-risk-high/30">
              <p className="text-risk-high">{error}</p>
              <button onClick={load} className="text-xs text-accent mt-2">Retry</button>
            </Card>
          )}

          {!loading && !error && cameras.length === 0 && (
            <Card>
              <p className="text-text-secondary">Awaiting camera data...</p>
            </Card>
          )}

          {!loading && cameras.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cameras.map((cam) => (
                <CameraCard key={cam.camera_id} cam={cam} />
              ))}
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}