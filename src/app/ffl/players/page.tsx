import React from "react";
import { fetchPlayers } from "~/server/actions";

const page = async () => {
  const players = await fetchPlayers();
  return <div>{JSON.stringify(players, null, 2)}</div>;
};

export default page;
