import dayjs from "dayjs";

export const CURRENT_SEASON = 2024;
export const SEASON_LENGTH_IN_WEEKS = 18;

export const getCurrentWeek = () => {
  // BASE_DATE should be set for 10:00 AM,  2 weeks before the first sunday of the season
  // second argument is month INDEX
  const BASE_DATE = dayjs(new Date(CURRENT_SEASON, 7, 25, 10, 0, 0));
  const now = dayjs();
  const daysDifference = now.diff(BASE_DATE, "day");
  console.log("days: ", daysDifference);
  const week = Math.floor(daysDifference / 7);
  if (week > SEASON_LENGTH_IN_WEEKS + 1) return SEASON_LENGTH_IN_WEEKS + 1; // SEASON_LENGTH_IN_WEEKS + 1 allows for week 19 to work as the postseason
  if (week < 1) return 1;
  return week;
};

getCurrentWeek();
