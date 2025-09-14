"use server";

import { db } from "~/server/db";
import { fantasyTeams, picks } from "~/server/db/schema";
import { config } from "dotenv";
import { CURRENT_SEASON, SEASON_LENGTH_IN_WEEKS } from "~/settings";

async function main() {
  config();
  const teams = await db.select().from(fantasyTeams);
  //const pickData = []
  const pickData = teams.map((team) => {
    return [...Array(SEASON_LENGTH_IN_WEEKS + 1).keys()].map((week) => {
      return {
        week,
        season: CURRENT_SEASON,
        fantasyTeamId: team.id,
      };
    });
  });
  //console.log(pickData);
  await Promise.all(
    pickData.map(async (data) => {
      await db.insert(picks).values(data);
    }),
  );

  //const newPicks = await db.insert(picks).values(pickData)
}

await main();
