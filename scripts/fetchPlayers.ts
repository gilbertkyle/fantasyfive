import { db } from "~/server/db";
import { playerWeeks, players } from "~/server/db/schema";
import { z } from "zod";
import { getCurrentWeek, CURRENT_SEASON } from "~/settings";
import { sql } from "drizzle-orm";
import { env } from "~/env";

const positions = ["QB", "RB", "WR", "TE", "DEF", "SS", "FB", "T", "CB", "OLB", "P"] as const;

const PlayerWeekDataSchema = z
  .object({
    player_id: z.string(),
    week: z.number(),
    season: z.number(),
    fantasy_points: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    completions: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    passing_attempts: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    passing_yards: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    passing_tds: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    interceptions: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    sacks: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    sack_yards: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    sack_fumbles: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    sack_fumbles_lost: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    passing_air_yards: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    passing_yards_after_catch: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    passing_first_downs: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    passing_epa: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    passing_2_pt_conversions: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    carries: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    rushing_yards: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    rushing_tds: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    rushing_fumbles: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    rushing_fumbles_lost: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    rushing_first_downs: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    rushing_epa: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    rushing_2_pt_conversions: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receptions: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    targets: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receiving_yards: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receiving_tds: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receiving_fumbles: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receiving_fumbles_lost: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receiving_air_yards: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receiving_yards_after_catch: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receiving_first_downs: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    receiving_2_pt_conversions: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    special_teams_tds: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
    fantasy_points_ppr: z
      .number()
      .nullish()
      .transform((value) => (typeof value === "number" ? value : 0)),
  })
  .transform((player) => ({
    week: player.week,
    season: player.season,
    playerId: player.player_id,
    fantasyPoints: player.fantasy_points,
    passingAttempts: player.passing_attempts,
    passingYds: player.passing_yards,
    passingTds: player.passing_tds,
    interceptions: player.interceptions,
    sacks: player.sacks,
    sackYards: player.sack_yards,
    sackFumbles: player.sack_fumbles,
    sackFumblesLost: player.sack_fumbles_lost,
    passingAirYards: player.passing_air_yards,
    passingYardsAfterCatch: player.passing_yards_after_catch,
    passingFirstDowns: player.passing_first_downs,
    passingEPA: player.passing_epa,
    passing2PtConversions: player.passing_2_pt_conversions,
    carries: player.carries,
    rushingYards: player.rushing_yards,
    rushingTds: player.rushing_tds,
    rushingFumbles: player.rushing_fumbles,
    rushingfumblesLost: player.rushing_fumbles_lost,
    rushingFirstDowns: player.rushing_first_downs,
    rushingEPA: player.rushing_epa,
    rushing2PtConversions: player.rushing_2_pt_conversions,
    receptions: player.receptions,
    targets: player.targets,
    receivingYards: player.receiving_yards,
    receivingTds: player.receiving_tds,
    receivingFumbles: player.receiving_fumbles,
    receivingFumblesLost: player.receiving_fumbles_lost,
    receivingAirYards: player.receiving_air_yards,
    receivingYardsAfterCatch: player.receiving_yards_after_catch,
    receivingFirstDowns: player.receiving_first_downs,
    receiving2PtConversions: player.receiving_2_pt_conversions,
    specialTeamsTds: player.special_teams_tds,
    fantasyPointsPPR: player.fantasy_points_ppr,
  }));

const PlayerDataSchema = z
  .object({
    player_id: z.string(),
    player_name: z.string(),
    player_display_name: z.string().optional(),
    position: z.enum(positions),
    recent_team: z.string().optional(),
  })
  .transform((player) => ({
    id: player.player_id,
    name: player.player_name,
    displayName: player.player_display_name,
    position: player.position,
    headshotUrl: "",
  }));

const PlayersDataSchema = z.array(PlayerDataSchema);

const PlayerWeeksDataSchema = z.array(PlayerWeekDataSchema);

async function main() {
  const args = process.argv.slice(2); // gets arguments passed through CLI

  const week = args[0] ?? getCurrentWeek().toString();
  const season = args[1] ?? CURRENT_SEASON.toString();
  const body = JSON.stringify({ week, season });

  const dataUrl = env.FETCH_PLAYERS_URL;

  console.log("body: ", body);

  const response = await fetch(dataUrl, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: unknown = await response.json();

  console.log("data: ", data);

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

  console.log("player: ", playerWeekData[0]);
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
