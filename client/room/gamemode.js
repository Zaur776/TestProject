import { create_team_red, create_team_blue } from './root.js';
import { GameMode } from 'pixel_combats/room';

// ================== СОЗДАНИЕ КОМАНД ==================
create_team_red();
create_team_blue();

// ================== СТАРТ ==================
GameMode.OnStart.Add(function () {
    // Можно добавить логику при старте
});
