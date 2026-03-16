"use client";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, MapPin, Clock } from "lucide-react";
import type { Alert } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface AlertItemProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  showActions?: boolean;
}

export default function AlertItem({ alert, onAcknowledge, showActions = false }: AlertItemProps) {
  const time = new Date(alert.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 hover:bg-panel/80 transition-colors"
    >
      <div className="mt-0.5">
        {alert.acknowledged ? (
          <CheckCircle className="w-4 h-4 text-risk-safe" />
        ) : (
          <AlertTriangle
            className={`w-4 h-4 ${
              alert.severity === "HIGH" ? "text-risk-high" : "text-risk-medium"
            }`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <StatusBadge level={alert.severity} size="sm" />
          <span className="text-xs text-text-muted font-mono">{time}</span>
        </div>
        <p className="text-sm text-text-primary font-medium truncate">{alert.title}</p>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{alert.description}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin className="w-3 h-3 text-text-muted" />
          <span className="text-xs text-text-muted font-mono">{alert.zone_id}</span>
          <span className="text-xs text-text-muted ml-2 font-mono">
            Score: {(alert.risk_score * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {showActions && !alert.acknowledged && onAcknowledge && (
        <button
          onClick={() => onAcknowledge(alert.alert_id)}
          className="shrink-0 text-xs px-2.5 py-1 rounded border border-accent/40 text-accent hover:bg-accent/10 transition-colors font-mono"
        >
          ACK
        </button>
      )}
    </motion.div>
  );
}