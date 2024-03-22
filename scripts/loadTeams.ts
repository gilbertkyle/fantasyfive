import { z } from "zod";
import { db } from "~/server/db";
import fs from "fs";
import { teams } from "~/server/db/schema";

const teamSchema = z
  .object({
    team_abbr: z.string(),
    team_name: z.string(),
    team_id: z.number(),
    team_nick: z.string(),
    team_conf: z.string(),
    team_division: z.string(),
    team_color: z.string(),
    team_color2: z.string(),
    team_color3: z.string(),
    team_color4: z.string(),
    team_logo_wikipedia: z.string(),
    team_logo_espn: z.string(),
    team_wordmark: z.string(),
    team_conference_logo: z.string(),
    team_league_logo: z.string(),
    team_logo_squared: z.string(),
  })
  .transform((team) => ({
    abbr: team.team_abbr,
    name: team.team_name,
    id: team.team_id,
    nickname: team.team_nick,
    conference: team.team_conf,
    division: team.team_division,
    color1: team.team_color,
    color2: team.team_color2,
    color3: team.team_color3,
    color4: team.team_color4,
    logoWikipedia: team.team_logo_wikipedia,
    logoEspn: team.team_logo_espn,
    wordmark: team.team_wordmark,
    conferenceLogo: team.team_conference_logo,
    leagueLogo: team.team_league_logo,
    logoSquared: team.team_logo_squared,
  }));

const teamsSchema = z.array(teamSchema);

async function main() {
  const rawData = fs.readFileSync("scripts/data.json", "utf-8");

  const data = JSON.parse(rawData);
  const teamData = teamsSchema.safeParse(data);
  if (!teamData.success) console.log(teamData.error);
  if (teamData.success) await db.insert(teams).values(teamData.data).onConflictDoNothing();
}

await main();
