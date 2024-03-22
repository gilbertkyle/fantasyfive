import React from "react";
import { fetchPlayers, fetchPlayerAggregates } from "~/app/_actions";

const page = async () => {
  const players = await fetchPlayerAggregates();
  console.log("players: ", players);
  return <div>{JSON.stringify(players, null, 2)}</div>;
};

export default page;
