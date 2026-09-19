import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/tanstack-react-start";
import { fetchACPlayers, fetchACTeams, fetchLeagueDetail } from "~/app/_actions";
import LeagueDetailTable from "~/app/_components/tables/LeagueDetailTable";

export const Route = createFileRoute("/ffl/$leagueId/")({
  loader: async ({ params }) => {
    const leagueId = parseInt(params.leagueId);
    const [league, players, teams] = await Promise.all([
      fetchLeagueDetail({ data: leagueId }),
      fetchACPlayers(),
      fetchACTeams(),
    ]);
    return { league, players, teams };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { league, players, teams } = Route.useLoaderData();
  const { user } = useUser();
  if (!user) throw new Error("you should be logged in");
  return (
    <div>
      <LeagueDetailTable league={league} players={players} userId={user.id} teams={teams} />
    </div>
  );
}
