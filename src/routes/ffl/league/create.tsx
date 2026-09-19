import { createFileRoute } from "@tanstack/react-router";
import CreateLeagueForm from "~/app/_components/forms/CreateLeagueForm";

export const Route = createFileRoute("/ffl/league/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateLeagueForm />;
}
