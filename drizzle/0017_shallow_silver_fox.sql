ALTER TABLE "players" ALTER COLUMN "name" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "display_name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "headshot_url" SET DATA TYPE varchar(1024);