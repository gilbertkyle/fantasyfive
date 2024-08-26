"use server";
import React from "react";
import { fetchLeagues } from "~/app/_actions";
import LeaguesTable from "~/app/_components/tables/LeaguesTable";

const Page = async () => {
  const leagues = await fetchLeagues();
  return (
    <div className="max-w-full">
      <LeaguesTable leagues={leagues} />
    </div>
  );
};

export default Page;
