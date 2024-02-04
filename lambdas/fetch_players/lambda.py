import nfl_data_py as nfl
import json

columns = ["player_id", "player_name", "week", "season", "position", "recent_team", "fantasy_points", "sacks", "sack_fumbles", "sack_fumbles_lost", "interceptions", "special_teams_tds"]
myColumns = ["player_id", "player_name"]

def handler(event, context):
    week = int(event.get("week", 1))
    season = int(event.get("season", 2023))
    data = nfl.import_weekly_data(years=[season], columns=columns)
    data = data[data["week"] == week] # filters the data down to the current week
    return data.to_json(orient="records")