"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { leagueInvites, picks } from "~/server/db/schema";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { action } from "~/lib/safe-action";
import { z } from "zod";
import { getCurrentWeek } from "~/settings";

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
  return myLeagues;
};

const InviteUserSchema = z.object({
  inviteeId: z.string(),
  leagueId: z.number(),
});

export const inviteUser = action(InviteUserSchema, async (invite) => {
  const [newInvite] = await db.insert(leagueInvites).values(invite).returning();
  return newInvite;
});

const updatePickSchema = z.object({
  id: z.number(),
  qbInput: z.object({ id: z.string() }).optional(),
  rbInput: z.object({ id: z.string() }).optional(),
  wrInput: z.object({ id: z.string() }).optional(),
  teInput: z.object({ id: z.string() }).optional(),
});

export const updatePick = action(updatePickSchema, async (pick) => {
  const { qbInput, rbInput, wrInput, teInput } = pick;
  const values = {
    quarterbackId: qbInput?.id,
    runningBackId: rbInput?.id,
    wideReceiverId: wrInput?.id,
    tightEndId: teInput?.id,
  };
  // this line clears undefined values
  // @ts-expect-error: typescript isn't smart enough to realize this won't error
  Object.keys(values).forEach((key) => (values[key] === undefined ? delete values[key] : {}));

  const [updatedPick] = await db.update(picks).set(values).where(eq(picks.id, pick.id)).returning();
  revalidatePath("/ffl/[leagueId]", "page");
});

export const fetchACPlayers = async () => {
  const players = await db.query.players.findMany();
  return players;
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
              tightEnd: true,
            },
          },
        },
      },
    },
  });
  return league;
};
