import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import aws from "astro-sst";
import basicSsl from "@vitejs/plugin-basic-ssl";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import { SITE } from "@actionbar/shared/consts";

export default defineConfig({
  output: "server",
  adapter: aws({ serverRoutes: ["api/*"] }),
  site: SITE,
  integrations: [tailwind(), mdx(), react(), robotsTxt(), sitemap()],
  vite: { plugins: [basicSsl()] },
});
