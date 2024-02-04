// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

//import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  timestamp,
  integer,
  doublePrecision,
  real,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const positionEnum = pgEnum("position", [
  "QB",
  "RB",
  "WR",
  "TE",
  "DEF",
  "FB",
  "T",
  "SS",
  "OLB",
  "CB",
]);

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  ownerId: varchar("owner_id", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leagueMembers = pgTable("league_members", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  leagueId: integer("league_id").notNull(),
});

export const fantasyTeams = pgTable("fantasy_teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  ownerId: varchar("owner_id", { length: 256 }),
  leagueId: integer("league_id"),
});

export const picks = pgTable("picks", {
  id: serial("id").primaryKey(),
  season: integer("season").notNull(),
  week: integer("week").notNull(),
  fantasyTeamId: integer("fantasy_team_id").notNull(),
  quarterbackId: varchar("quarterback_id", { length: 64 }),
  qbPoints: real("qb_points").default(0.0),
  runningBackId: varchar("running_back_id", { length: 64 }),
  rbPoints: real("rb_points").default(0.0),
  wideReceiverId: varchar("wide_receiver_id", { length: 64 }),
  wrPoints: real("wr_points").default(0.0),
  tightEndId: varchar("tight_end_id", { length: 64 }),
  tePoints: real("te_points").default(0.0),
  defenseId: varchar("defense_id", { length: 64 }),
  defensePoints: real("defense_points").default(0.0),
});

export const leagueRelations = relations(leagues, ({ many }) => ({
  teams: many(fantasyTeams),
}));

export const fantasyTeamRelations = relations(
  fantasyTeams,
  ({ one, many }) => ({
    league: one(leagues, {
      fields: [fantasyTeams.leagueId],
      references: [leagues.id],
    }),
    picks: many(picks),
  }),
);

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }),
  abbr: varchar("abbr", { length: 80 }),
  color_1: varchar("color_1", { length: 16 }),
  color_2: varchar("color_2", { length: 16 }),
  color_3: varchar("color_3", { length: 16 }),
  color_4: varchar("color_4", { length: 16 }),
  logoUrl: varchar("logo_url"),
});

export const players = pgTable("players", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 30 }),
  displayName: varchar("display_name", { length: 48 }),
  position: positionEnum("position"),
  headshotUrl: varchar("headshot_url", { length: 256 }),
});

export const playerWeeks = pgTable(
  "player_weeks",
  {
    /*
    excluded fields from nfl_data_py are:
    dakota,
    pacr,
    racr
  */
    id: serial("id").primaryKey(),
    playerId: varchar("player_id", { length: 64 }),
    season: integer("season").notNull(),
    week: integer("week").notNull(),
    completions: integer("completions").default(0),
    attempts: integer("attempts").default(0),
    passingYards: integer("passing_yards").default(0),
    passingTds: integer("passing_tds").default(0),
    interceptions: integer("interceptions").default(0),
    sacks: doublePrecision("sacks").default(0.0),
    sackYards: integer("sack_yards").default(0),
    sackFumbles: integer("sack_fumbles").default(0),
    sackFumblesLost: integer("sack_fumbles_lost").default(0),
    passingAirYards: integer("passing_air_yards").default(0),
    passingYardsAfterCatch: integer("passing_yards_after_catch").default(0),
    passingFirstDowns: integer("passing_first_downs").default(0),
    passingEPA: doublePrecision("passing_EPA").default(0.0),
    passing2PtConversions: integer("passing_2_pt_conversions").default(0),

    carries: integer("carries").default(0),
    rushingYards: integer("rushing_yards").default(0),
    rushingTds: integer("rushing_tds").default(0),
    rushingFumbles: integer("rushing_fumbles").default(0),
    rushingFumblesLost: integer("rushing_fumbles_lost").default(0),
    rushingFirstDowns: integer("rushing_first_downs").default(0),
    rushingEPA: integer("rushing_EPA").default(0),
    rushing2PtConversions: integer("rushing_2_pt_conversions").default(0),
    receptions: integer("receptions").default(0),
    targets: integer("targets").default(0),
    receivingYards: integer("receiving_yards").default(0),
    receivingTds: integer("receiving_tds").default(0),
    receivingFumbles: integer("receiving_fumbles").default(0),
    receivingFumblesLost: integer("receiving_fumbles_lost").default(0),
    receivingAirYards: integer("receiving_air_yards").default(0),
    receivingYardsAfterCatch: integer("receiving_yards_after_catch").default(0),
    receivingFirstDowns: integer("receiving_first_downs").default(0),
    receiving2PtConversions: integer("receiving_2_pt_conversions").default(0),
    specialTeamsTds: integer("special_teams_tds").default(0),
    fantasyPoints: doublePrecision("fantasy_points").default(0.0),
    fantasyPointsPPR: integer("fantasy_points_ppr").default(0.0),
  },
  (table) => ({
    unq: uniqueIndex().on(table.playerId, table.week, table.season),
  }),
);

export const playerRelations = relations(players, ({ many }) => ({
  weeks: many(playerWeeks),
}));

export const playerWeekRelations = relations(playerWeeks, ({ one, many }) => ({
  player: one(players, {
    fields: [playerWeeks.playerId],
    references: [players.id],
  }),
  picks: many(picks),
}));

export const leagueInvites = pgTable("league_invites", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").references(() => leagues.id),
  inviteeId: varchar("invitee_id", { length: 256 }),
});

export const pickRelations = relations(picks, ({ one }) => ({
  quarterback: one(playerWeeks, {
    fields: [picks.quarterbackId],
    references: [playerWeeks.playerId],
  }),
  runningBack: one(playerWeeks, {
    fields: [picks.runningBackId],
    references: [playerWeeks.playerId],
  }),
  wideReceiver: one(playerWeeks, {
    fields: [picks.wideReceiverId],
    references: [playerWeeks.playerId],
  }),
  tightEnd: one(playerWeeks, {
    fields: [picks.tightEndId],
    references: [playerWeeks.playerId],
  }),
  defense: one(defenses, {
    fields: [picks.defenseId],
    references: [defenses.id],
  }),
  fantasyTeam: one(fantasyTeams, {
    fields: [picks.fantasyTeamId],
    references: [fantasyTeams.id],
  }),
}));

export const defenses = pgTable("defenses", {
  id: serial("id").primaryKey(),
  teamId: varchar("team_id", { length: 64 }),
  week: integer("week").notNull(),
  season: integer("season").notNull(),
  fantasyPoints: real("fantasy_points").default(0.0),
});

export const defenseRelations = relations(defenses, ({ one }) => ({
  team: one(teams, {
    fields: [defenses.teamId],
    references: [teams.id],
  }),
}));

export const teamRelations = relations(teams, ({ many }) => ({
  weeks: many(defenses),
}));
