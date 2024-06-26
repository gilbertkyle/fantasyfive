/* import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless"; */

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "~/env";
import * as schema from "./schema";

const isDevEnv = env.NODE_ENV === "development";

neonConfig.fetchConnectionCache = true;

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
