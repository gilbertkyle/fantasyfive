import { z } from "zod";

export const createLeagueSchema = z.object({
  name: z.string(),
});
