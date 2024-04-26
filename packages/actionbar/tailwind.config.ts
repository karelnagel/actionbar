import type { Config } from "tailwindcss";

const config: Config = {
  theme: {},
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
};

export default config;
