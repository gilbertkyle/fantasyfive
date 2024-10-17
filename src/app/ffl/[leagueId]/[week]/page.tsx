import React, { useState } from "react";
import { fetchLeagueWeek } from "~/app/_actions";
import WeekDetailTable from "~/app/_components/tables/WeekDetailTable";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

type Props = {
  params: {
    leagueId: string;
    week: string;
  };
};

const Page = async ({ params }: Props) => {
  const { leagueId, week } = params;
  const league = await fetchLeagueWeek({ leagueId: parseInt(leagueId), week: parseInt(week) });
  const teamOwners = league.teams.map((team) => team.ownerId!);
  const users = (
    await clerkClient.users.getUserList({
      userId: teamOwners,
      limit: 20,
    })
  ).map(filterUserForClient);

  //console.log("owners: ", teamOwners);
  console.log("users: ", users);
  return (
    <div>
      <WeekDetailTable league={league} week={parseInt(week)} leagueId={parseInt(leagueId)} users={users} />
    </div>
  );
};

export default Page;
