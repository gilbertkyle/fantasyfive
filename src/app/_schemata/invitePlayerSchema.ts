import { z } from "zod";

export const inviteUserSchema = z.object({
  userId: z.string(),
  leagueId: z.number(),
});
