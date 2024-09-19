import React from "react";
import { fetchLeagueRequests } from "~/app/_actions";
import RequestsTable from "~/app/_components/tables/RequestsTable";

type Props = {
  params: {
    leagueId: string;
  };
};

const page = async ({ params }: Props) => {
  const { leagueId } = params;
  const requests = await fetchLeagueRequests(parseInt(leagueId));
  return <RequestsTable requests={requests} />;
};

export default page;
