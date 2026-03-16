"use client";
import { motion } from "framer-motion";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import SystemStats from "./components/SystemStats";
import RiskPanel from "./components/RiskPanel";
import CameraFeed from "./components/CameraFeed";
import AlertsPanel from "./components/AlertsPanel";
import RiskMap from "./components/RiskMap";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60 overflow-hidden">
        <Navbar title="Dashboard" />
        <motion.main
          className="flex-1 overflow-y-auto p-5 space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top stat cards */}
          <SystemStats />

          {/* Three-column main content */}
          <div className="grid grid-cols-12 gap-5 h-[calc(100vh-220px)]">
            {/* Left column */}
            <div className="col-span-3 flex flex-col gap-4 overflow-y-auto">
              <CameraFeed />
              <AlertsPanel />
            </div>

            {/* Center — Map */}
            <div className="col-span-6 h-full">
              <RiskMap />
            </div>

            {/* Right column */}
            <div className="col-span-3 overflow-y-auto">
              <RiskPanel />
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}