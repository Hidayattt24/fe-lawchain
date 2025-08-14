import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
        mono: ["var(--font-poppins)", "Poppins", "monospace"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4F1787",
      },
      width: {
        "64": "16rem", // 264px equivalent for button
        "24": "6rem", // 100px equivalent for arrow button
      },
      height: {
        "14": "3.5rem", // 58px equivalent for buttons
      },
      fontSize: {
        "6xl": "4rem", // 64px equivalent
        "2xl": "1.5rem", // 24px equivalent
      },
    },
  },
  plugins: [],
} satisfies Config;
