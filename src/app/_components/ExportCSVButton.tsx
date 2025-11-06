"use client";

import React from "react";
import exportFromJSON from "export-from-json";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { fetchLeagueWeek } from "../_actions";

type FilteredUser = ReturnType<typeof filterUserForClient>;
type League = Awaited<ReturnType<typeof fetchLeagueWeek>>;

type Props = {
  data: {
    user: string;
    quarterback: string | null;
    quarterbackPoints: number | null;
    runningBack: string | null;
    runningBackPoints: number;
    wideReceiver: string | null;
    wideReceiverPoints: number;
    tightEnd: string | null;
    tightEndPoints: number;
    defense: string | null;
    defensePoints: number;
  };
};

const ExportCSVButton = ({ data }: Props) => {
  console.log(data);
  const handleClick = () => {
    const fileName = "player_data";
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType });
  };

  return <button onClick={handleClick}>Export CSV</button>;
};

export default ExportCSVButton;
