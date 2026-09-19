import { createFileRoute } from "@tanstack/react-router";
import { fetchLeagueWeek, fetchUsersByIds } from "~/app/_actions";
import WeekDetailTable from "~/app/_components/tables/WeekDetailTable";

export const Route = createFileRoute("/ffl/$leagueId/$week")({
  loader: async ({ params }) => {
    const leagueId = parseInt(params.leagueId);
    const week = parseInt(params.week);
    const league = await fetchLeagueWeek({ data: { leagueId, week } });
    const teamOwners = league.teams.map((team) => team.ownerId!);
    const users = await fetchUsersByIds({ data: teamOwners });
    return { league, week, leagueId, users };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { league, week, leagueId, users } = Route.useLoaderData();
  return (
    <div>
      <WeekDetailTable league={league} week={week} leagueId={leagueId} users={users} />
    </div>
  );
}
