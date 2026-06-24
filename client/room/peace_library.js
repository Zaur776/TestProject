import { GameMode, MapService, Player, Teams, Timers, Color, MapRepository } from 'pixel-combats-2';

const ADMIN_ID = "EBBD6F896A740312";

Teams.Add("Prisoners", "Prisoners", new Color(1, 0, 0, 1));
Teams.Add("Guards", "Guards", new Color(0, 0, 1, 1));

const PrisonersTeam = Teams.Get("Prisoners");
const GuardsTeam = Teams.Get("Guards");

PrisonersTeam.Spawns.SpawnPointsGroups.Add(1);
GuardsTeam.Spawns.SpawnPointsGroups.Add(2);

function InitializeMapAndWorld() {
    MapService.Initialize();
    
    MapService.MapConfig.Height = 64;
    MapService.MapConfig.Width = 128;
    MapService.MapConfig.Length = 128;

    for (let x = 0; x < MapService.MapConfig.Width; x++) {
        for (let z = 0; z < MapService.MapConfig.Length; z++) {
            MapService.SetBlock(x, 0, z, 1);
        }
    }
}

function HandlePlayerSpawn(player) {
    if (player.Id === ADMIN_ID) {
        player.Properties.Get("IsAdmin").Value = true;
    }

    if (GuardsTeam.Count === 0) {
        GuardsTeam.Add(player);
    } else {
        PrisonersTeam.Add(player);
    }

    player.Spawns.Spawn();
}

GameMode.OnStart.Add(function () {
    InitializeMapAndWorld();
    GameMode.Parameters.Get("TeamProp").Value = true;
    Timers.Get("WorldTick").Start(5, true);
    GameMode.Initialization.Create();
});

Player.OnJoin.Add(function (player) {
    HandlePlayerSpawn(player);
});

Player.OnDead.Add(function (player) {
    Timers.Get("Respawn_" + player.Id).Start(3, false);
});

Timers.OnTimer.Add(function (timer) {
    if (timer.Id.startsWith("Respawn_")) {
        const playerId = timer.Id.split("_");
        const player = Player.Get(playerId);
        if (player) {
            player.Spawns.Spawn();
        }
        timer.Stop();
    }
});
