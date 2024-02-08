import dayjs from "dayjs";

export const CURRENT_SEASON = 2023;
export const SEASON_LENGTH_IN_WEEKS = 18;

export const getCurrentWeek = () => {
  // BASE_DATE should be set for 10:00 AM,  2 weeks before the first sunday of the season
  const BASE_DATE = dayjs(new Date(CURRENT_SEASON, 8, 27, 10, 0, 0));
  const now = dayjs();
  const daysDifference = now.diff(BASE_DATE, "day");
  const week = Math.floor(daysDifference / 7);
  if (week > SEASON_LENGTH_IN_WEEKS) return SEASON_LENGTH_IN_WEEKS;
  if (week < 1) return 1;
  return week;
};

getCurrentWeek();
