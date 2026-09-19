import { createFileRoute } from "@tanstack/react-router";
import { fetchOutgoingRequests } from "~/app/_actions";
import DeleteRequestButton from "~/app/_components/DeleteRequestButton";

export const Route = createFileRoute("/profile")({
  loader: async () => fetchOutgoingRequests(),
  component: RouteComponent,
});

function RouteComponent() {
  const invites = Route.useLoaderData();
  return (
    <div>
      {invites.map((invite) => (
        <DeleteRequestButton key={invite.id} invite={invite} />
      ))}
    </div>
  );
}
