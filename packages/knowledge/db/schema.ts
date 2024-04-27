import { pgTable, text } from "drizzle-orm/pg-core";
import { customVector } from "./vector";
import { relations } from "drizzle-orm";

export const texts = pgTable("texts", {
  hash: text("hash").primaryKey(),
  text: text("text"),
  embedding: customVector("embedding", { dimensions: 512 }),
  sourceId: text("source_id"),
});

export const textsRelations = relations(texts, ({ one }) => ({
  source: one(sources, { fields: [texts.sourceId], references: [sources.id] }),
}));

export const sources = pgTable("sources", {
  id: text("id").primaryKey(),
  url: text("url"),
  title: text("title"),
  description: text("description"),
});

export const sourcesRelations = relations(sources, ({ many }) => ({
  texts: many(texts),
}));
