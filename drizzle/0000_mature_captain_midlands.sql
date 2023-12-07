CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"myData" varchar(256),
	"created_at" timestamp DEFAULT now(),
	"new" timestamp DEFAULT now()
);
