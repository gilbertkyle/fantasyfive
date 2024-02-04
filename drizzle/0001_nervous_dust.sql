ALTER TABLE "player_weeks" ALTER COLUMN "season" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "player_weeks" ALTER COLUMN "week" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "id" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "player_weeks" ADD COLUMN "player_id" varchar(64);