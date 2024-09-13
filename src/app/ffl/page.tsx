"use server";
import React from "react";
import { fetchLeagues } from "~/app/_actions";
import LeaguesTable from "~/app/_components/tables/LeaguesTable";

const Page = async () => {
  const leagues = await fetchLeagues();
  return (
    <div className="max-w-full">
      <div>
        <h1 className="p-2">My leagues</h1>
      </div>
      <div>
        <LeaguesTable leagues={leagues} />
      </div>
    </div>
  );
};

export default Page;
