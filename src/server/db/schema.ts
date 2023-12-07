// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

//import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  myData: varchar("myData", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow(),
});

/* export const mysqlTable = mysqlTableCreator((name) => `fantasyfive-t3_${name}`);

export const posts = mysqlTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);
 */
