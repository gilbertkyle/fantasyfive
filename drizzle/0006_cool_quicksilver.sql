DROP INDEX IF EXISTS "defenses_id_week_season_index";--> statement-breakpoint
ALTER TABLE "picks" ALTER COLUMN "quarterback_id" SET DATA TYPE integer USING (quarterback_id::integer);--> statement-breakpoint
ALTER TABLE "picks" ALTER COLUMN "running_back_id" SET DATA TYPE integer USING (running_back_id::integer);--> statement-breakpoint
ALTER TABLE "picks" ALTER COLUMN "wide_receiver_id" SET DATA TYPE integer USING (wide_receiver_id::integer);--> statement-breakpoint
ALTER TABLE "picks" ALTER COLUMN "tight_end_id" SET DATA TYPE integer USING (tight_end_id::integer);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "defenses_team_id_week_season_index" ON "defenses" ("team_id","week","season");