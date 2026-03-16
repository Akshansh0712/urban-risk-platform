"use client";
import { motion } from "framer-motion";

type RiskLevel = "HIGH" | "MEDIUM" | "SAFE";

const CONFIG: Record<RiskLevel, { bg: string; text: string; border: string; label: string }> = {
  HIGH: {
    bg: "bg-risk-high/20",
    text: "text-risk-high",
    border: "border-risk-high/30",
    label: "HIGH",
  },
  MEDIUM: {
    bg: "bg-risk-medium/20",
    text: "text-risk-medium",
    border: "border-risk-medium/30",
    label: "MEDIUM",
  },
  SAFE: {
    bg: "bg-risk-safe/20",
    text: "text-risk-safe",
    border: "border-risk-safe/30",
    label: "SAFE",
  },
};

export default function StatusBadge({
  level,
  size = "sm",
}: {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
}) {
  const c = CONFIG[level];
  const sizeClass =
    size === "lg"
      ? "px-4 py-1.5 text-sm font-semibold tracking-widest"
      : size === "md"
      ? "px-3 py-1 text-xs font-semibold tracking-wider"
      : "px-2.5 py-0.5 text-xs font-semibold tracking-wider";

  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono
        ${c.bg} ${c.text} ${c.border} ${sizeClass}`}
      animate={level === "HIGH" ? { scale: [1, 1.04, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          level === "HIGH"
            ? "bg-risk-high"
            : level === "MEDIUM"
            ? "bg-risk-medium"
            : "bg-risk-safe"
        }`}
      />
      {c.label}
    </motion.span>
  );
}