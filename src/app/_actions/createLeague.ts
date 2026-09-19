import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { db } from "~/server/db";
import { leagues, fantasyTeams, picks } from "~/server/db/schema";
import { CURRENT_SEASON, SEASON_LENGTH_IN_WEEKS } from "~/settings";
import { createLeagueSchema } from "~/app/_schemata/createLeagueSchema";

export const createLeague = createServerFn({ method: "POST" })
  .validator(createLeagueSchema)
  .handler(async ({ data }) => {
    const { userId } = await auth();
    if (!userId) return;
    const leagueInsertData = { ...data, ownerId: userId };

    // add user id to league data
    const [league] = await db.insert(leagues).values(leagueInsertData).returning();
    if (!league) throw new Error("league error, this shouldn't happen");

    const fantasyTeamInsertData = {
      name: "default name",
      ownerId: userId,
      leagueId: league.id,
    };
    const [team] = await db.insert(fantasyTeams).values(fantasyTeamInsertData).returning();
    if (!team) throw new Error("Team wasn't created. This shouldn't happen");
    // now create all of the picks for the team
    const weekData = [...Array(SEASON_LENGTH_IN_WEEKS).keys()].map((x) => ({
      week: x + 1,
      season: CURRENT_SEASON,
      fantasyTeamId: team.id,
    }));
    await db.insert(picks).values(weekData).returning();
    return league;
  });
