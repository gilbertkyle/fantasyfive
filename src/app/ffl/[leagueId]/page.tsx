import React from "react";
import { fetchACPlayers, fetchLeagueDetail, fetchLeagueRequests, fetchACTeams } from "~/app/_actions";
import LeagueDetailTable from "~/app/_components/tables/LeagueDetailTable";
import { currentUser } from "@clerk/nextjs";

type Props = {
  params: {
    leagueId: string;
  };
};

const page = async ({ params }: Props) => {
  const { leagueId } = params;
  const league = await fetchLeagueDetail(parseInt(leagueId));
  const players = await fetchACPlayers();
  const user = await currentUser();
  const requests = await fetchLeagueRequests(league.id);
  const teams = await fetchACTeams();
  if (!user) throw new Error("you should be logged in");
  return (
    <div>
      <LeagueDetailTable league={league} players={players} userId={user.id} teams={teams} />
    </div>
  );
};

export default page;
