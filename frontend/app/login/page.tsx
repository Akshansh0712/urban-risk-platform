"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Auth
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
            <ShieldCheck className="text-indigo-400 h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Sentinel Engine</h2>
          <p className="mt-2 text-sm text-slate-400">Indore Smart-City Surveillance Login</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="text"
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                placeholder="Operator ID"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                placeholder="Secure Access Token"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
          >
            {loading ? "Decrypting..." : "Initialize Dashboard"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}