"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AreaChart, Area, ResponsiveContainer
} from "recharts";
import { Zap, Eye, EyeOff } from "lucide-react";

// Decorative static data only — NOT real data, purely illustrative shape
const DECO_DATA = Array.from({ length: 20 }, (_, i) => ({
  v: Math.sin(i * 0.5) * 30 + Math.random() * 20 + 40,
  v2: Math.cos(i * 0.4) * 25 + Math.random() * 15 + 30,
}));

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left — Form */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col justify-center px-12 py-16"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-display font-bold text-text-primary">Urban Risk Intelligence</p>
            <p className="text-xs text-text-muted font-mono">Operator Access Portal</p>
          </div>
        </div>

        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
          Sign In
        </h1>
        <p className="text-text-secondary text-sm mb-8">
          Access the real-time monitoring dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-text-muted font-mono uppercase tracking-widest mb-2 block">
              Email
            </label>
            <input
              type="email"
              defaultValue=""
              placeholder="operator@city.gov.in"
              className="w-full bg-panel border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-mono focus:outline-none focus:border-accent/60 transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs text-text-muted font-mono uppercase tracking-widest mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                defaultValue=""
                placeholder="••••••••"
                className="w-full bg-panel border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted font-mono focus:outline-none focus:border-accent/60 transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted font-mono uppercase tracking-widest mb-2 block">
              City / Organization
            </label>
            <input
              type="text"
              defaultValue="Indore Municipal Corporation"
              className="w-full bg-panel border border-border rounded-lg px-4 py-3 text-sm text-text-primary font-mono focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-display font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 mt-2"
          >
            {loading ? "Authenticating..." : "Sign In →"}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-text-muted font-mono">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full bg-panel border border-border hover:border-accent/30 text-text-secondary font-medium py-3 rounded-lg transition-colors text-sm"
          >
            Continue with Google
          </button>

          <p className="text-center text-xs text-text-muted mt-4">
            Don&apos;t have access?{" "}
            <button type="button" className="text-accent hover:underline">
              Request access
            </button>
          </p>
        </form>
      </motion.div>

      {/* Right — Decorative */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-panel border-l border-border flex-col justify-center p-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-risk-medium to-risk-high" />

        <div className="relative z-10">
          <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-2">
            City Intelligence Preview
          </p>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-1">
            Indore Urban Analytics
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            AI-powered risk forecasting, live sensor fusion, and explainable decision support.
          </p>

          {/* Decorative chart — static illustrative data */}
          <div className="h-40 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DECO_DATA}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#3B82F6" fill="url(#g1)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="v2" stroke="#EF4444" fill="url(#g2)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Feature list */}
          {[
            "Real-time multi-source risk scoring",
            "YOLO-powered camera analytics",
            "XAI explanations for every decision",
            "WebSocket live alert streaming",
          ].map((f, i) => (
            <motion.div
              key={f}
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <span className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[9px] text-accent font-mono font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-text-secondary">{f}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}