/* jshint esversion: 6 */
import { GameMode, MapService, Player, Teams, Timers, Color } from 'pixel-combats-2';

// 1. НАСТРОЙКА АДМИНИСТРАТОРА И КОМАНД
const ADMIN_ID = "EBBD6F896A740312";

// Создаем две базовые команды для режима "Тюрьма"
Teams.Add("Prisoners", "Заключенные", new Color(1, 0, 0, 1)); // Красные
Teams.Add("Guards", "Охрана", new Color(0, 0, 1, 1));        // Синие

const PrisonersTeam = Teams.Get("Prisoners");
const GuardsTeam = Teams.Get("Guards");

// Настройки правил команд
PrisonersTeam.Spawns.SpawnPointsGroups.Add(1);
GuardsTeam.Spawns.SpawnPointsGroups.Add(2);

// 2. ГЕНЕРАЦИЯ МИРА И КАРТЫ (Решение проблемы серого экрана)
function InitializeMapAndWorld() {
    // Включаем стандартный слой воксельной земли, чтобы убрать серую пустоту
    MapService.Initialize();
    
    // Задаем базовые размеры рабочей зоны мира, если они не заданы картой (X, Y, Z)
    MapService.MapConfig.Height = 64;
    MapService.MapConfig.Width = 128;
    MapService.MapConfig.Length = 128;

    // Принудительно создаем базовую плоскость земли (бетон/земля) на уровне 0
    // Это гарантирует, что игрокам будет на что спавниться
    for (let x = 0; x < MapService.MapConfig.Width; x++) {
        for (let z = 0; z < MapService.MapConfig.Length; z++) {
            MapService.SetBlock(x, 0, z, 1); // 1 - ID базового вокселя земли/камня
        }
    }
}

// 3. ЛОГИКА СПАВНА И РАСПРЕДЕЛЕНИЯ ИГРОКОВ
function HandlePlayerSpawn(player) {
    // Назначаем админку по вашему ID
    if (player.Id === ADMIN_ID) {
        player.Properties.Get("IsAdmin").Value = true;
    }

    // Автоматическое распределение: первый зашедший — Охрана, остальные — Заключенные
    if (GuardsTeam.Count === 0) {
        GuardsTeam.Add(player);
    } else {
        PrisonersTeam.Add(player);
    }

    // Принудительный мгновенный спавн персонажа на точке
    player.Spawns.Spawn();
}

// 4. ИНИЦИАЛИЗАЦИЯ ИГРОВОГО РЕЖИМА (Жизненный цикл API 2.0)
GameMode.OnStart.Add(function () {
    // Шаг 1: Строим мир
    InitializeMapAndWorld();
    
    // Шаг 2: Включаем основные игровые параметры мира
    GameMode.Parameters.Get("TeamProp").Value = true; // Включаем командный режим

    // Таймер для проверки застрявших состояний (каждые 5 секунд)
    Timers.Get("WorldTick").Start(5, true);
});

// Отслеживание входа игроков
Player.OnJoin.Add(function (player) {
    HandlePlayerSpawn(player);
});

// Обработка смерти (авто-респавн через 3 секунды)
Player.OnDead.Add(function (player) {
    Timers.Get("Respawn_" + player.Id).Start(3, false);
});

// Триггеры таймеров
Timers.OnTimer.Add(function (timer) {
    if (timer.Id.startsWith("Respawn_")) {
        const playerId = timer.Id.split("_")[1];
        const player = Player.Get(playerId);
        if (player) {
            player.Spawns.Spawn();
        }
        timer.Stop();
    }
});
