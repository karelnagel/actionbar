CREATE TABLE IF NOT EXISTS "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text,
	"title" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "texts" (
	"hash" text PRIMARY KEY NOT NULL,
	"text" text,
	"embedding" vector(512),
	"source_id" text
);
