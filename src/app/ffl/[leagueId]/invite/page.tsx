import React from "react";
import InvitePlayerForm from "~/app/_components/forms/InvitePlayerForm";

const page = async ({ params }: { params: { leagueId: string } }) => {
  const { leagueId } = params;
  return (
    <div>
      <InvitePlayerForm leagueId={parseInt(leagueId)} />
    </div>
  );
};

export default page;
