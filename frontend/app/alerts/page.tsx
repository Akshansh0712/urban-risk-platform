"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Card from "@/components/ui/card";
import AlertItem from "@/components/ui/AlertItem";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { fetchAlertHistory, fetchAlertStats, acknowledgeAlert } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import type { Alert, AlertStats, NewAlertEvent } from "@/lib/types";
import { Filter, Search } from "lucide-react";

type SeverityFilter = "ALL" | "HIGH" | "MEDIUM";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SeverityFilter>("ALL");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const [alertData, alertStats] = await Promise.all([
        fetchAlertHistory(24),
        fetchAlertStats(),
      ]);
      setAlerts(alertData.alerts);
      setStats(alertStats);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

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
      setAlerts((prev) => [newAlert, ...prev]);
    };

    socket.on("new_alert", onAlert);
    const t = setInterval(load, 30_000);
    return () => {
      socket.off("new_alert", onAlert);
      clearInterval(t);
    };
  }, [load]);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
      setAlerts((prev) =>
        prev.map((a) =>
          a.alert_id === alertId ? { ...a, acknowledged: true } : a
        )
      );
    } catch {
      console.error("Acknowledge failed");
    }
  };

  const filtered = alerts.filter((a) => {
    if (filter !== "ALL" && a.severity !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) &&
        !a.zone_id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60 overflow-hidden">
        <Navbar title="Alerts" />
        <motion.main
          className="flex-1 overflow-y-auto p-5 space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stats row */}
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total", value: stats.total, color: "#3B82F6" },
                { label: "High Severity", value: stats.active_high, color: "#EF4444" },
                { label: "Medium Severity", value: stats.active_medium, color: "#F97316" },
                { label: "Last Hour", value: stats.last_hour, color: "#94A3B8" },
              ].map((s) => (
                <Card key={s.label} className="text-center py-4">
                  <p className="text-2xl font-display font-bold" style={{ color: s.color }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-text-muted font-mono mt-1">{s.label}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Filter bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-panel border border-border rounded-lg p-1">
              {(["ALL", "HIGH", "MEDIUM"] as SeverityFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded font-mono transition-colors
                    ${filter === f
                      ? f === "HIGH"
                        ? "bg-risk-high/20 text-risk-high"
                        : f === "MEDIUM"
                        ? "bg-risk-medium/20 text-risk-medium"
                        : "bg-accent/20 text-accent"
                      : "text-text-muted hover:text-text-secondary"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search by title or zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-panel border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted font-mono focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <span className="text-xs text-text-muted font-mono">
              {filtered.length} alerts
            </span>
          </div>

          {/* Alerts list */}
          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <p className="text-text-secondary text-sm text-center py-8">
                No alerts match the current filter.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((alert) => (
                  <AlertItem
                    key={alert.alert_id}
                    alert={alert}
                    onAcknowledge={handleAcknowledge}
                    showActions
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}