import { defineMiddleware } from "astro:middleware";
import { Locale, DEFAULT_LOCALE, useTranslations } from "@template/i18n";
import { getLocaleUrl } from "@template/shared/helpers";

const SKIP = ["/_astro", "/_image"];

export const onRequest = defineMiddleware(async (Astro, next) => {
  if (SKIP.some((s) => Astro.url.pathname.includes(s))) return next();

  console.log(Astro.url.toString());

  Astro.locals.locale = (Astro.params.locale || Astro.preferredLocale || DEFAULT_LOCALE) as Locale;

  Astro.locals.t = useTranslations(Astro.locals.locale);
  Astro.locals.url = (path?: string, isAbsolute?: boolean) =>
    getLocaleUrl(Astro.locals.locale, path, isAbsolute);
  const res = await next();

  // if (!import.meta.env.PROD)
  //   res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  // else
  //   res.headers.set("Cache-Control", "public, max-age=60, s-maxage=86400, stale-while-revalidate");

  return res;
});
