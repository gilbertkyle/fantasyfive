CREATE TABLE IF NOT EXISTS "defenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" varchar(64),
	"week" integer NOT NULL,
	"season" integer NOT NULL,
	"fantasy_points" real DEFAULT 0
);
