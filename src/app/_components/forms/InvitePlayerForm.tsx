"use client";

import React, { useState } from "react";
import { inviteUserSchema } from "~/app/_schemata/invitePlayerSchema";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteUser } from "~/app/_actions";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "~/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { fetchUserList } from "~/app/_actions";
import type { User } from "~/app/_types";

type inviteUserFields = z.infer<typeof inviteUserSchema>;

const InvitePlayerForm = ({ leagueId }: { leagueId: number }) => {
  const [userInput, setUserInput] = useState("");
  const [userData, setUserData] = useState<User[]>([]);

  const { data: users } = useQuery({
    queryKey: ["users", userInput],
    queryFn: () => fetchUserList(userInput),
    enabled: !!userInput, // useQuery doesn't run until userInput is truthy
  });

  const { register, handleSubmit, reset } = useForm<inviteUserFields>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      userId: "",
      leagueId: leagueId,
    },
  });

  let filterTimeout: ReturnType<typeof setTimeout>;

  const handleInput = (e: React.BaseSyntheticEvent) => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      setUserInput(e.target.value);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit((data) => inviteUser(data))}>
      <div>{JSON.stringify(users, null, 2) ?? "nothing"}</div>
      {/* <div>
        <label htmlFor="user">User</label>
        <input {...register("userId")} />
      </div> */}
      <Command>
        <CommandInput onInput={handleInput} {...register("userId")} placeholder="Search users..." />
        <CommandEmpty>No users found</CommandEmpty>
        <CommandGroup></CommandGroup>
      </Command>
      <button type="submit">Invite User</button>
    </form>
  );
};

export default InvitePlayerForm;
