import { createFileRoute } from "@tanstack/react-router";
import { fetchPlayerAggregates } from "~/app/_actions";

export const Route = createFileRoute("/ffl/players")({
  loader: async () => fetchPlayerAggregates(),
  component: RouteComponent,
});

function RouteComponent() {
  const players = Route.useLoaderData();
  return <div>{JSON.stringify(players, null, 2)}</div>;
}
