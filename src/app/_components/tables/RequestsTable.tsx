"use client";

import React from "react";
import type { fetchLeagueRequests } from "~/app/_actions";
import { addUserToLeague } from "~/app/_actions";

type Requests = Awaited<ReturnType<typeof fetchLeagueRequests>>;

const RequestsTable = ({ requests }: { requests: Requests }) => {
  console.log("requests: ", requests);
  return (
    <div>
      {requests.map((request) => {
        return (
          <div key={request.league_requests.id}>
            <span>{request.league_requests.from}</span>
            <span onClick={() => addUserToLeague(request.leagues.id, request.league_requests.from)}>Accept</span>
          </div>
        );
      })}
    </div>
  );
};

export default RequestsTable;
