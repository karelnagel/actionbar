import { search } from "./search";
import { router } from "../root";

export const appRouter = router({
  search,
});

export type AppRouter = typeof appRouter;
