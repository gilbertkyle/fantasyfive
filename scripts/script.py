import nfl_data_py as nfl
import json

team_desc = nfl.import_team_desc()

output = []

for team in team_desc.iterrows():
    output.append(team[1].to_dict())
   

with open('data.json', 'w', encoding="utf-8") as file:
    json.dump(output, file, indent=4)