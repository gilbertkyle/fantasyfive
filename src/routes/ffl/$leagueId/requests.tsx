import { createFileRoute } from "@tanstack/react-router";
import { fetchLeagueRequests } from "~/app/_actions";
import RequestsTable from "~/app/_components/tables/RequestsTable";

export const Route = createFileRoute("/ffl/$leagueId/requests")({
  loader: async ({ params }) => fetchLeagueRequests({ data: parseInt(params.leagueId) }),
  component: RouteComponent,
});

function RouteComponent() {
  const requests = Route.useLoaderData();
  return <RequestsTable requests={requests} />;
}
