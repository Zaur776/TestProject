import { Teams, Color } from 'pixel_combats/basic';
import { 
    room, Players, Damage, Spawns, 
    GameMode, Properties, Ui 
} from 'pixel_combats/room';

const ADMIN_ID = "EBBD6F896A740312";

export const RED_TEAM_NAME = "Prisoners";
export const BLUE_TEAM_NAME = "Guards";
export const RED_TEAM_DISPLAY_NAME = "Заключенные";
export const BLUE_TEAM_DISPLAY_NAME = "Охрана";
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

room.PopupsEnable = true;

Players.OnPlayerConnected.Add(function (player) {
    if (player.Id === ADMIN_ID) {
        player.Properties.Get("IsAdmin").Value = true;
    }
});

Damage.OnDeath.Add(function (player) {
    const timer = player.Timers.Get("Respawn_" + player.Id);
    timer.Restart(3);
    timer.OnTimer.Add(function onRespawn() {
        player.Spawns.Spawn();
        timer.Stop();
        timer.OnTimer.Remove(onRespawn);
    });
});

Ui.GetContext().Hint.Value = "Режим запущен успешно!";
 
