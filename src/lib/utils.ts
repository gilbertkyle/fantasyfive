import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useCallback, useEffect, useState, SyntheticEvent } from "react";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { fetchLeagueWeek } from "~/app/_actions";

type FilteredUser = ReturnType<typeof filterUserForClient>;
type League = Awaited<ReturnType<typeof fetchLeagueWeek>>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", updateTarget);
  }, []);

  return targetReached;
};

export const mergePickAndUserData = ({
  league,
  users,
  week,
}: {
  league: League;
  users: FilteredUser[];
  week: number;
}) => {
  const picks = league.teams.map((team) => {
    const { ownerId } = team;
    const pick = team.picks.find((pick) => pick.week === week);
    const user = users.find((u) => u.id === ownerId);
    return {
      user,
      ...pick,
    };
  });
  return picks;
};
