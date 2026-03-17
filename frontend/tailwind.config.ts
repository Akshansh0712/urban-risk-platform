import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F1A",
        panel:      "#141A2F",
        border:     "#1E293B",
        accent:     "#3B82F6",
        risk: {
          high:   "#EF4444",
          medium: "#F97316",
          safe:   "#22C55E",
        },
        text: {
          primary:   "#F1F5F9",
          secondary: "#94A3B8",
          muted:     "#475569",
        },
      },
      fontFamily: {
        mono:    ["'JetBrains Mono'", "monospace"],
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      keyframes: {
        "pulse-slow": { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        scanline: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(400%)" } },
      },
      animation: {
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
        scanline:     "scanline 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;