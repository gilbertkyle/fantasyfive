"use client";

import React, { useState, useMemo, useRef } from "react";
import type { FantasyTeamDetail, Player, Pick } from "~/server/db/types";
import { AgGridReact } from "ag-grid-react";
import { getCurrentWeek } from "~/settings";
import { updatePick } from "~/app/_actions";
import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";
import type { fetchLeagueDetail } from "~/app/_actions";
import type { ColDef, ColGroupDef, GridOptions, IRichCellEditorParams } from "ag-grid-community";
import { useTheme } from "~/context/ThemeContext";
import { useMediaQuery } from "~/lib/utils";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "ag-grid-enterprise";

type League = Awaited<ReturnType<typeof fetchLeagueDetail>>;

const LeagueDetailTable = ({ league, players, userId }: { league: League; players: Player[]; userId: string }) => {
  const gridRef = useRef();
  const week = getCurrentWeek();
  const { teams } = league;
  const { theme } = useTheme();
  const isMobile = useMediaQuery(768);

  const { execute, result } = useAction(updatePick, {
    onSuccess(data, input, reset) {
      console.log("data: ", data);
      toast.success("Successful update!");
    },
    onError(error, input, reset) {
      console.log(error);
      toast.error("error");
    },
    /* onSettled(result, input, reset) {
      const { data } = result;
      if (!data?.error) {
        toast.success("great");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const error: string[] = JSON.parse(data.error);
      if (!error.length) toast.success("great!");
    }, */
  });

  const myTeam = teams.find((team) => team.ownerId === userId) as FantasyTeamDetail;

  const QB_LIST = useMemo(() => players.filter((player) => player.position === "QB"), []);
  const RB_LIST = useMemo(() => players.filter((player) => player.position === "RB"), []);
  const WR_LIST = useMemo(() => players.filter((player) => player.position === "WR"), []);
  const TE_LIST = useMemo(() => players.filter((player) => player.position === "TE"), []);

  const defaultColumnDef = useMemo(() => {
    return {
      width: 120,
    };
  }, []);

  const parseInput = (input: string | null) => {
    if (input == null) return "";
    const id = input.split("%")[1];
    const player = players.find((player) => player.id === id);
    return player ?? "";
  };

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
            return cell.data.qbInput ? cell.data.qbInput.split("%")[0] : cell.data.quarterback?.player?.name;
          },
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: QB_LIST.map((player) => `${player.name}%${player.id}`),
            //formatValue: (value: any) => value?.name,
            searchType: "matchAny",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            useFormatter: true,
            cellRenderer: (params: { value: string }) => {
              const value = params.value.split("%")[0];
              return value;
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
          cellRenderer: (cell: any) =>
            cell.data.rbInput ? cell.data.rbInput.name : cell.data.runningBack?.player?.name,
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: RB_LIST.map((player) => `${player.name}%${player.id}`),
            searchType: "matchAny",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            useFormatter: true,
            cellRenderer: (params: { value: string }) => {
              const value = params.value.split("%")[0];
              return value;
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
          cellRenderer: (cell: any) =>
            cell.data.wrInput ? cell.data.wrInput.name : cell.data.wideReceiver?.player?.name,
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: WR_LIST.map((player) => `${player.name}%${player.id}`),
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
          cellRenderer: (cell: any) => (cell.data.teInput ? cell.data.teInput.name : cell.data.tightEnd?.player?.name),
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: TE_LIST.map((player) => `${player.name}%${player.id}`),
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
      cellRenderer: (params: any) => (
        <span
          className="cursor-pointer rounded-sm border border-gray-400/40 p-2 shadow-sm"
          onClick={() => {
            //console.log(params.data)
            /* const qbString = params?.data?.qbInput;
            const qbCode = qbString.split("%")[1];
            const qb = players.find((player) => player.id === qbCode);
            console.log(qb); */
            const qb = parseInput(params.data?.qbInput);
          }}
        >
          Update Row
        </span>
      ),
    },
  ]);

  const [rowData, setRowData] = useState(myTeam.picks);

  const gridOptions: GridOptions<(typeof myTeam.picks)[0]> = {
    rowData: myTeam.picks,
  };

  return (
    <div className={`${theme === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"} h-screen`}>
      <AgGridReact<(typeof myTeam.picks)[0]>
        // @ts-expect-error: column defs are weird
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColumnDef}
      />
    </div>
  );
};

export default LeagueDetailTable;
