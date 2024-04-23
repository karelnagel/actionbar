import { contact } from "./contact";
import { router } from "../root";

export const appRouter = router({
  contact,
});

export type AppRouter = typeof appRouter;
