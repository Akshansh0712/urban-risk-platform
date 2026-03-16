"use client";
import { useEffect, useState } from "react";
import { Bell, Wifi, WifiOff } from "lucide-react";
import { getSocket } from "@/lib/socket";
import type { NewAlertEvent } from "@/lib/types";

export default function Navbar({ title }: { title: string }) {
  const [connected, setConnected] = useState(false);
  const [unread, setUnread] = useState(0);
  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onAlert = (_: NewAlertEvent) => setUnread((n) => n + 1);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new_alert", onAlert);

    if (socket.connected) setConnected(true);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new_alert", onAlert);
    };
  }, []);

  return (
    <header className="h-14 bg-panel border-b border-border flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-display font-bold text-text-primary">{title}</h1>

      <div className="flex items-center gap-4">
        <span className="text-xs text-text-muted font-mono">{now}</span>

        {/* WebSocket status */}
        <div className="flex items-center gap-1.5">
          {connected ? (
            <Wifi className="w-3.5 h-3.5 text-risk-safe" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-risk-high animate-pulse" />
          )}
          <span className={`text-xs font-mono ${connected ? "text-risk-safe" : "text-risk-high"}`}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>

        {/* Alerts bell */}
        <button
          className="relative"
          onClick={() => setUnread(0)}
          title="New alerts"
        >
          <Bell className="w-4 h-4 text-text-secondary" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-risk-high rounded-full text-[9px] text-white flex items-center justify-center font-mono">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
          <span className="text-[10px] text-accent font-mono font-bold">OP</span>
        </div>
      </div>
    </header>
  );
}