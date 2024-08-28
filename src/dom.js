import createGrid from "./grid";

function GameController(player1, player2) {
  // Game state
  const STATE = "SHIP_PLACEMENT";
  let startCoord = undefined;
  let lastSelect = undefined;

  const body = document.querySelector("body");

  const loadGrids = (reset = false) => {
    let gridContainer;

    if (reset) {
      gridContainer = document.querySelector("div.grid-container");
      gridContainer.textContent = "";
    } else {
      gridContainer = document.createElement("div");
      gridContainer.classList.add("grid-container");
    }

    const gridPlayer = createGrid();
    gridPlayer.id = "player-grid";
    const gridOponent = createGrid();
    gridOponent.id = "oponent-grid";

    gridContainer.append(gridPlayer);
    gridContainer.append(gridOponent);

    document.querySelector("main").prepend(gridContainer);
  };

  const _updateShips = () => {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (player1.gameboard.board[y][x]) {
          const playerGrid = document.querySelector("#player-grid");
          const cell = playerGrid.querySelector(
            `[data-xpos='${x}'][data-ypos='${y}']`
          );
          cell.classList.add("ship");
        }
      }
    }
  };

  const startGame = () => {
    const playerGrid = document.querySelector("#player-grid");

    playerGrid.addEventListener("click", (e) => {
      const placingX = e.target.dataset.xpos;
      const placingY = e.target.dataset.ypos;

      if (startCoord === undefined) {
        startCoord = [placingX, placingY];

        e.target.classList.add("selected");
        lastSelect = e.target;
      } else {
        let coords = player1.gameboard.placeShip(
          startCoord[0],
          startCoord[1],
          placingX,
          placingY
        );

        _updateShips();

        lastSelect.classList.remove("selected");

        lastSelect = undefined;
        startCoord = undefined;
      }
    });
  };

  return { startGame, loadGrids };
}

export default GameController;
