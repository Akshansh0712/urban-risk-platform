"use client";
import { motion } from "framer-motion";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import SystemStats from "./components/SystemStats";
import RiskPanel from "./components/RiskPanel";
import CameraFeed from "./components/CameraFeed";
import AlertsPanel from "./components/AlertsPanel";
import RiskMap from "@/components/map/RiskMap";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60 overflow-hidden">
        <Navbar title="Dashboard · Indore Urban Risk Intelligence" />
        <motion.main
          className="flex-1 overflow-y-auto p-5 space-y-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        >
          {/* Stat cards */}
          <SystemStats />

          {/* Three-column layout */}
          <div className="grid grid-cols-12 gap-4" style={{ height: "calc(100vh - 200px)" }}>
            {/* Left: cameras + alerts */}
            <div className="col-span-3 flex flex-col gap-4 overflow-y-auto">
              <CameraFeed />
              <AlertsPanel />
            </div>

            {/* Center: map */}
            <div className="col-span-6 h-full min-h-0">
              <RiskMap />
            </div>

            {/* Right: risk gauge + XAI */}
            <div className="col-span-3 overflow-y-auto">
              <RiskPanel />
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}