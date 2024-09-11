import React from "react";
import { fetchOutgoingRequests } from "~/app/_actions/index";
import DeleteRequestButton from "~/app/_components/DeleteRequestButton";

export default async function page() {
  const invites = await fetchOutgoingRequests();

  return (
    <div>
      {invites.map((invite) => (
        <DeleteRequestButton key={invite.id} invite={invite} />
      ))}
    </div>
  );
}
