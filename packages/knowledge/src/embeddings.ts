import { db } from "../db";
import { sources, texts } from "../db/schema";
import { cosineDistance } from "../db/vector";
import { pipeline } from "@xenova/transformers";
import { asc, eq } from "drizzle-orm";
import OpenAI from "openai";

export const generateOpenAIEmbeddings = async (text: string) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
    dimensions: 512,
  });
  return embedding.data[0]!.embedding;
};

export const generateLocalEmbedding = async (text: string) => {
  const extractor = await pipeline("feature-extraction", "Xenova/jina-embeddings-v2-small-en", {
    quantized: false,
  });

  const output = await extractor([text], { pooling: "mean" });
  const numbers: number[] = [];
  for (const elem of output.data) {
    numbers.push(elem);
  }
  return numbers;
};

export const findClosest = async (text: string) => {
  const embedding = await generateLocalEmbedding(text);
  const res = await db
    .select({
      text: texts.text,
      title: sources.title,
      sourceUrl: sources.url,
      cosine: cosineDistance(texts.embedding, embedding),
      // l2: l2Distance(texts.embedding, embedding),
      // maxInner: maxInnerProduct(texts.embedding, embedding),
    })
    .from(texts)
    .innerJoin(sources, eq(sources.url, texts.sourceUrl))
    .orderBy(asc(cosineDistance(texts.embedding, embedding)))
    .limit(5)
    .execute();
  return res;
};
