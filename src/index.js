import domController from "./dom";
import Player from "./player";
import "./style.css";

const dom = domController();

dom.setup();
dom.loadGrids();

const player = new Player("player", false);
const oponent = new Player("bot", true);

function startGame() {
  const placements = [
    [3, 1, 3, 2],
    [4, 1, 4, 2],
    [2, 6, 4, 6],
    [4, 7, 6, 7],
    [6, 4, 9, 4],
    [8, 2, 8, 6],
  ];

  placements.forEach((e) => {
    player.gameboard.placeShip(e[0], e[1], e[2], e[3]);
  });

  placements.forEach((e) => {
    oponent.gameboard.placeShip(e[0], e[1], e[2], e[3]);
  });
}
