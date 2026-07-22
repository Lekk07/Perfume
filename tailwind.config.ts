import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#FAF6EF",
        "ink-raised": "#F2E9D8",
        "ink-line": "#E3D6BC",
        gold: {
          DEFAULT: "#C8A45D",
          light: "#9C7530",
          dim: "#6B4E23",
        },
        paper: "#1C1712",
        mist: "#6B6357",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        label: "0.22em",
      },
      backgroundImage: {
        "trail-gradient":
          "linear-gradient(120deg, transparent 0%, rgba(200,164,93,0.55) 45%, rgba(243,230,197,0.9) 55%, transparent 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px -12px rgba(28,23,18,0.18)",
        "gold-glow": "0 0 40px -10px rgba(200,164,93,0.5)",
      },
      backdropBlur: {
        glass: "16px",
      },
      keyframes: {
        drift: {
          "0%": { strokeDashoffset: "1200" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        drift: "drift 2.4s ease-out forwards",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
