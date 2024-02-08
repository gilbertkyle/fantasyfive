import { db } from "~/server/db";
import { playerWeeks, players } from "~/server/db/schema";
import { z } from "zod";
import { getCurrentWeek, CURRENT_SEASON } from "~/settings";
import { sql } from "drizzle-orm";

const positions = ["QB", "RB", "WR", "TE", "DEF", "SS", "FB", "T", "CB", "OLB"] as const;

const PlayerWeekDataSchema = z
  .object({
    player_id: z.string(),
    week: z.number(),
    season: z.number(),
    fantasy_points: z.number(),
  })
  .transform((player) => ({
    playerId: player.player_id,
    week: player.week,
    season: player.season,
    fantasyPoints: player.fantasy_points,
  }));

const PlayerDataSchema = z
  .object({
    player_id: z.string(),
    player_name: z.string(),
    week: z.number(),
    position: z.enum(positions),
    recent_team: z.string(),
    fantasy_points: z.number(),
    sacks: z.number(),
    sack_fumbles_lost: z.number(),
    interceptions: z.number(),
    special_teams_tds: z.number(),
  })
  .transform((player) => {
    return {
      id: player.player_id,
      name: player.player_name,
      display_name: player.player_name,
      position: player.position,
      headshotUrl: "",
    };
  });

const PlayersDataSchema = z.array(PlayerDataSchema);

const PlayerWeeksDataSchema = z.array(PlayerWeekDataSchema);

async function main() {
  const args = process.argv.slice(2); // gets arguments passed through CLI

  const week = args[0] ?? getCurrentWeek().toString();
  const season = args[0] ?? CURRENT_SEASON;
  const body = JSON.stringify({ week, season });

  const dataUrl = new URL("https://a7s7t3qyilx6x4poez4yyefk4y0dxmln.lambda-url.us-west-1.on.aws/");
  dataUrl.searchParams.set("week", week);
  const response = await fetch(dataUrl, {
    method: "POST",
    body: body,
  });
  const data: unknown = await response.json();
  const parsedPlayerData = PlayersDataSchema.safeParse(data);
  const parsedPlayerWeekData = PlayerWeeksDataSchema.safeParse(data);

  if (!parsedPlayerWeekData.success) {
    console.log("error", parsedPlayerWeekData.error);
    return;
  }

  if (!parsedPlayerData.success) {
    console.log("error: ", parsedPlayerData.error);
    return;
  }
  const playerWeekData = parsedPlayerWeekData.data;
  const playerData = parsedPlayerData.data;

  console.log("player: ", playerWeekData);
  // insert players into player table
  await db.insert(players).values(playerData).onConflictDoNothing();

  // insert player weeks into playerweek table
  //await db.insert(playerWeeks).values(playerWeekData);
  await db
    .insert(playerWeeks)
    .values(playerWeekData)
    .onConflictDoUpdate({
      target: [playerWeeks.season, playerWeeks.week, playerWeeks.playerId],
      set: { fantasyPoints: sql`excluded.fantasy_points` },
    });
}

if (true) {
  await main();
}
