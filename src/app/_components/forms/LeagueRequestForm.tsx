"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "~/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicLeagues, insertLeagueRequest } from "~/app/_actions";
import { z } from "zod";

const fetchPublicLeaguesSchema = z.object({
  leagueId: z.number(),
});

const LeagueRequestForm = () => {
  const [leagueName, setLeagueName] = useState<string>("");
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(fetchPublicLeaguesSchema),
    defaultValues: {
      leagueId: null,
    },
  });

  const { data: leagues } = useQuery({
    queryKey: ["leagues", leagueName],
    queryFn: () => fetchPublicLeagues(leagueName),
    enabled: !!leagueName,
  });

  let filterTimeout: ReturnType<typeof setTimeout>;
  const handleInput = (e: React.BaseSyntheticEvent) => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      setLeagueName(e.target.value);
    }, 1000);
  };

  return (
    <form>
      <div>{JSON.stringify(leagues, null, 2) ?? "nothing"}</div>
      <Command>
        <CommandInput placeholder="Search for public leagues..." onInput={handleInput} {...register("leagueId")} />
        <CommandEmpty>No one found</CommandEmpty>
        <CommandGroup>
          {leagues?.map((league) => (
            <CommandItem key={league.id} value={league.name}>
              <div className="flex w-72 justify-between">
                <span>{league.name}</span>
                <span className="cursor-pointer" onClick={() => insertLeagueRequest(league.id)}>
                  Send invite
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
      <button type="submit">Request Invite</button>
    </form>
  );
};

export default LeagueRequestForm;
