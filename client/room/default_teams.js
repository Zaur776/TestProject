import { Teams, Color } from 'pixel-combats-2';

export const RED_TEAM_NAME = "Prisoners";
export const BLUE_TEAM_NAME = "Guards";
export const RED_TEAM_DISPLAY_NAME = "Prisoners";
export const BLUE_TEAM_DISPLAY_NAME = "Guards";
export const BLUE_TEAM_SPAWN_POINTS_GROUP = 1;
export const RED_TEAM_SPAWN_POINTS_GROUP = 2;

export function create_team_red() {
    Teams.Add(RED_TEAM_NAME, RED_TEAM_DISPLAY_NAME, new Color(1, 0, 0, 1));
    Teams.Get(RED_TEAM_NAME).Spawns.SpawnPointsGroups.Add(RED_TEAM_SPAWN_POINTS_GROUP);
    return Teams.Get(RED_TEAM_NAME);
}

export function create_team_blue() {
    Teams.Add(BLUE_TEAM_NAME, BLUE_TEAM_DISPLAY_NAME, new Color(0, 0, 1, 1));
    Teams.Get(BLUE_TEAM_NAME).Spawns.SpawnPointsGroups.Add(BLUE_TEAM_SPAWN_POINTS_GROUP);
    return Teams.Get(BLUE_TEAM_NAME);
}
