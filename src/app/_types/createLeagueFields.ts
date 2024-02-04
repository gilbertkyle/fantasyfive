import type { z } from "zod";
import type { createLeagueSchema } from "~/app/_schemata/createLeagueSchema";

export type createLeagueFields = z.infer<typeof createLeagueSchema>;
