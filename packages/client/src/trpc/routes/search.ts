import { z } from "zod";
import { publicProcedure, root } from "../root";
import { findClosest } from "../../../../knowledge/src/embeddings";

const SearchResult = z.object({
  title: z.string(),
  text: z.string(),
  sourceUrl: z.string(),
  cosine: z.number(),
});

export const search = root.router({
  search: publicProcedure
    .input(z.object({ q: z.string() }))
    .output(z.object({ items: SearchResult.array() }))
    .mutation(async ({ input: { q } }) => {
      const res = await findClosest(q);
      return { items: res };
    }),
});
