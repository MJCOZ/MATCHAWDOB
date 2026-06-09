import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "Cairo", "sans-serif"],
        brand: ["var(--font-fredoka)", "Fredoka One", "cursive"],
      },
      colors: {
        brand: {
          navy: "#261B6D",
          "navy-dark": "#1a1250",
          "navy-light": "#352a8a",
          green: "#B2DE81",
          "green-dark": "#8fc455",
          "green-light": "#d4f0a8",
          white: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#261B6D",
          50: "#eeedf8",
          100: "#d0cef0",
          500: "#261B6D",
          600: "#1a1250",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        "wave-slow": "wave 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        wave: {
          "0%": { backgroundPositionX: "0%" },
          "100%": { backgroundPositionX: "100%" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
