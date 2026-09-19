import { createFileRoute } from "@tanstack/react-router";
import LeagueRequestForm from "~/app/_components/forms/LeagueRequestForm";

export const Route = createFileRoute("/ffl/league/join")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LeagueRequestForm />;
}
