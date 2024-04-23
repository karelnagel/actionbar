import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import type { CreateContext } from "../pages/api/trpc/[trpc]";

export const root = initTRPC.context<CreateContext>().create({
  transformer: SuperJSON,
});

export const router = root.router;
export const publicProcedure = root.procedure;
