import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
export default {
  theme: {
    extend: {
      fontFamily: {
        primary: ["Inter Variable", "sans-serif"],
        secondary: ["Montserrat Variable", "sans-serif"],
      },
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
      },
      spacing: {},
    },
  },
  plugins: [typography],
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
} satisfies Config;
