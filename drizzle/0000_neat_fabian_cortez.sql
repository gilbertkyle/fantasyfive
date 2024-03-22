DO $$ BEGIN
 CREATE TYPE "position" AS ENUM('QB', 'RB', 'WR', 'TE', 'DEF', 'FB', 'T', 'SS', 'OLB', 'CB');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "defenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer,
	"week" integer NOT NULL,
	"season" integer NOT NULL,
	"fantasy_points" real DEFAULT 0,
	"sacks" real DEFAULT 0,
	"interceptions" integer DEFAULT 0,
	"fumbles_recovered" integer DEFAULT 0,
	"fumbles_forced" integer DEFAULT 0,
	"defense_tds" integer DEFAULT 0,
	"safeties" integer DEFAULT 0,
	"special_teams_tds" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fantasy_teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"owner_id" varchar(256),
	"league_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "league_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"invitee_id" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leagues" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"owner_id" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "leagues_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "picks" (
	"id" serial PRIMARY KEY NOT NULL,
	"season" integer NOT NULL,
	"week" integer NOT NULL,
	"fantasy_team_id" integer NOT NULL,
	"quarterback_id" varchar(64),
	"qb_points" real DEFAULT 0,
	"running_back_id" varchar(64),
	"rb_points" real DEFAULT 0,
	"wide_receiver_id" varchar(64),
	"wr_points" real DEFAULT 0,
	"tight_end_id" varchar(64),
	"te_points" real DEFAULT 0,
	"defense_id" varchar(64),
	"defense_points" real DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_weeks" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" varchar(64),
	"season" integer NOT NULL,
	"week" integer NOT NULL,
	"completions" integer DEFAULT 0,
	"passing_attempts" integer DEFAULT 0,
	"passing_yards" integer DEFAULT 0,
	"passing_tds" integer DEFAULT 0,
	"interceptions" integer DEFAULT 0,
	"sacks" double precision DEFAULT 0,
	"sack_yards" integer DEFAULT 0,
	"sack_fumbles" integer DEFAULT 0,
	"sack_fumbles_lost" integer DEFAULT 0,
	"passing_air_yards" integer DEFAULT 0,
	"passing_yards_after_catch" integer DEFAULT 0,
	"passing_first_downs" integer DEFAULT 0,
	"passing_epa" double precision DEFAULT 0,
	"passing_2_pt_conversions" integer DEFAULT 0,
	"carries" integer DEFAULT 0,
	"rushing_yards" integer DEFAULT 0,
	"rushing_tds" integer DEFAULT 0,
	"rushing_fumbles" integer DEFAULT 0,
	"rushing_fumbles_lost" integer DEFAULT 0,
	"rushing_first_downs" integer DEFAULT 0,
	"rushing_epa" double precision DEFAULT 0,
	"rushing_2_pt_conversions" integer DEFAULT 0,
	"receptions" integer DEFAULT 0,
	"targets" integer DEFAULT 0,
	"receiving_yards" integer DEFAULT 0,
	"receiving_tds" integer DEFAULT 0,
	"receiving_fumbles" integer DEFAULT 0,
	"receiving_fumbles_lost" integer DEFAULT 0,
	"receiving_air_yards" integer DEFAULT 0,
	"receiving_yards_after_catch" integer DEFAULT 0,
	"receiving_first_downs" integer DEFAULT 0,
	"receiving_2_pt_conversions" integer DEFAULT 0,
	"special_teams_tds" integer DEFAULT 0,
	"fantasy_points" double precision DEFAULT 0,
	"fantasy_points_ppr" double precision DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(30),
	"display_name" varchar(48),
	"position" "position",
	"headshot_url" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(80),
	"abbr" varchar(80),
	"conference" varchar(32),
	"division" varchar(32),
	"color_1" varchar(16),
	"color_2" varchar(16),
	"color_3" varchar(16),
	"color_4" varchar(16),
	"logo_wikipedia" varchar(256),
	"logo_espn" varchar(256),
	"wordmark" varchar(256),
	"conference_logo" varchar(256),
	"league_logo" varchar(256)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "player_weeks_player_id_week_season_index" ON "player_weeks" ("player_id","week","season");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "league_invites" ADD CONSTRAINT "league_invites_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
