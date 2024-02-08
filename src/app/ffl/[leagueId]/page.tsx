import React from "react";
import { fetchACPlayers, fetchLeagueDetail } from "~/app/_actions";
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
  if (!user) throw new Error("you should be logged in");
  if (!league) throw new Error("no league found somehow");
  return (
    <div>
      <LeagueDetailTable league={league} players={players} userId={user.id} />
    </div>
  );
};

export default page;
