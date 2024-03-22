import type { InferSelectModel } from "drizzle-orm";
import type { leagues, fantasyTeams, picks, players } from "./schema";

export type FantasyTeam = InferSelectModel<typeof fantasyTeams>;
export type Pick = InferSelectModel<typeof picks>;

export type FantasyTeamDetail = FantasyTeam & {
  picks: Pick[];
};
export type Player = InferSelectModel<typeof players>;

export type League = InferSelectModel<typeof leagues> & {
  teams: FantasyTeam[];
  owner: {
    id: number,
    username: string,
    imageUrl: string,
    externalUsername: string
  }
};
