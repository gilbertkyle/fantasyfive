import { createServerFn } from "@tanstack/react-start";
import { db } from "~/server/db";
import {
  leagueInvites,
  leagueRequests,
  picks,
  playerWeeks,
  players,
  leagues,
  defenses,
  fantasyTeams,
} from "~/server/db/schema";
import { auth, clerkClient } from "@clerk/tanstack-react-start/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getCurrentWeek } from "~/settings";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { NeonDbError } from "@neondatabase/serverless";
import { inviteUserSchema } from "../_schemata/invitePlayerSchema";
import { getOrCreateWeek, getOrCreateDefenseWeek } from "~/server/helpers/getOrCreateWeek";
import { CURRENT_SEASON, SEASON_LENGTH_IN_WEEKS } from "~/settings";

type FilteredUser = ReturnType<typeof filterUserForClient>;
type League = Awaited<ReturnType<typeof fetchLeagueWeek>>;

export const fetchLeagues = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await auth();
  if (!userId) return [];
  const everyLeague = await db.query.leagues.findMany({
    with: {
      teams: true,
    },
  });

  const myLeagues = everyLeague.filter((league) => {
    const userIds = league.teams.map((owner) => owner.ownerId);
    return userIds.includes(userId);
  });
  const ownerIds = myLeagues.map((league) => league.ownerId);
  const users = (
    await clerkClient().users.getUserList({
      userId: ownerIds,
      limit: 100,
    })
  ).data.map(filterUserForClient);
  return myLeagues.map((league) => {
    const owner = users.find((usr) => usr.id === league.ownerId);
    if (!owner) throw new Error("no owner????");
    if (!owner?.username) owner.username = owner?.externalUsername;
    return {
      ...league,
      owner: {
        ...owner,
        username: owner?.username ?? "No owner name found",
      },
    };
  });
});

export const inviteUser = createServerFn({ method: "POST" })
  .validator(inviteUserSchema)
  .handler(async ({ data: invite }) => {
    const [newInvite] = await db.insert(leagueInvites).values(invite).returning();
    return newInvite;
  });

const updatePickSchema = z.object({
  id: z.number(),
  qbInput: z.object({ id: z.string() }).optional().nullable(),
  rbInput: z.object({ id: z.string() }).optional().nullable(),
  wrInput: z.object({ id: z.string() }).optional().nullable(),
  teInput: z.object({ id: z.string() }).optional().nullable(),
  defenseInput: z.object({ id: z.number() }).optional().nullable(),
  fantasyTeamId: z.number(),
  season: z.number(),
  week: z.number(),
});

export const updatePick = createServerFn({ method: "POST" })
  .validator(updatePickSchema)
  .handler(async ({ data: pick }) => {
    const { qbInput, rbInput, wrInput, teInput, defenseInput, week, season } = pick;

    const quarterbackId = qbInput?.id ?? "";
    const runningBackId = rbInput?.id ?? "";
    const wideReceiverId = wrInput?.id ?? "";
    const tightEndId = teInput?.id ?? "";
    const defenseId = defenseInput?.id ?? 0;

    const quarterbackWeek = await getOrCreateWeek(quarterbackId, week, season);
    const runningBackWeek = await getOrCreateWeek(runningBackId, week, season);
    const wideReceiverWeek = await getOrCreateWeek(wideReceiverId, week, season);
    const tightEndWeek = await getOrCreateWeek(tightEndId, week, season);
    const defenseWeek = await getOrCreateDefenseWeek(defenseId, week, season);

    const values = {
      quarterbackId: quarterbackWeek?.id,
      runningBackId: runningBackWeek?.id,
      wideReceiverId: wideReceiverWeek?.id,
      tightEndId: tightEndWeek?.id,
      defenseId: defenseWeek?.id,
    };

    // this line clears undefined values
    // @ts-expect-error: typescript isn't smart enough to realize this won't error
    Object.keys(values).forEach((key) => (values[key] === undefined ? delete values[key] : {}));

    // now gotta check for duplicate picks
    const myTeam = await db.query.fantasyTeams.findFirst({
      columns: {},
      with: {
        picks: {
          where: (picks, { eq, ne, and }) => and(eq(picks.season, pick.season), ne(picks.week, pick.week)),
        },
      },
      where: (fantasyTeams, { eq }) => eq(fantasyTeams.id, pick.fantasyTeamId),
    });

    if (!myTeam) throw new Error("no team");

    const errors: string[] = [];
    const { picks: myPicks } = myTeam;

    myPicks.forEach((myPick) => {
      if (myPick.quarterbackId === values.quarterbackId) {
        errors.push("Qb error");
      }
      if (myPick.runningBackId === values.runningBackId) {
        errors.push("rb error");
      }
      if (myPick.wideReceiverId === values.wideReceiverId) {
        errors.push("wr error");
      }
      if (myPick.tightEndId === values.tightEndId) {
        errors.push("te error");
      }
    });

    if (errors.length) {
      console.log("errors: ", errors);
      return {
        error: JSON.stringify(errors),
      };
    }

    const [updatedPick] = await db.update(picks).set(values).where(eq(picks.id, pick.id)).returning();
    console.log("got here: ", updatedPick);
    return updatedPick;
  });

export const fetchACPlayers = createServerFn({ method: "GET" }).handler(async () => {
  // function that grabs player data for the autocomplete in the pick table
  const players = await db.query.players.findMany();
  return players;
});

export const fetchACTeams = createServerFn({ method: "GET" }).handler(async () => {
  // function that grabs defense data for the autocomplete in the pick table
  const teams = await db.query.teams.findMany();
  return teams;
});

export const fetchLeagueDetail = createServerFn({ method: "GET" })
  .validator(z.number())
  .handler(async ({ data: id }) => {
    const league = await db.query.leagues.findFirst({
      where: (league, { eq }) => eq(league.id, id),
      with: {
        teams: {
          with: {
            picks: {
              //where: (pick, { lte }) => lte(pick.week, getCurrentWeek() + 1),
              where: (pick, { eq }) => eq(pick.season, CURRENT_SEASON),
              with: {
                quarterback: {
                  with: {
                    player: true,
                  },
                },
                runningBack: {
                  with: {
                    player: true,
                  },
                },
                wideReceiver: {
                  with: {
                    player: true,
                  },
                },
                tightEnd: {
                  with: {
                    player: true,
                  },
                },
                defense: {
                  with: {
                    team: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!league) throw new Error("no league");
    return league;
  });

export const fetchLeagueWeek = createServerFn({ method: "GET" })
  .validator(z.object({ week: z.number(), leagueId: z.number() }))
  .handler(async ({ data: { week, leagueId } }) => {
    const league = await db.query.leagues.findFirst({
      where: (leagues, { eq }) => eq(leagues.id, leagueId),
      with: {
        teams: {
          with: {
            picks: {
              where: (picks, { eq, and }) => and(eq(picks.week, week), eq(picks.season, CURRENT_SEASON)),
              with: {
                quarterback: {
                  with: {
                    player: true,
                  },
                },
                runningBack: {
                  with: {
                    player: true,
                  },
                },
                wideReceiver: {
                  with: {
                    player: true,
                  },
                },
                tightEnd: {
                  with: {
                    player: true,
                  },
                },
                defense: {
                  with: {
                    team: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!league) throw new Error("Can't find league");
    return league;
  });

export const fetchPlayers = createServerFn({ method: "GET" }).handler(async () => {
  const players = await db.query.players.findMany({
    with: {
      weeks: true,
    },
  });
  return players;
});

export const fetchPlayerAggregates = createServerFn({ method: "GET" }).handler(async () => {
  /* function for fetching season long data for /ffl/players */
  const result = await db
    .select({
      playerId: players.id,
      name: players.name,
      position: players.position,
      fantasyPoints: sql<number>`sum(${playerWeeks.fantasyPoints})`,
    })
    .from(players)
    .groupBy(players.id)
    .innerJoin(playerWeeks, eq(players.id, playerWeeks.playerId));

  return result;
});

export const fetchUserList = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: emailPrefix }) => {
    const users = (
      await clerkClient().users.getUserList({
        query: emailPrefix,
      })
    ).data;

    return users.map((user) => {
      // this trick converts a class to an object
      return JSON.parse(JSON.stringify(user));
    });
  });

export const fetchUsersByIds = createServerFn({ method: "GET" })
  .validator(z.array(z.string()))
  .handler(async ({ data: userIds }) => {
    const users = (await clerkClient().users.getUserList({ userId: userIds, limit: 20 })).data;
    return users.map(filterUserForClient);
  });

export const insertLeagueRequest = createServerFn({ method: "POST" })
  .validator(z.number())
  .handler(async ({ data: leagueId }) => {
    const { userId } = await auth();
    if (!userId) throw new Error("no user??????");
    const data = {
      leagueId,
      from: userId,
    };
    try {
      await db.insert(leagueRequests).values(data).returning({ id: leagueRequests.id });
      const league = await db.query.leagues.findFirst({
        where: (leagues, { eq }) => eq(leagues.id, leagueId),
      });
      if (!league) throw new Error("db error");
      return league;
    } catch (error) {
      if (error instanceof NeonDbError) {
        return { error: "You have already requested to be in that league." };
      } else
        return {
          error: "unknown Error",
        };
    }
  });

export const fetchPublicLeagues = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: name }) => {
    return await db.query.leagues.findMany({
      columns: {
        id: true,
        name: true,
        isPublic: true,
      },
      where: (leagues, { ilike, and, eq }) => and(ilike(leagues.name, `%${name}%`), eq(leagues.isPublic, true)),
      limit: 5,
    });
  });

export const fetchLeagueRequests = createServerFn({ method: "GET" })
  .validator(z.number())
  .handler(async ({ data: leagueId }) => {
    const { userId } = await auth();
    if (!userId) return [];
    // fetch the league requests based on whether your are the commissioner
    return await db
      .select()
      .from(leagueRequests)
      .innerJoin(leagues, eq(leagues.id, leagueRequests.leagueId))
      .where(eq(leagues.ownerId, userId));
  });

export const addUserToLeague = createServerFn({ method: "POST" })
  .validator(z.object({ leagueId: z.number(), userId: z.string() }))
  .handler(async ({ data: { leagueId, userId } }) => {
    //create new team
    const fantasyTeamValues = {
      name: "default name",
      leagueId,
      ownerId: userId,
    };

    const [fantasyTeam] = await db.insert(fantasyTeams).values(fantasyTeamValues).returning();

    if (!fantasyTeam) throw new Error("fantasy team creation error");
    const weekData = [...Array(SEASON_LENGTH_IN_WEEKS).keys()].map((x) => ({
      week: x + 1,
      season: CURRENT_SEASON,
      fantasyTeamId: fantasyTeam.id,
    }));

    const [pickResponse] = await db.insert(picks).values(weekData).returning();
    if (!pickResponse) throw new Error("error in pick creation");
    console.log("pick response: ", pickResponse);
    //const result = await db.insert(leagues).values().where(eq(leagues.id, leagueId))
  });

export const fetchOutgoingRequests = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await auth();
  if (!userId) return [];
  return await db.query.leagueRequests.findMany({
    where: (leagueRequests) => eq(leagueRequests.from, userId),
    with: {
      league: true,
    },
  });
});

export const deleteOutgoingRequest = createServerFn({ method: "POST" })
  .validator(z.number())
  .handler(async ({ data: id }) => {
    await db.delete(leagueRequests).where(eq(leagueRequests.id, id));
    await new Promise((resolve) => setTimeout(resolve, 700));
    return;
  });

export const mergePickAndUserData = ({
  league,
  users,
  week,
}: {
  league: League;
  users: FilteredUser[];
  week: number;
}) => {
  const picks = league.teams.map((team) => {
    const { ownerId } = team;
    const pick = team.picks.find((pick) => pick.week === week);
    const user = users.find((u) => u.id === ownerId);
    return {
      user,
      ...pick,
    };
  });
  return picks;
};
