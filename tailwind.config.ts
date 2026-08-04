import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/features/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx,mdx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        // ShipSafe branded gradient - Security-focused blue/green spectrum
        shipsafeGradient:
          "linear-gradient(60deg, #3B82F6, #2563EB, #1D4ED8, #10B981, #059669, #047857)",
        // Gradient for buttons (security-themed)
        gradient:
          "linear-gradient(60deg, #3B82F6, #2563EB, #1D4ED8, #10B981, #059669, #047857)",
      },

      animation: {
        fadeIn: "fadeIn 0.25s ease-in-out",
        slideRight: "slideRight 300ms ease-in-out",
        wiggle: "wiggle 1.5s ease-in-out infinite",
        popup: "popup 0.25s ease-in-out",
        shimmer: "shimmer 3s ease-out infinite alternate",
        opacity: "opacity 0.25s ease-in-out",
        appearFromRight: "appearFromRight 300ms ease-in-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideRight: {
          "0%": { opacity: "0.3", transform: "translateX(15%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        wiggle: {
          "0%, 20%, 80%, 100%": { transform: "rotate(0deg)" },
          "30%, 60%": { transform: "rotate(-2deg)" },
          "40%, 70%": { transform: "rotate(2deg)" },
          "45%": { transform: "rotate(-4deg)" },
          "55%": { transform: "rotate(4deg)" },
        },
        popup: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        opacity: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        appearFromRight: {
          "0%": { opacity: "0.3", transform: "translate(15%, 0px)" },
          "100%": { opacity: "1", transform: "translate(0)" },
        },
      },
    },
  },

  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("daisyui"),
  ],

  daisyui: {
    themes: ["light", "dark"],
    styled: true,
    logs: false,
  },
} as Config;

export default config;