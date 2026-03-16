"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  animate?: boolean;
}

export default function Card({ children, className = "", glass = false, animate = true }: CardProps) {
  const base =
    "bg-panel border border-border rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]";
  const glassStyle = glass ? "backdrop-blur-sm bg-panel/80" : "";

  if (!animate) {
    return <div className={`${base} ${glassStyle} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`${base} ${glassStyle} ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}