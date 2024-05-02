CREATE TABLE IF NOT EXISTS "sources" (
	"url" text PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "texts" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"embedding" vector(512) NOT NULL,
	"source_url" text NOT NULL
);
