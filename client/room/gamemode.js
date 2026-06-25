import { create_team_red, create_team_blue } from './root.js';
import { GameMode } from 'pixel_combats/room';

GameMode.OnStart.Add(function () {
    create_team_red();
    create_team_blue();
});
