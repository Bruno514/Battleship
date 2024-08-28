import GameController from "./dom";
import Player from "./player";
import "./style.css";

const player = new Player("player", false);
const oponent = new Player("bot", true);

const gameController = GameController(player, oponent);
gameController.loadGrids();
gameController.startGame();

const placements = [
  [3, 1, 3, 2],
  [5, 1, 5, 2],
  [2, 6, 4, 6],
  [4, 8, 6, 8],
  [6, 4, 9, 4],
  [0, 2, 0, 6],
];

function placeDefaultShips() {
  placements.forEach((e) => {
    const coords = player.gameboard.placeShip(e[0], e[1], e[2], e[3]);

    coords.forEach((v) => {
      const x = v[0],
        y = v[1];
      const playerGrid = document.querySelector("#player-grid");
      const cell = playerGrid.querySelector(
        `[data-xpos='${x}'][data-ypos='${y}']`
      );
      cell.classList.add("ship");
    });
  });

  placements.forEach((e) => {
    oponent.gameboard.placeShip(e[0], e[1], e[2], e[3]);
  });
}
