import React from "react";
import CreateLeagueForm from "~/app/_components/forms/CreateLeagueForm";
import LeagueRequestForm from "~/app/_components/forms/LeagueRequestForm";

const page = () => {
  return (
    <div>
      <CreateLeagueForm />
      <LeagueRequestForm />
    </div>
  );
};

export default page;
