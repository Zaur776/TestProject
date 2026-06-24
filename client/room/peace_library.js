import { GameMode, MapService, Player, Timers } from 'pixel-combats-2';

const ADMIN_ID = "EBBD6F896A740312";

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

GameMode.OnStart.Add(function () {
    InitializeMapAndWorld();
    Timers.Get("WorldTick").Start(5, true);
    GameMode.Initialization.Create();
});

Player.OnJoin.Add(function (player) {
    if (player.Id === ADMIN_ID) {
        player.Properties.Get("IsAdmin").Value = true;
    }
    player.Spawns.Spawn();
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
