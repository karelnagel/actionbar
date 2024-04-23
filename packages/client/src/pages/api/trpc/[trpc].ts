import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { APIRoute } from "astro";
import { appRouter } from "../../../trpc/routes";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const prerender = false;

export const createContext = (_opts: FetchCreateContextFnOptions) => {
  return {};
};
export type CreateContext = typeof createContext;

export const ALL: APIRoute = ({ request }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  });
};
