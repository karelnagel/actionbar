import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { customVector } from "./vector";
import { relations } from "drizzle-orm";

export const texts = pgTable("texts", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  embedding: customVector("embedding", { dimensions: 512 }).notNull(),
  sourceUrl: text("source_url").notNull(),
});

export const textsRelations = relations(texts, ({ one }) => ({
  source: one(sources, { fields: [texts.sourceUrl], references: [sources.url] }),
}));

export const sources = pgTable("sources", {
  url: text("url").primaryKey(),
  hash: text("hash").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: integer("status").notNull(),
});

export const sourcesRelations = relations(sources, ({ many }) => ({
  texts: many(texts),
}));
