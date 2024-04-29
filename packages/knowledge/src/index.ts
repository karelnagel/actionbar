import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { db } from "../db";
import { sources, texts } from "../db/schema";
import { generateEmbedding } from "./embeddings";
import { indexSite } from "./sitemap";
import crypto from "crypto";

const getRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};
const getMd5 = (text: string) => {
  return crypto.createHash("md5").update(text).digest("hex");
};

const URL = "https://astro.build/sitemap-0.xml";

export const indexWebsite = async () => {
  await db.delete(sources).execute();
  await db.delete(texts).execute();

  const sites = await indexSite(URL);
  for (const site of sites) {
    const sourceId = getRandomId();
    await db.insert(sources).values({
      id: sourceId,
      title: site.title,
      description: site.description,
      url: site.url,
    });

    for (const text of site.texts) {
      const embedding = await generateEmbedding(text);
      await db
        .insert(texts)
        .values({
          hash: getMd5(sourceId + text),
          text,
          embedding,
          sourceId,
        })
        .onConflictDoUpdate({ set: { text, embedding }, target: [texts.hash] });
    }
    console.log(site);
  }

  console.log("done");
};

indexWebsite();
