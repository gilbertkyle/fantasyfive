"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "~/context/ThemeContext";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "ag-grid-enterprise";
import type { fetchLeagueWeek } from "~/app/_actions";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";

type FilteredUser = ReturnType<typeof filterUserForClient>;
type League = Awaited<ReturnType<typeof fetchLeagueWeek>>;

type Props = {
  league: League;
  week: number;
  leagueId: number;
  users: FilteredUser[];
};

const WeekDetailTable = ({ league, week, leagueId, users }: Props) => {
  const { theme } = useTheme();

  const picks = league.teams.map((team) => {
    return team.picks.find((pick) => pick.week === week);
  });

  const [rowData, setRowData] = useState(picks);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Quarterback",
      children: [
        {
          headerName: "Name",
          colId: "qbName",
          cellRenderer: (cell: any) => cell.data.quarterback?.player?.name,
        },
        {
          field: "points",
          valueGetter: (params: any) => params.data.quarterback?.fantasyPoints.toFixed(2) ?? 0.0,
        },
      ],
    },
    {
      headerName: "Running Back",
      children: [
        {
          headerName: "Name",
          colId: "qbName",
          cellRenderer: (cell: any) => cell.data.runningBack?.player?.name,
        },
        {
          field: "points",
          valueGetter: (params: any) => params.data.runningBack?.fantasyPoints.toFixed(2) ?? 0.0,
        },
      ],
    },
    {
      headerName: "Wide Receiver",
      children: [
        {
          headerName: "Name",
          colId: "qbName",
          cellRenderer: (cell: any) => cell.data.wideReceiver?.player?.name,
        },
        {
          field: "points",
          valueGetter: (params: any) => params.data.wideReceiver?.fantasyPoints.toFixed(2) ?? 0.0,
        },
      ],
    },
    {
      headerName: "Tight End",
      children: [
        {
          headerName: "Name",
          colId: "qbName",
          cellRenderer: (cell: any) => cell.data.tightEnd?.player?.name,
        },
        {
          field: "points",
          valueGetter: (params: any) => params.data.tightEnd?.fantasyPoints.toFixed(2) ?? 0.0,
        },
      ],
    },
    {
      headerName: "Defense",
      children: [
        {
          headerName: "Team",
          colId: "team",
          cellRenderer: (cell: any) => cell.data.defense?.team?.abbr,
        },
        {
          field: "points",
          valueGetter: (params: any) => params.data.defense?.fantasyPoints.toFixed(2) ?? 0.0,
        },
      ],
    },
  ]);
  return (
    <div className={`${theme === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"} h-screen`}>
      <AgGridReact columnDefs={columnDefs} rowData={rowData} />
    </div>
  );
};

export default WeekDetailTable;
