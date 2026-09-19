import { createFileRoute } from "@tanstack/react-router";
import InvitePlayerForm from "~/app/_components/forms/InvitePlayerForm";

export const Route = createFileRoute("/ffl/$leagueId/invite")({
  component: RouteComponent,
});

function RouteComponent() {
  const { leagueId } = Route.useParams();
  return (
    <div>
      <InvitePlayerForm leagueId={parseInt(leagueId)} />
    </div>
  );
}
