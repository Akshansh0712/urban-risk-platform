"use client";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, MapPin } from "lucide-react";
import type { Alert } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface Props {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  showActions?: boolean;
}

export default function AlertItem({ alert, onAcknowledge, showActions = false }: Props) {
  const time = new Date(alert.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/60 hover:bg-panel/80 transition-colors"
    >
      <div className="mt-0.5 shrink-0">
        {alert.acknowledged
          ? <CheckCircle2 className="w-4 h-4 text-risk-safe" />
          : <AlertTriangle className={`w-4 h-4 ${alert.severity === "HIGH" ? "text-risk-high" : "text-risk-medium"}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <StatusBadge level={alert.severity} size="sm" />
          <span className="text-[10px] text-text-muted font-mono">{time}</span>
        </div>
        <p className="text-sm text-text-primary font-medium leading-snug">{alert.title}</p>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{alert.description}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin className="w-3 h-3 text-text-muted" />
          <span className="text-[10px] text-text-muted font-mono">{alert.zone_id}</span>
          <span className="text-[10px] text-text-muted ml-auto font-mono">
            {(alert.risk_score * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      {showActions && !alert.acknowledged && onAcknowledge && (
        <button
          onClick={() => onAcknowledge(alert.alert_id)}
          className="shrink-0 text-[10px] px-2.5 py-1 rounded border border-accent/40 text-accent hover:bg-accent/10 transition-colors font-mono uppercase tracking-wider"
        >
          Ack
        </button>
      )}
    </motion.div>
  );
}