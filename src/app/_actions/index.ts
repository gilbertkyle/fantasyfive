"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { fantasyTeams, leagueInvites, leagueRequests, picks, playerWeeks, players, leagues } from "~/server/db/schema";
import { currentUser } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";
import { actionClient } from "~/lib/safe-action";
import { z } from "zod";
import { getCurrentWeek } from "~/settings";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { NeonDbError } from "@neondatabase/serverless";
import { inviteUserSchema } from "../_schemata/invitePlayerSchema";

export const fetchLeagues = async () => {
  const user = await currentUser();
  if (!user) return [];
  const everyLeague = await db.query.leagues.findMany({
    with: {
      teams: true,
    },
  });

  const myLeagues = everyLeague.filter((league) => {
    const userIds = league.teams.map((owner) => owner.ownerId);
    return userIds.includes(user.id);
  });
  const ownerIds = myLeagues.map((league) => league.ownerId);
  const users = (
    await clerkClient.users.getUserList({
      userId: ownerIds,
      limit: 100,
    })
  ).map(filterUserForClient);
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
};

const InviteUserSchema = z.object({
  userId: z.string(),
  leagueId: z.number(),
});

export const inviteUser = actionClient.schema(inviteUserSchema).action(async ({ parsedInput: invite }) => {
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

export const updatePick = actionClient.schema(updatePickSchema).action(async ({ parsedInput: pick }) => {
  console.log("hello");
  const user = await currentUser();
  if (!user) throw new Error("you should be logged in");

  const { qbInput, rbInput, wrInput, teInput, defenseInput } = pick;
  const values = {
    quarterbackId: qbInput?.id,
    runningBackId: rbInput?.id,
    wideReceiverId: wrInput?.id,
    tightEndId: teInput?.id,
    defenseId: defenseInput?.id,
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
    if (myPick.quarterbackId === pick.qbInput?.id) {
      errors.push("Qb error");
    }
    if (myPick.runningBackId === pick.rbInput?.id) {
      errors.push("rb error");
    }
    if (myPick.wideReceiverId === pick.wrInput?.id) {
      errors.push("wr error");
    }
    if (myPick.tightEndId === pick.teInput?.id) {
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
  revalidatePath("/ffl/[leagueId]", "page");
});

export const fetchACPlayers = async () => {
  // function that grabs player data for the autocomplete in the pick table
  const players = await db.query.players.findMany();
  return players;
};

export const fetchACTeams = async () => {
  const teams = await db.query.teams.findMany();
  return teams;
};

export const fetchLeagueDetail = async (id: number) => {
  const league = await db.query.leagues.findFirst({
    where: (league, { eq }) => eq(league.id, id),
    with: {
      teams: {
        with: {
          picks: {
            where: (pick, { lte }) => lte(pick.week, getCurrentWeek()),
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
};

export const fetchPlayers = async () => {
  const players = await db.query.players.findMany({
    with: {
      weeks: true,
    },
  });
  return players;
};

export const fetchPlayerAggregates = async () => {
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
};

export const fetchUserList = async (emailPrefix: string) => {
  const users = await clerkClient.users.getUserList({
    query: emailPrefix,
  });

  return users.map((user) => {
    // this trick converts a class to an object
    return JSON.parse(JSON.stringify(user));
  });
};

export const insertLeagueRequest = async (leagueId: number) => {
  const user = await currentUser();
  if (!user) throw new Error("no user??????");
  const { id } = user;
  const data = {
    leagueId,
    from: id,
  };
  try {
    const result = await db.insert(leagueRequests).values(data).returning({ id: leagueRequests.id });
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
};

export const fetchPublicLeagues = async (name: string) => {
  return await db.query.leagues.findMany({
    columns: {
      id: true,
      name: true,
      isPublic: true,
    },
    where: (leagues, { ilike, and, eq }) => and(ilike(leagues.name, `%${name}%`), eq(leagues.isPublic, true)),
    limit: 5,
  });
};

export const fetchLeagueRequests = async (leagueId: number) => {
  const user = await currentUser();
  if (!user) return [];
  // fetch the league requests based on whether your are the commissioner
  return await db
    .select()
    .from(leagueRequests)
    .innerJoin(leagues, eq(leagues.id, leagueRequests.leagueId))
    .where(eq(leagues.ownerId, user.id));
};

export const fetchOutgoingRequests = async () => {
  const user = await currentUser();
  if (!user) return [];
  //return await db.select().from(leagueRequests).where(eq(leagueRequests.from, user.id));
  return await db.query.leagueRequests.findMany({
    where: (leagueRequests) => eq(leagueRequests.from, user.id),
    with: {
      league: true,
    },
  });
};

export const deleteOutgoingRequest = async (id: number) => {
  await db.delete(leagueRequests).where(eq(leagueRequests.id, id));
  await new Promise((resolve) => setTimeout(resolve, 700));
  revalidatePath("/profile");
  return;
};
