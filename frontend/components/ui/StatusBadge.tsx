"use client";
import { motion } from "framer-motion";

type Level = "HIGH" | "MEDIUM" | "SAFE";

const STYLE: Record<Level, string> = {
  HIGH:   "bg-risk-high/15 text-risk-high border-risk-high/30",
  MEDIUM: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  SAFE:   "bg-risk-safe/15 text-risk-safe border-risk-safe/30",
};
const DOT: Record<Level, string> = {
  HIGH: "bg-risk-high", MEDIUM: "bg-risk-medium", SAFE: "bg-risk-safe",
};

export default function StatusBadge({
  level, size = "sm",
}: { level: Level; size?: "sm" | "md" | "lg" }) {
  const sz =
    size === "lg" ? "px-3.5 py-1.5 text-xs tracking-widest" :
    size === "md" ? "px-3 py-1 text-[11px] tracking-wider" :
    "px-2 py-0.5 text-[10px] tracking-wider";

  return (
    <motion.span
      animate={level === "HIGH" ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold
        ${STYLE[level]} ${sz}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[level]}`} />
      {level}
    </motion.span>
  );
}