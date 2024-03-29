"use client";

import React, { useState, useMemo, useRef } from "react";
import type { League, FantasyTeamDetail, Player } from "~/server/db/types";
import { AgGridReact } from "ag-grid-react";
import { useUser } from "@clerk/nextjs";
import { getCurrentWeek } from "~/settings";
import { updatePick } from "~/app/_actions";
import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "ag-grid-enterprise";

const LeagueDetailTable = ({ league, players, userId }: { league: League; players: Player[]; userId: string }) => {
  const gridRef = useRef();
  const week = getCurrentWeek();
  const { teams } = league;

  const { execute, result } = useAction(updatePick, {
    onSuccess(data, input, reset) {
      console.log("data: ", data);
      toast.success("Successful update!");
    },
    onError(error, input, reset) {
      console.log("error: ", error);
    },
  });

  const myTeam = teams.find((team) => team.ownerId === userId) as FantasyTeamDetail;

  const defaultColumnDef = useMemo(() => {
    return {
      width: 100,
    };
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "week",
      sort: "asc",
    },
    {
      headerName: "Quarterback",
      children: [
        {
          headerName: "Name",
          colId: "qbName",
          editable: true,
          field: "qbInput",
          cellRenderer: (cell: any) => {
            return cell.data.qbInput ? cell.data.qbInput.name : cell.data.quarterback?.player?.name;
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
            cellRenderer: (params: any) => {
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
          cellRenderer: (cell: any) => (cell.data.rbInput ? cell.data.rbInput.name : ""),
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: players,
            searchType: "match",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params: any) => {
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
          cellRenderer: (cell: any) => (cell.data.wrInput ? cell.data.wrInput.name : ""),
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: players,
            searchType: "match",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params: any) => (params.wrInput ? params.wrInput.name : params.value.name),
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
          cellRenderer: (cell: any) => (cell.data.teInput ? cell.data.teInput.name : ""),
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: players,
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params: any) => (params.teInput ? params.teInput.name : params.value.name),
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
      cellRenderer: (params: any) => <span onClick={() => execute(params.data)}>Update Row</span>,
    },
  ]);

  const [rowData, setRowData] = useState(myTeam.picks);

  return (
    <div className="ag-theme-quartz h-96">
      <AgGridReact
        // @ts-expect-error: column defs are weird
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColumnDef}
        //editType="fullRow"
      />
    </div>
  );
};

export default LeagueDetailTable;
