"use server";
import React from "react";
import { fetchLeagues } from "~/server/actions";
import LeaguesTable from "~/app/_components/tables/LeaguesTable";

const Page = async () => {
  const leagues = await fetchLeagues();
  return (
    <div>
      <LeaguesTable leagues={leagues} />
    </div>
  );
};

export default Page;
