import { db } from "~/server/db";
import { playerWeeks, defenses } from "~/server/db/schema";

export const getOrCreateWeek = async (playerId: string, week: number, season: number) => {
  let playerWeek = await db.query.playerWeeks.findFirst({
    columns: {
      id: true,
    },
    where: (playerWeek, { and, eq }) =>
      and(eq(playerWeek.week, week), eq(playerWeek.season, season), eq(playerWeek.playerId, playerId)),
  });
  if (!playerWeek && playerId) {
    console.log("hey");
    [playerWeek] = await db
      .insert(playerWeeks)
      .values({
        week,
        season,
        playerId: playerId,
      })
      .returning({
        id: playerWeeks.id,
      });
  }
  return playerWeek;
};

export const getOrCreateDefenseWeek = async (teamId: number, week: number, season: number) => {
  let defenseWeek = await db.query.defenses.findFirst({
    columns: {
      id: true,
    },
    where: (defenseWeek, { and, eq }) =>
      and(eq(defenseWeek.id, teamId), eq(defenseWeek.week, week), eq(defenseWeek.season, season)),
  });
  if (!defenseWeek && teamId) {
    [defenseWeek] = await db
      .insert(defenses)
      .values({
        week,
        season,
        teamId,
      })
      .returning({
        id: playerWeeks.id,
      });
  }
  return defenseWeek;
};
