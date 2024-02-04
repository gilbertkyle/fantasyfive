import sys
import nfl_data_py as nfl
import json

def handler(event, context):
    #return 'Hello from AWS Lambda using Python' + sys.version + '!' 
    data = nfl.import_weekly_data(years=[2023], columns=["player_id", "player_name", "week", "position", "recent_team", "fantasy_points", "sacks", "sack_fumbles", "sack_fumbles_lost", "interceptions", "special_teams_tds"])
    data = data[data["week"] == 2] # filters the data down to the current week
    return json.dumps(json.loads(data.to_json(orient="records")))