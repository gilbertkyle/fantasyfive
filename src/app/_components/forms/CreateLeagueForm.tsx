"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeagueSchema } from "~/app/_schemata/createLeagueSchema";
import type { createLeagueFields } from "~/app/_types/createLeagueFields";
import { createLeague } from "~/app/_actions/createLeague";

const CreateLeagueForm = () => {
  const { register, handleSubmit, reset } = useForm<createLeagueFields>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: "",
      isPublic: false,
    },
  });

  const onHandleSubmit = async (data: createLeagueFields) => {
    await createLeague(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
      <div>
        <label htmlFor="name">Name</label>
        <input {...register("name")} />
      </div>
      <div>
        <label htmlFor="isPublic">Public League?</label>
        <input type="checkbox" {...register("isPublic")} />
      </div>
      <button type="submit">Create League</button>
    </form>
  );
};

export default CreateLeagueForm;
