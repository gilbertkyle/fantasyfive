"use server";

import { db } from "~/server/db";
import { currentUser } from "@clerk/nextjs";
import { getCurrentWeek } from "~/settings";

export const fetchPlayers = async () => {
  const players = await db.query.players.findMany({
    with: {
      weeks: true,
    },
  });
  return players;
};
