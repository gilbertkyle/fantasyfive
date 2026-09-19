import { createFileRoute } from "@tanstack/react-router";
import { fetchLeagues } from "~/app/_actions";
import LeaguesTable from "~/app/_components/tables/LeaguesTable";

export const Route = createFileRoute("/ffl/")({
  loader: async () => fetchLeagues(),
  component: RouteComponent,
});

function RouteComponent() {
  const leagues = Route.useLoaderData();
  return (
    <div className="max-w-full">
      <div>
        <h1 className="p-2">My leagues</h1>
      </div>
      <div>
        <LeaguesTable leagues={leagues} />
      </div>
    </div>
  );
}
