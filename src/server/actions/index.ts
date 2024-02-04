"use server";

import { db } from "~/server/db";
import { currentUser } from "@clerk/nextjs";
import { getCurrentWeek } from "~/settings";

export const fetchLeagues = async () => {
  const user = await currentUser();
  if (!user) return [];
  const everyLeague = await db.query.leagues.findMany({
    with: {
      teams: true,
      /* teams: {
        where: (teams, { eq }) => eq(teams.ownerId, user.id),
      }, */
    },
  });

  const myLeagues = everyLeague.filter((league) => {
    const userIds = league.teams.map((owner) => owner.ownerId);
    return userIds.includes(user.id);
  });
  return myLeagues;
};

export const fetchPlayers = async () => {
  const players = await db.query.players.findMany({
    with: {
      weeks: true,
    },
  });
  return players;
};

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
              quarterback: true,
              tightEnd: true,
            },
          },
        },
      },
    },
  });
  return league;
};
