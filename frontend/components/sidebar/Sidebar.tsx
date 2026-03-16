"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Camera,
  BarChart3,
  Bell,
  Zap,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLatestRisk } from "@/lib/api";
import type { LatestRisk } from "@/lib/types";
import { getRiskColor } from "@/lib/map-config";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cameras", label: "Cameras", icon: Camera },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/alerts", label: "Alerts", icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [risk, setRisk] = useState<LatestRisk | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLatestRisk();
        setRisk(data);
      } catch {}
    };
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-panel border-r border-border z-40 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-display font-bold text-text-primary leading-tight">URIP</p>
            <p className="text-[10px] text-text-muted font-mono">Risk Intelligence</p>
          </div>
        </div>
      </div>

      {/* Live Risk Indicator */}
      {risk && (
        <div className="mx-4 mt-4 p-3 rounded-lg bg-background border border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
              Live Risk
            </span>
            <Activity className="w-3 h-3 text-accent animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getRiskColor(risk.risk_level) }}
            />
            <span
              className="text-sm font-mono font-bold"
              style={{ color: getRiskColor(risk.risk_level) }}
            >
              {risk.risk_level}
            </span>
            <span className="text-xs text-text-secondary ml-auto font-mono">
              {(risk.risk_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  active
                    ? "bg-accent/15 text-accent border-l-2 border-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-border/50 border-l-2 border-transparent"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {label === "Dashboard" && risk?.risk_level === "HIGH" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-risk-high animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-[10px] text-text-muted font-mono text-center">
          v1.0 · Indore, IN
        </p>
      </div>
    </aside>
  );
}