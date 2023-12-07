import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { env } from "./src/env.js";

import { neon } from "@neondatabase/serverless";

const main = async () => {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: "drizzle" });
};

await main();
