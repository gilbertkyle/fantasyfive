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
  boolean,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const positionEnum = pgEnum("position", ["QB", "RB", "WR", "TE", "DEF", "FB", "T", "SS", "OLB", "CB", "P"]);

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  isPublic: boolean("is_public").default(false),
  ownerId: varchar("owner_id", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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
  quarterbackId: integer("quarterback_id"),
  qbPoints: real("qb_points").default(0.0),
  runningBackId: integer("running_back_id"),
  rbPoints: real("rb_points").default(0.0),
  wideReceiverId: integer("wide_receiver_id"),
  wrPoints: real("wr_points").default(0.0),
  tightEndId: integer("tight_end_id"),
  tePoints: real("te_points").default(0.0),
  defenseId: integer("defense_id"),
  defensePoints: real("defense_points").default(0.0),
});

export const leagueRelations = relations(leagues, ({ many }) => ({
  teams: many(fantasyTeams),
}));

export const fantasyTeamRelations = relations(fantasyTeams, ({ one, many }) => ({
  league: one(leagues, {
    fields: [fantasyTeams.leagueId],
    references: [leagues.id],
  }),
  picks: many(picks),
}));

export const teams = pgTable("teams", {
  // table for the team, NOT for the defense week
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }),
  abbr: varchar("abbr", { length: 80 }),
  conference: varchar("conference", { length: 32 }),
  division: varchar("division", { length: 32 }),
  color1: varchar("color_1", { length: 16 }),
  color2: varchar("color_2", { length: 16 }),
  color3: varchar("color_3", { length: 16 }),
  color4: varchar("color_4", { length: 16 }),
  logoWikipedia: varchar("logo_wikipedia", { length: 256 }),
  logoEspn: varchar("logo_espn", { length: 256 }),
  wordmark: varchar("wordmark", { length: 256 }),
  conferenceLogo: varchar("conference_logo", { length: 256 }),
  leagueLogo: varchar("league_logo", { length: 256 }),
  //logoSquared: varchar("logo_squared", { length: 256 }),
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
    passingAttempts: integer("passing_attempts").default(0),
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
    passingEPA: doublePrecision("passing_epa").default(0.0),
    passing2PtConversions: integer("passing_2_pt_conversions").default(0),

    carries: integer("carries").default(0),
    rushingYards: integer("rushing_yards").default(0),
    rushingTds: integer("rushing_tds").default(0),
    rushingFumbles: integer("rushing_fumbles").default(0),
    rushingFumblesLost: integer("rushing_fumbles_lost").default(0),
    rushingFirstDowns: integer("rushing_first_downs").default(0),
    rushingEPA: doublePrecision("rushing_epa").default(0),
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
    fantasyPointsPPR: doublePrecision("fantasy_points_ppr").default(0.0),
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
    relationName: "player",
  }),
  //picks: many(picks, { relationName: "picks" }),
}));

export const leagueInvites = pgTable("league_invites", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").references(() => leagues.id),
  inviteeId: varchar("invitee_id", { length: 256 }),
});

export const pickRelations = relations(picks, ({ one }) => ({
  quarterback: one(playerWeeks, {
    fields: [picks.quarterbackId],
    references: [playerWeeks.id],
    relationName: "quarterback_pick",
  }),
  runningBack: one(playerWeeks, {
    fields: [picks.runningBackId],
    references: [playerWeeks.id],
    relationName: "running_back_pick",
  }),
  wideReceiver: one(playerWeeks, {
    fields: [picks.wideReceiverId],
    references: [playerWeeks.id],
    relationName: "wide_receiver_pick",
  }),
  tightEnd: one(playerWeeks, {
    fields: [picks.tightEndId],
    references: [playerWeeks.id],
    relationName: "tight_end_pick",
  }),
  defense: one(defenses, {
    fields: [picks.defenseId],
    references: [defenses.teamId],
    relationName: "defense_pick",
  }),
  fantasyTeam: one(fantasyTeams, {
    fields: [picks.fantasyTeamId],
    references: [fantasyTeams.id],
    relationName: "fantasy_team",
  }),
}));

export const defenses = pgTable(
  "defenses",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id"),
    week: integer("week").notNull(),
    season: integer("season").notNull(),
    fantasyPoints: real("fantasy_points").default(0.0),
    sacks: real("sacks").default(0.0),
    interceptions: integer("interceptions").default(0),
    fumblesRecovered: integer("fumbles_recovered").default(0),
    fumblesForced: integer("fumbles_forced").default(0),
    defenseTds: integer("defense_tds").default(0),
    safeties: integer("safeties").default(0),
    specialTeamsTds: integer("special_teams_tds").default(0),
  },
  (table) => ({
    unq: uniqueIndex().on(table.teamId, table.week, table.season),
  }),
);

export const defenseRelations = relations(defenses, ({ one }) => ({
  team: one(teams, {
    fields: [defenses.teamId],
    references: [teams.id],
  }),
}));

export const teamRelations = relations(teams, ({ many }) => ({
  weeks: many(defenses),
}));

export const leagueRequests = pgTable(
  "league_requests",
  {
    id: serial("id").primaryKey(),
    leagueId: integer("league_id"),
    from: varchar("from", { length: 256 }),
  },
  (table) => ({
    unq: uniqueIndex().on(table.leagueId, table.from),
  }),
);

export const leagueRequestRelations = relations(leagueRequests, ({ one }) => ({
  league: one(leagues, {
    fields: [leagueRequests.leagueId],
    references: [leagues.id],
  }),
}));
