"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
//import type { League } from "~/server/db/types";
import Link from "next/link";
import type { fetchLeagues } from "~/app/_actions";

type League = Awaited<ReturnType<typeof fetchLeagues>>[number];

type Props = {
  leagues: League[];
};

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

const LeaguesTable = ({ leagues }: Props) => {
  const [colDefs, setColDefs] = useState([
    {
      field: "name",
      cellRenderer: (params: any) => {
        return <Link href={`ffl/${params.data.id.toString()}`}>{params.data.name}</Link>;
      },
    },

    { field: "owner.username", headerName: "Commissioner" },
  ]);
  const [rowData, setRowData] = useState(leagues);

  return (
    <div className="ag-theme-quartz h-72">
      <AgGridReact
        //@ts-expect-error: column defs are weird
        columnDefs={colDefs}
        rowData={rowData}
      />
    </div>
  );
};

export default LeaguesTable;
