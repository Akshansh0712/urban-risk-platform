"use client";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { fetchActiveAlerts } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import type { Alert, NewAlertEvent } from "@/lib/types";
import Card from "@/components/ui/card";
import AlertItem from "@/components/ui/AlertItem";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchActiveAlerts();
      setAlerts(data.alerts.slice(0, 5));
      setError(null);
      setLoading(false);
    } catch {
      setError("Alerts unavailable");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);

    const socket = getSocket();
    const onAlert = (event: NewAlertEvent) => {
      const newAlert: Alert = {
        alert_id: event.alert_id,
        city: "Indore",
        zone_id: event.zone_id,
        lat: event.lat,
        lon: event.lon,
        alert_type: "RISK",
        severity: event.severity,
        title: event.title,
        description: event.description,
        risk_score: event.risk_score,
        is_active: true,
        acknowledged: false,
        created_at: event.created_at,
        resolved_at: null,
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 5));
    };

    socket.on("new_alert", onAlert);
    return () => {
      clearInterval(t);
      socket.off("new_alert", onAlert);
    };
  }, [load]);

  if (loading) return <SkeletonCard lines={5} />;
  if (error)
    return (
      <Card className="border-risk-high/30">
        <p className="text-risk-high text-sm">{error}</p>
        <button onClick={load} className="text-xs text-accent mt-2">Retry</button>
      </Card>
    );
  if (!alerts.length)
    return (
      <Card>
        <p className="text-text-secondary text-sm">No active alerts.</p>
      </Card>
    );

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Recent Alerts</p>
        <span className="text-xs font-mono text-risk-high">{alerts.length} active</span>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {alerts.map((a) => (
            <AlertItem key={a.alert_id} alert={a} />
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}