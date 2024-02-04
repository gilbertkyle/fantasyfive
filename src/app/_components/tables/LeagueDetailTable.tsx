"use client";

import React, { useState, useMemo, useRef } from "react";
import type { League, FantasyTeamDetail, Player } from "~/server/db/types";
import { AgGridReact } from "ag-grid-react";
import { useUser } from "@clerk/nextjs";
import { getCurrentWeek } from "~/settings";
import { updatePick } from "~/app/_actions";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "ag-grid-enterprise";

const LeagueDetailTable = ({ league, players, userId }: { league: League; players: Player[]; userId: string }) => {
  const gridRef = useRef();
  const week = getCurrentWeek();
  const { teams } = league;

  const myTeam = teams.find((team) => team.ownerId === userId) as FantasyTeamDetail;

  const defaultColumnDef = useMemo(() => {
    return {
      width: 100,
    };
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "week",
    },
    {
      headerName: "Quarterback",
      children: [
        {
          headerName: "Name",
          colId: "qbName",
          editable: true,
          field: "qbInput",
          cellRenderer: (cell) => {
            return cell.data.qbInput ? cell.data.qbInput.name : "";
          },
          //valueGetter: "data.name",
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: players,
            searchType: "match",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params) => {
              return params.qbInput ? params.qbInput.name : params.value.name;
            },
          },
        },
        {
          field: "points",
          valueGetter: "data.qbPoints",
        },
      ],
    },
    {
      headerName: "Running Back",
      children: [
        {
          headerName: "Name",
          field: "rbInput",
          colId: "rbName",
          editable: true,
          cellRenderer: (cell) => (cell.data.rbInput ? cell.data.rbInput.name : ""),
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: players,
            searchType: "match",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params) => {
              return params.rbInput ? params.rbInput.name : params.value.name;
            },
          },
        },
        { field: "points", valueGetter: "data.rbPoints" },
      ],
    },
    {
      headerName: "Wide Receiver",
      children: [
        {
          headerName: "Name",
          colId: "wrName",
          editable: true,
          field: "wrInput",
          cellRenderer: (cell) => (cell.data.wrInput ? cell.data.wrInput.name : ""),
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: players,
            searchType: "match",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params) => (params.wrInput ? params.wrInput.name : params.value.name),
          },
        },
        { field: "Points", valueGetter: "data.wrPoints" },
      ],
    },
    {
      headerName: "Tight End",
      children: [
        {
          headerName: "Name",
          colId: "teName",
          editable: true,
          field: "teInput",
          cellRenderer: (cell) => (cell.data.teInput ? cell.data.teInput.name : ""),
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: players,
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params) => (params.teInput ? params.teInput.name : params.value.name),
          },
        },
        { field: "Points", valueGetter: "data.tePoints" },
      ],
    },
    {
      headerName: "Defense",
      children: [{ field: "Team" }, { field: "Points" }],
    },
    {
      field: "Actions",
      cellRenderer: (params) => <span onClick={() => updatePick(params.data)}>Hello!</span>,
    },
  ]);

  const [rowData, setRowData] = useState(myTeam.picks);

  return (
    <div className="ag-theme-quartz h-96">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColumnDef}
        //editType="fullRow"
      />
    </div>
  );
};

export default LeagueDetailTable;
