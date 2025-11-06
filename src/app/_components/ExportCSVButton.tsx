"use client";

import React from "react";
import exportFromJSON from "export-from-json";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { fetchLeagueWeek } from "../_actions";

type FilteredUser = ReturnType<typeof filterUserForClient>;
type League = Awaited<ReturnType<typeof fetchLeagueWeek>>;

type Props = {
  data: any;
};

const ExportCSVButton = ({ data }: Props) => {
  console.log(data);
  const handleClick = () => {
    const fileName = "test";
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType });
  };

  return <button onClick={handleClick}>Export CSV</button>;
};

export default ExportCSVButton;
