"use client";

import React from "react";
import exportFromJSON from "export-from-json";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { fetchLeagueWeek, mergePickAndUserData } from "../_actions";

type FilteredUser = ReturnType<typeof filterUserForClient>;
type League = Awaited<ReturnType<typeof fetchLeagueWeek>>;
type Picks = Awaited<ReturnType<typeof mergePickAndUserData>>;

const ExportCSVButton = ({ picks }: { picks: Picks }) => {
  console.log(Array.isArray(picks));
  // const data = picks.map((pick) => ({
  //   user: pick.user?.name,
  //   quarterback: pick.quarterback?.player?.name,
  //   quarterbackPoints: pick.quarterback?.fantasyPoints,
  //   runningBack: pick.runningBack?.player?.name,
  //   runningBackPoints: pick.runningBack?.fantasyPoints,
  //   wideReceiver: pick.wideReceiver?.player?.name,
  //   wideReceiverPoints: pick.wideReceiver?.fantasyPoints,
  //   tightEnd: pick.tightEnd?.player?.name,
  //   tightEndPoints: pick.tightEnd?.fantasyPoints,
  //   defense: pick.defense?.team?.name,
  //   defensePoints: pick.defense?.fantasyPoints,
  // }));
  const handleClick = () => {
    const fileName = "player_data";
    const exportType = exportFromJSON.types.csv;
    //exportFromJSON({ data, fileName, exportType });
  };

  return <button onClick={handleClick}>Export CSV</button>;
};

export default ExportCSVButton;
