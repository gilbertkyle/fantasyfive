"use client";

import React, { useState, useMemo, useRef } from "react";
import type { FantasyTeamDetail, Player, Pick, Team } from "~/server/db/types";
import { AgGridReact } from "ag-grid-react";
import { getCurrentWeek } from "~/settings";
import { updatePick } from "~/app/_actions";
import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";
import type { fetchLeagueDetail } from "~/app/_actions";
import type { ColDef, ColGroupDef, GridOptions, IRichCellEditorParams } from "ag-grid-community";
import { useTheme } from "~/context/ThemeContext";
import { useMediaQuery } from "~/lib/utils";
import Link from "next/link";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "ag-grid-enterprise";

type League = Awaited<ReturnType<typeof fetchLeagueDetail>>;

const LeagueDetailTable = ({
  league,
  players,
  userId,
  teams,
}: {
  league: League;
  players: Player[];
  userId: string;
  teams: Team[];
}) => {
  const gridRef = useRef();
  const week = getCurrentWeek();
  const { teams: fantasyTeams, id: leagueId } = league;
  const { theme } = useTheme();
  const isMobile = useMediaQuery(768);

  const { execute, result } = useAction(updatePick, {
    onSuccess({ data, input }) {
      console.log("data: ", data);
      toast.success("Successful update!");
    },
    onError({ error, input }) {
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

  const myTeam = fantasyTeams.find((team) => team.ownerId === userId) as FantasyTeamDetail;

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
    if (input == null) return null;
    const id = input.split("%")[1];
    const player = players.find((player) => player.id === id);
    return player ?? undefined;
  };

  const parseDefenseInput = (input: string | null) => {
    if (input == null) return null;
    const id = Number(input.split("%")[1]);
    const team = teams.find((team) => team.id === id);
    return team;
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "week",
      sort: "asc",
      cellRenderer: (cell: any) =>
        cell.data.week < week ? (
          <Link href={`/ffl/${leagueId}/${cell.data.week}`}>{cell.data.week}</Link>
        ) : (
          <span>{cell.data.week}</span>
        ),
    },
    {
      headerName: "Quarterback",
      children: [
        {
          headerName: "Name",
          colId: "qbName",
          editable: (params: any) => params.data.week <= week,
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
          valueGetter: (params: any) => {
            return params.data.quarterback?.fantasyPoints.toFixed(2) ?? 0;
          },
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
          editable: (params: any) => params.data.week <= week,
          cellRenderer: (cell: any) =>
            cell.data.rbInput ? cell.data.rbInput.split("%")[0] : cell.data.runningBack?.player?.name,
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
        {
          field: "points",
          valueGetter: (params: any) => {
            return params.data.runningBack?.fantasyPoints.toFixed(2) ?? 0;
          },
        },
      ],
    },
    {
      headerName: "Wide Receiver",
      children: [
        {
          headerName: "Name",
          colId: "wrName",
          editable: (params: any) => params.data.week <= week,
          field: "wrInput",
          cellRenderer: (cell: any) =>
            cell.data.wrInput ? cell.data.wrInput.split("%")[0] : cell.data.wideReceiver?.player?.name,
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: WR_LIST.map((player) => `${player.name}%${player.id}`),
            searchType: "matchAny",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params: { value: string }) => {
              const value = params.value.split("%")[0];
              return value;
            },
          },
        },
        {
          field: "Points",
          valueGetter: (params: any) => {
            return params.data.wideReceiver?.fantasyPoints.toFixed(2) ?? 0;
          },
        },
      ],
    },
    {
      headerName: "Tight End",
      children: [
        {
          headerName: "Name",
          colId: "teName",
          editable: (params: any) => params.data.week <= week,
          field: "teInput",
          cellRenderer: (cell: any) =>
            cell.data.teInput ? cell.data.teInput.split("%")[0] : cell.data.tightEnd?.player?.name,
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: TE_LIST.map((player) => `${player.name}%${player.id}`),
            searchType: "matchAny",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params: { value: string }) => {
              const value = params.value.split("%")[0];
              return value;
            },
          },
        },
        {
          field: "Points",
          valueGetter: (params: any) => {
            return params.data.tightEnd?.fantasyPoints.toFixed(2) ?? 0;
          },
        },
      ],
    },
    {
      headerName: "Defense",
      children: [
        {
          headerName: "Defense",
          colId: "defenseName",
          editable: (params: any) => params.data.week <= week,
          field: "defenseInput",
          cellRenderer: (cell: any) =>
            cell.data.defenseInput ? cell.data.defenseInput.split("%") : cell.data.defense?.team?.name,
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: teams.map((team) => `${team.name}%${team.id}`),
            searchType: "matchAny",
            allowTyping: true,
            filterList: true,
            highlightMatch: true,
            valueListMaxHeight: 220,
            cellRenderer: (params: { value: string }) => {
              const value = params.value.split("%")[0];
              return value;
            },
          },
        },

        { field: "Points" },
      ],
    },
    {
      field: "Actions",
      cellRenderer: (params: any) =>
        params.data?.week <= week ? (
          <span
            className="cursor-pointer rounded-sm border border-gray-400/40 p-2 shadow-sm"
            onClick={async () => {
              const qb = parseInput(params.data?.qbInput);
              const rb = parseInput(params.data?.rbInput);
              const wr = parseInput(params.data?.wrInput);
              const te = parseInput(params.data?.teInput);
              const defense = parseDefenseInput(params.data?.defenseInput);
              params.data.qbInput = qb;
              params.data.rbInput = rb;
              params.data.wrInput = wr;
              params.data.teInput = te;
              params.data.defenseInput = defense;
              console.log("params: ", params.data);
              execute(params.data);
            }}
          >
            Update Row
          </span>
        ) : (
          <span></span>
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
