import { db } from "../db";
import { sources, texts } from "../db/schema";
import { findClosest, generateEmbedding } from "./embeddings";
import { indexSite } from "./sitemap";
import crypto from "crypto";

const getRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};
const getMd5 = (text: string) => {
  return crypto.createHash("md5").update(text).digest("hex");
};

export const indexWebsite = async () => {
  const url = "https://asius.ai/sitemap.xml";
  const sites = await indexSite(url);
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
};

export const search = async (q: string) => {
  const results = await findClosest(q);
  console.log(results);
};

// indexWebsite();
search("remotion");
