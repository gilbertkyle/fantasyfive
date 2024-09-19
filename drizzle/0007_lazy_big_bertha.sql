ALTER TABLE "league_requests" ALTER COLUMN "league_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "league_requests" ALTER COLUMN "from" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "fantasy_teams_owner_id_league_id_index" ON "fantasy_teams" ("owner_id","league_id");