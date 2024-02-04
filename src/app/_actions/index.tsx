"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { leagues, leagueInvites, picks } from "~/server/db/schema";
import type { MyFormFields } from "~/app/_components/PostForm";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

export type UpdatePickProps = {
  id: number;
  qbInput: {
    id?: string;
  };
  rbInput: {
    id?: string;
  };
  wrInput: { id?: string };
  teInput: { id?: string };
};

export const fetchLeagues = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You probably shouldnt see this, but if you do, log in again.");

  const leagueData = await db.select().from(leagues).where(eq(leagues.ownerId, user.id));

  return leagueData;
};

export const inviteUser = async ({ inviteeId, leagueId }: { inviteeId: string; leagueId: number }) => {
  const [invite] = await db.insert(leagueInvites).values({ inviteeId, leagueId }).returning();
  return invite;
};

export const updatePick = async (pick: UpdatePickProps) => {
  console.log("jsdlkf: ", pick);
  const { qbInput, rbInput, wrInput, teInput } = pick;
  const values = {
    quarterbackId: qbInput?.id,
    runningBackId: rbInput?.id,
    wideReceiverId: wrInput?.id,
    tightEndId: teInput?.id,
  };
  // this line clears
  Object.keys(values).forEach((key) => (values[key] === undefined ? delete values[key] : {}));

  const response = await db.update(picks).set(values).where(eq(picks.id, pick.id));
  //revalidatePath("/ffl/[leagueId]", "page");
};
