import { createFileRoute } from "@tanstack/react-router";
import CreateLeagueForm from "~/app/_components/forms/CreateLeagueForm";
import LeagueRequestForm from "~/app/_components/forms/LeagueRequestForm";

export const Route = createFileRoute("/ffl/league/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <CreateLeagueForm />
      <LeagueRequestForm />
    </div>
  );
}
