CREATE TABLE IF NOT EXISTS "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "texts" (
	"hash" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"embedding" vector(512) NOT NULL,
	"source_id" text NOT NULL
);
