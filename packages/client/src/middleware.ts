import { defineMiddleware } from "astro:middleware";

const SKIP = ["/_astro", "/_image"];

export const onRequest = defineMiddleware(async (Astro, next) => {
  if (SKIP.some((s) => Astro.url.pathname.includes(s))) return next();

  console.log(Astro.url.toString());


  const res = await next();

  return res;
});
