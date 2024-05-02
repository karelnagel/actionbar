import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { db } from "../db";
import { sources, texts } from "../db/schema";
import { generateLocalEmbedding } from "./embeddings";
import crypto from "crypto";
import { Page, getPage } from "./get-page";
import { browser } from "./get-html";
import { eq } from "drizzle-orm";
import { getRandomId } from "@actionbar/shared/helpers";

const getMD5 = (text: string) => {
  return crypto.createHash("md5").update(text).digest("hex");
};

export const getPagesFromSitemap = async (url: string): Promise<string[]> => {
  const res = await fetch(url);
  const map = await res.text();
  const sites = map
    .split("<loc>")
    .map((site) => site.split("</loc>")[0]!.trim())
    .slice(1);
  return sites;
};

export const indexSite = async (url: string) => {
  const sites = await getPagesFromSitemap(url);
  console.log(sites);
  const indexed: Page[] = [];
  for (const site of sites) {
    const page = await getPage(site);
    indexed.push(page);
    console.log(`${page.url} indexed`);
  }
  browser?.close();
  return indexed;
};

export const index = async (url: string) => {
  const sites = await indexSite(url);

  for (const site of sites) {
    const hash = getMD5(site.markdown);
    const oldSource = await db.query.sources.findFirst({
      where: (x, { eq, and }) => and(eq(x.url, site.url), eq(x.hash, hash)),
    });
    if (oldSource) {
      console.log(`${site.url} already indexed`);
      continue;
    }

    await db
      .insert(sources)
      .values({
        url: site.url,
        hash,
        status: site.status,
        title: site.title,
        description: site.description,
      })
      .onConflictDoUpdate({
        set: { status: site.status, title: site.title, description: site.description, hash },
        target: [sources.url],
      });

    await db.delete(texts).where(eq(texts.sourceUrl, site.url)).execute();

    for (const text of site.texts) {
      const id = getRandomId();
      const embedding = await generateLocalEmbedding(text);
      await db.insert(texts).values({ text, embedding, sourceUrl: site.url, id });
    }
    console.log(`${site.url} uploaded`);
  }

  console.log("done");
};

index("https://asius.ai/sitemap.xml");
