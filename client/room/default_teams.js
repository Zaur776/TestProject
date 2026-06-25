import { Teams, Color } from 'pixel_combats/basic';
import { 
    room, MapEditor, Players, Damage, Spawns, Timers, 
    GameMode, Properties, Ui 
} from 'pixel_combats/room';

const ADMIN_ID = "EBBD6F896A740312";

// ================== КОМАНДЫ ==================
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

// ================== МИР И КАРТА ==================
room.PopupsEnable = true;

function InitializeMapAndWorld() {
    for (let x = 0; x < 128; x++) {
        for (let z = 0; z < 128; z++) {
            MapEditor.SetBlock(x, 0, z, 1);
        }
    }
}

InitializeMapAndWorld();

// ================== ПАРАМЕТРЫ ==================
GameMode.Parameters.Get("TeamProp").Value = true;

// ================== ТАЙМЕР МИРА ==================
const worldTimer = Timers.GetContext().Get("WorldTick");
worldTimer.RestartLoop(5);

// ================== СОБЫТИЯ ==================
// Вход игрока
Players.OnPlayerConnected.Add(function (player) {
    if (player.Id === ADMIN_ID) {
        player.Properties.Get("IsAdmin").Value = true;
    }
});

// Смерть и респавн
Damage.OnDeath.Add(function (player) {
    const timer = player.Timers.Get("Respawn_" + player.Id);
    timer.Restart(3);
    timer.OnTimer.Add(function onRespawn() {
        player.Spawns.Spawn();
        timer.Stop();
        timer.OnTimer.Remove(onRespawn);
    });
});

// ================== ПОДСКАЗКА ==================
Ui.GetContext().Hint.Value = "Добро пожаловать в режим!";
