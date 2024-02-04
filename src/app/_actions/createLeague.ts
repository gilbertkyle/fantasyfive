"use server";

import { revalidatePath } from "next/cache";
import type { createLeagueFields } from "~/app/_types/createLeagueFields";
import { db } from "~/server/db";
import {
  leagues,
  leagueMembers,
  fantasyTeams,
  picks,
} from "~/server/db/schema";
import { currentUser } from "@clerk/nextjs";
import { CURRENT_SEASON, SEASON_LENGTH_IN_WEEKS } from "~/settings";

export const createLeague = async (data: createLeagueFields) => {
  const user = await currentUser();
  if (!user) return;
  const leagueInsertData = { ...data, ownerId: user.id };

  // add user id to league data
  const [league] = await db
    .insert(leagues)
    .values(leagueInsertData)
    .returning();
  if (!league) throw new Error("league error, this shouldn't happen");

  // now create a new team, and make the current user the owner
  /* await db.insert(leagueMembers).values({
    leagueId: league.id,
    userId: user.id,
  }); */
  const fantasyTeamInsertData = {
    name: "default name",
    ownerId: user.id,
    leagueId: league.id,
  };
  const [team] = await db
    .insert(fantasyTeams)
    .values(fantasyTeamInsertData)
    .returning();
  if (!team) throw new Error("Team wasn't created. This shouldn't happen");
  // now create all of the picks for the team
  const weekData = [...Array(SEASON_LENGTH_IN_WEEKS).keys()].map((x) => ({
    week: x + 1,
    season: CURRENT_SEASON,
    fantasyTeamId: team.id,
  }));
  const [pickResponse] = await db.insert(picks).values(weekData).returning();
  revalidatePath("/create");
};
