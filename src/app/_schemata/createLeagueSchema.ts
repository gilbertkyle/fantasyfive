import { z } from "zod";

export const createLeagueSchema = z.object({
  name: z.string().min(5, { message: "League name must be at least 5 characters" }),
  isPublic: z.boolean(),
});
