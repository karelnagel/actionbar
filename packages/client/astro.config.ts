import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import aws from "astro-sst";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { DEFAULT_LOCALE, Locale } from "@template/i18n";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import { SITE } from "@template/shared/consts";

export default defineConfig({
  output: "hybrid",
  adapter: aws({ serverRoutes: ["api/*"] }),
  site: SITE,
  integrations: [tailwind(), mdx(), react(), robotsTxt(), sitemap()],
  vite: { plugins: [basicSsl()] },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: Locale.options,
    routing: {
      redirectToDefaultLocale: false,
      prefixDefaultLocale: true,
      strategy: "pathname",
    },
  },
});
