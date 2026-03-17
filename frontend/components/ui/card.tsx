"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface Props extends HTMLMotionProps<"div"> {
  children: ReactNode;
  glass?: boolean;
}

export default function Card({ children, glass, className = "", ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-panel border border-border rounded-xl p-5
        shadow-[0_4px_24px_rgba(0,0,0,0.4)]
        ${glass ? "backdrop-blur-sm bg-panel/80" : ""}
        ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}