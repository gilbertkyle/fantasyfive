import React from "react";
import { fetchOutgoingRequests } from "~/app/_actions/index";
import DeleteRequestButton from "~/app/_components/DeleteRequestButton";

export default async function page() {
  const invites = await fetchOutgoingRequests();

  return (
    <div>
      {JSON.stringify(invites, null, 2)}
      {invites.map((invite) => (
        <DeleteRequestButton key={invite.id} invite={invite} />
      ))}
    </div>
  );
}
