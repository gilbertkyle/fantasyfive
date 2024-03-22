"use client";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "ag-grid-enterprise";

import type { fetchPlayers } from "~/app/_actions";

type Player = Awaited<ReturnType<typeof fetchPlayers>>;

import React from "react";

const PlayersTable = ({ players }: { players: Player[] }) => {
  return <div></div>;
};

export default PlayersTable;
