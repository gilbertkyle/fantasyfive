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
      isPublic: true,
    },
  });

  const onHandleSubmit = async (data: createLeagueFields) => {
    await createLeague(data);
    reset();
  };

  return (
    <form className="rounded-sm border border-black/20 p-4" onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
      <div>
        <label htmlFor="name">Name: </label>
        <input className="rounded-md border border-gray-400/20" {...register("name")} />
      </div>
      <div>
        <label htmlFor="isPublic">Public League?</label>
        <input className="m-2" type="checkbox" {...register("isPublic")} />
      </div>
      <button className="rounded-sm border border-black/70 bg-slate-200/20 p-[6px] shadow-sm" type="submit">
        Create League
      </button>
    </form>
  );
};

export default CreateLeagueForm;
