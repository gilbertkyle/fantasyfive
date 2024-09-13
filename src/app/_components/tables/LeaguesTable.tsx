"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import type { fetchLeagues } from "~/app/_actions";
import { useTheme } from "~/context/ThemeContext";

type League = Awaited<ReturnType<typeof fetchLeagues>>[number];

type Props = {
  leagues: League[];
};

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";

const LeaguesTable = ({ leagues }: Props) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [colDefs, setColDefs] = useState([
    {
      field: "name",
      cellRenderer: (params: any) => {
        return <Link href={`ffl/${params.data.id.toString()}`}>{params.data.name}</Link>;
      },
    },

    //{ field: "owner.username", headerName: "Commissioner" },
  ]);
  const [rowData, setRowData] = useState(leagues);

  return (
    <div className={`h-72 w-72 transition-all ${isDarkMode ? "ag-theme-quartz-dark" : "ag-theme-quartz"}`}>
      <AgGridReact
        //@ts-expect-error: column defs are weird
        columnDefs={colDefs}
        rowData={rowData}
      />
    </div>
  );
};

export default LeaguesTable;
