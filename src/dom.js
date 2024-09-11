import createGrid from "./grid";

const STATES = {
  SHIP_PLACEMENT: "SHIP_PLACEMENT",
  INGAME: "INGAME",
  FINISHED: "FINISHED",
};

function GameController(player1, player2) {
  // Game state
  let STATE = STATES.SHIP_PLACEMENT;

  // Variables for ship placement
  let startCoord = undefined;
  let lastSelect = undefined;

  let currentPlayer = player1;

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

    document.querySelector("main").append(gridContainer);
    updateShips();
  };

  const updateShips = () => {
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

    updateAvailableShips();
  };

  const updateAvailableShips = () => {
    const availableShips = player1.gameboard.ships;
    const availableShipsContainer = document.querySelector(
      ".available-ships-container"
    );

    // Clear container
    availableShipsContainer.textContent = "";

    availableShips.forEach((ship) => {
      if (!ship.ingame) {
        const grid = document.createElement("div");
        grid.classList.add("grid");

        for (let i = 0; i < ship.length; i++) {
          const cell = document.createElement("div");
          cell.classList.add("ship", "cell");
          grid.append(cell);
        }

        availableShipsContainer.append(grid);
      }
    });

    if (player1.gameboard.areAllShipsPlaced()) {
      const textInfo = "All ships have been placed";
      const paragraph = document.createElement("p");
      paragraph.textContent = textInfo;

      availableShipsContainer.append(paragraph);
    }
  };

  const setupEventListeners = () => {
    const playerBoard = document.querySelector("#player-grid");
    const oponentBoard = document.querySelector("#oponent-grid");
    const gameInfoMessage = document.querySelector(".game-info-message");
    updateAvailableShips();

    const handlePlayerBoardClick = (e) => {
      const placingX = e.target.dataset.xpos;
      const placingY = e.target.dataset.ypos;

      console.log(1);
      console.log(STATE);
      if (STATE === STATES.SHIP_PLACEMENT) {
        console.log(STATE);
        if (startCoord === undefined) {
          startCoord = [placingX, placingY];

          e.target.classList.add("selected");
          lastSelect = e.target;
        } else {
          player1.gameboard.placeShip(
            startCoord[0],
            startCoord[1],
            placingX,
            placingY
          );

          updateShips();

          lastSelect.classList.remove("selected");

          lastSelect = undefined;
          startCoord = undefined;
        }
      }
    };
    playerBoard.addEventListener("click", handlePlayerBoardClick);

    const startButton = document.querySelector(".btn-play");
    const handleStartClick = () => {
      if (player1.gameboard.areAllShipsPlaced()) {
        STATE = STATES.INGAME;
        gameInfoMessage.textContent = `${currentPlayer.name} turn`;
      }
    };
    startButton.addEventListener("click", handleStartClick);

    const handleOponentBoardClick = (e) => {
      if (STATE === STATES.INGAME) {
        const [shotX, shotY] = [e.target.dataset.xpos, e.target.dataset.ypos];
        const cell = e.target;
        const playerGameboard = player1.gameboard;

        // Break if target is not a cell (cause its possible to trigger this event from the margin so...)
        if (!cell.classList.contains("cell")) return;

        cell.classList.add("shot");

        try {
          if (player2.gameboard.receiveAttack(shotX, shotY)) {
            cell.classList.add("ship");
          }

          // Check for win
          if (player2.gameboard.areAllShipsSunk()) {
            STATE = STATES.FINISHED;
            toggleRestartScreen("You");
          }

          // If bot, then let it play its turn
          if (player2.isBot && STATE != STATES.FINISHED) {
            const [x, y] =
              playerGameboard.availableCoordinates[
                Math.floor(
                  Math.random() * playerGameboard.availableCoordinates.length
                )
              ];
            playerGameboard.receiveAttack(x, y);

            const cell = document.querySelector(
              `.cell[data-xpos='${x}'][data-ypos='${y}']`
            );
            cell.classList.add("shot");

            if (player1.gameboard.areAllShipsSunk()) {
              STATE = STATES.FINISHED;
              toggleRestartScreen("Bot");
            }
          }
        } catch (e) {
          throw e;
        }
      }
    };
    oponentBoard.addEventListener("click", handleOponentBoardClick);

    const restartButton = document.querySelector(".btn-restart-game");
    const handleRestartButtonClick = () => {
      window.location.reload();
    };
    restartButton.addEventListener("click", handleRestartButtonClick);

    const toggleRestartScreen = (winnerName) => {
      const restartModal = document.querySelector(".restart-game-modal");
      const overlay = document.querySelector(".overlay");
      restartModal.querySelector(
        "p"
      ).textContent = `${winnerName} won! Wanna play again?`;

      restartModal.classList.toggle("hidden");
      overlay.classList.toggle("hidden");
    };
  };

  return { setupEventListeners, loadGrids, updateAvailableShips, updateShips };
}

export default GameController;
