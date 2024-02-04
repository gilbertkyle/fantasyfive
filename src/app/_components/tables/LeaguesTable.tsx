"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { League } from "~/server/db/types";
import Link from "next/link";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

const LeaguesTable = ({ leagues }: { leagues: League[] }) => {
  const [colDefs, setColDefs] = useState([
    {
      field: "name",
      cellRenderer: (params) => {
        return (
          <Link href={`ffl/${params.data.id.toString()}`}>
            {params.data.name}
          </Link>
        );
      },
    },
    { field: "id" },
    { field: "ownerId" },
  ]);
  const [rowData, setRowData] = useState(leagues);

  return (
    <div className="ag-theme-quartz" style={{ height: "500px" }}>
      <AgGridReact columnDefs={colDefs} rowData={rowData} />
    </div>
  );
};

export default LeaguesTable;
