CREATE TABLE IF NOT EXISTS "league_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"from" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "leagues" ADD COLUMN "is_public" boolean DEFAULT false;