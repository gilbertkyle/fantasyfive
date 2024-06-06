"use client";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "ag-grid-enterprise";

import type { fetchPlayers } from "~/app/_actions";

type Player = Awaited<ReturnType<typeof fetchPlayers>>;

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";

const PlayersTable = ({ players }: { players: Player[] }) => {
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "name",
    },
    {
      field: "position",
    },
    {
      field: "fantasyPoints",
    },
  ]);

  return (
    <div className="ag-theme-quartz h-screen">
      <AgGridReact></AgGridReact>
    </div>
  );
};

export default PlayersTable;
