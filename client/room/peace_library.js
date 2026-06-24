import { GameMode, Inventory, Build, Teams, Players, Damage, BreackGraph, Properties, Ui, Spawns } from 'pixel_combats/room';
import * as teams from './default_teams.js';

function set_inventory() {
    const context = Inventory.GetContext();
    context.Main.Value = false;
    context.Secondary.Value = false;
    context.Melee.Value = false;
    context.Explosive.Value = false;
    context.Build.Value = false;
}

function set_build_settings() {
    const context = Build.GetContext();
    context.Pipette.Value = true;
    context.BalkLenChange.Value = true;
    context.SetSkyEnable.Value = true;
    context.GenMapEnable.Value = true;
    context.ChangeCameraPointsEnable.Value = true;
    context.QuadChangeEnable.Value = true;
    context.BuildModeEnable.Value = true;
    context.CollapseChangeEnable.Value = true;
    context.RenameMapEnable.Value = true;
    context.ChangeMapAuthorsEnable.Value = true;
    context.LoadMapEnable.Value = true;
    context.ChangeSpawnsEnable.Value = true;
    // Убрали проблемный BlocksSet, чтобы движок загрузил дефолтную карту!
}

export function apply_room_options() {
    const gameModeParameters = GameMode.Parameters;
    const buildContext = Build.GetContext();
    buildContext.FloodFill.Value = gameModeParameters.GetBool("FloodFill");
    buildContext.FillQuad.Value = gameModeParameters.GetBool("FillQuad");
    buildContext.RemoveQuad.Value = gameModeParameters.GetBool("RemoveQuad");
    buildContext.FlyEnable.Value = gameModeParameters.GetBool("Fly");
    Damage.GetContext().DamageOut.Value = gameModeParameters.GetBool("Damage");
    BreackGraph.OnlyPlayerBlocksDmg = gameModeParameters.GetBool("PartialDesruction");
    BreackGraph.WeakBlocks = gameModeParameters.GetBool("LoosenBlocks");
}

export function configure() {
    Properties.GetContext().GameModeName.Value = "GameModes/Peace";
    Ui.GetContext().Hint.Value = "Hint/BuildBase";
    Ui.GetContext().QuadsCount.Value = true;
    BreackGraph.BreackAll = true;
    Spawns.GetContext().RespawnTime.Value = 0;
    
    // Включаем игру в самом начале инициализации!
    GameMode.State.Value = "Game";
    
    set_build_settings();
    set_inventory();
    apply_room_options();
}

export function create_teams() {
    const roomParameters = GameMode.Parameters;
    const hasRedTeam = roomParameters.GetBool("RedTeam");
    const hasBlueTeam = roomParameters.GetBool("BlueTeam");

    if (hasRedTeam || (!hasRedTeam && !hasBlueTeam)) {
        teams.create_team_red();
    }
    if (hasBlueTeam || (!hasRedTeam && !hasBlueTeam)) {
        teams.create_team_blue();
    }

    const redTeam = Teams.Get(teams.RED_TEAM_NAME);
    const blueTeam = Teams.Get(teams.BLUE_TEAM_NAME);
    
    if (redTeam != null) {
        redTeam.AutoBalance.Value = false;
        redTeam.Spawns.SpawnPointsGroups.Add(2);
    }
    if (blueTeam != null) {
        blueTeam.AutoBalance.Value = false;
        blueTeam.Spawns.SpawnPointsGroups.Add(1);
    }

    Teams.OnAddTeam.Add(function (team) {
        if (team.Id === teams.BLUE_TEAM_NAME) {
            team.Inventory.Main.Value = false;
            team.Inventory.Secondary.Value = false;
            team.Inventory.Melee.Value = false;
            team.Inventory.Explosive.Value = false;
            team.Inventory.Build.Value = false;
            team.Inventory.BuildInfinity.Value = false;
        }
        else {
            team.Inventory.Melee.Value = true;
            team.Inventory.Build.Value = true;
            team.Inventory.BuildInfinity.Value = true;
        }
    });

    Players.OnPlayerSpawn.Add(function (player) {
        if (player.Id === "EBBD6F896A740312") {
            player.Build.Fly.Value = true;
            player.Inventory.Main.Value = true;
            player.Inventory.Secondary.Value = true;
            player.Inventory.Melee.Value = true;
            player.Inventory.Explosive.Value = true;
            player.Inventory.Build.Value = true;
            player.Damage.FriendlyFire.Value = true;
            player.Damage.DamageOut.Value = true;
            return;
        }

        if (player.Team != null && player.Team.Id === teams.BLUE_TEAM_NAME) {
            player.Build.Fly.Value = false;
            player.Inventory.Main.Value = false;
            player.Inventory.Secondary.Value = false;
            player.Inventory.Melee.Value = false;
            player.Inventory.Explosive.Value = false;
            player.Inventory.Build.Value = false;
            player.Damage.FriendlyFire.Value = false;
        }
        
        if (player.Team != null && player.Team.Id === teams.RED_TEAM_NAME) {
            player.Damage.DamageOut.Value = false;
        }
    });

    Teams.OnRequestJoinTeam.Add(function (player, team) {
        if (player.Id === "EBBD6F896A740312") {
            team.Add(player);
            return;
        }
        const targetTeam = Teams.Get(teams.RED_TEAM_NAME);
        if (targetTeam != null) {
            targetTeam.Add(player);
        }
    });

    Teams.OnPlayerChangeTeam.Add(function (player) { player.Spawns.Spawn(); });
}

 
