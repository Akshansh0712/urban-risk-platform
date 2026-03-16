"use client";
import { useEffect, useState } from "react";
import { fetchCameraList } from "@/lib/api";
import type { CameraStats } from "@/lib/types";
import Card from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { Wifi, WifiOff } from "lucide-react";

export default function CameraFeed() {
  const [cameras, setCameras] = useState<CameraStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await fetchCameraList();
      setCameras(data.cameras);
      setError(null);
      setLoading(false);
    } catch {
      setError("Camera list unavailable");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5_000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <SkeletonCard lines={4} />;
  if (error)
    return (
      <Card className="border-risk-high/30">
        <p className="text-risk-high text-sm">{error}</p>
        <button onClick={load} className="text-xs text-accent mt-2">Retry</button>
      </Card>
    );
  if (!cameras.length)
    return (
      <Card>
        <p className="text-text-secondary text-sm">Awaiting camera data...</p>
      </Card>
    );

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Camera Nodes</p>
        <span className="text-xs text-text-muted font-mono">{cameras.length} total</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {cameras.map((cam) => (
          <div
            key={cam.camera_id}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border"
          >
            <div className="shrink-0">
              {cam.is_online ? (
                <Wifi className="w-3.5 h-3.5 text-risk-safe" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-risk-high" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{cam.name}</p>
              <p className="text-[10px] text-text-muted font-mono">
                👤 {cam.person_count} · 🚗 {cam.vehicle_count} · {(cam.crowd_density * 100).toFixed(0)}% density
              </p>
            </div>
            <StatusBadge level={cam.risk_level} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
}