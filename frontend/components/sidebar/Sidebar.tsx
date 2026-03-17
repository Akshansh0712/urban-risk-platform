"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Camera, AlertTriangle, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils'; // standard shadcn util

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cameras', href: '/cameras', icon: Camera },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen border-r border-slate-800 bg-slate-950 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl tracking-wider">
          <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse-live" />
          SENTINEL
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-300")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-400 transition-colors">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Shutdown Session</span>
        </button>
      </div>
    </div>
  );
}