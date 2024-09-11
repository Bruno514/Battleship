/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/compareArrays.js":
/*!******************************!*\
  !*** ./src/compareArrays.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compareArray: () => (/* binding */ compareArray)
/* harmony export */ });
const compareArray = (array1, array2) => {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
};

/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid */ "./src/grid.js");

const STATES = {
  SHIP_PLACEMENT: "SHIP_PLACEMENT",
  INGAME: "INGAME",
  FINISHED: "FINISHED"
};
function GameController(player1, player2) {
  // Game state
  let STATE = STATES.SHIP_PLACEMENT;

  // Variables for ship placement
  let startCoord = undefined;
  let lastSelect = undefined;
  let currentPlayer = player1;
  const loadGrids = function () {
    let reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    let gridContainer;
    if (reset) {
      gridContainer = document.querySelector("div.grid-container");
      gridContainer.textContent = "";
    } else {
      gridContainer = document.createElement("div");
      gridContainer.classList.add("grid-container");
    }
    const gridPlayer = (0,_grid__WEBPACK_IMPORTED_MODULE_0__["default"])();
    gridPlayer.id = "player-grid";
    const gridOponent = (0,_grid__WEBPACK_IMPORTED_MODULE_0__["default"])();
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
          const cell = playerGrid.querySelector(`[data-xpos='${x}'][data-ypos='${y}']`);
          cell.classList.add("ship");
        }
      }
    }
    updateAvailableShips();
  };
  const updateAvailableShips = () => {
    const availableShips = player1.gameboard.ships;
    const availableShipsContainer = document.querySelector(".available-ships-container");

    // Clear container
    availableShipsContainer.textContent = "";
    availableShips.forEach(ship => {
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
    const handlePlayerBoardClick = e => {
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
          player1.gameboard.placeShip(startCoord[0], startCoord[1], placingX, placingY);
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
    const handleOponentBoardClick = e => {
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
            const [x, y] = playerGameboard.availableCoordinates[Math.floor(Math.random() * playerGameboard.availableCoordinates.length)];
            playerGameboard.receiveAttack(x, y);
            const cell = document.querySelector(`.cell[data-xpos='${x}'][data-ypos='${y}']`);
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
    const toggleRestartScreen = winnerName => {
      const restartModal = document.querySelector(".restart-game-modal");
      const overlay = document.querySelector(".overlay");
      restartModal.querySelector("p").textContent = `${winnerName} won! Wanna play again?`;
      restartModal.classList.toggle("hidden");
      overlay.classList.toggle("hidden");
    };
  };
  return {
    setupEventListeners,
    loadGrids,
    updateAvailableShips,
    updateShips
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameController);

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _compareArrays__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compareArrays */ "./src/compareArrays.js");


class Gameboard {
  constructor() {
    [this.board, this.availableCoordinates] = this.#generateBoard();
    this.ships = [new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](2), new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](2), new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](3), new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](3), new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](4), new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](5)];
    this.shipsOnBoard = 0;
  }
  placeShip(startX, startY, endX, endY) {
    this.#validateCoords(startX, startY, endX, endY);
    const coordsPlace = [];
    const isHorizontal = startY === endY;
    const staticRef = isHorizontal ? startY : startX;
    const startRef = isHorizontal ? Math.min(startX, endX) : Math.min(startY, endY);
    const endRef = isHorizontal ? Math.max(startX, endX) : Math.max(startY, endY);
    const shipLength = endRef - startRef + 1;
    const ship = this.#getAvailableShip(shipLength);
    if (!ship) throw new Error("Unavailable ship");
    for (let ref = startRef; ref <= endRef; ref++) {
      if (isHorizontal) {
        if (!!this.board[staticRef][ref]) throw Error("This ship is overlapping another one");
        this.board[staticRef][ref] = ship;
        ship.ingame = true;
        coordsPlace.push([ref, staticRef]);
      } else {
        if (!!this.board[ref][staticRef]) throw Error("This ship is overlapping another one");
        this.board[ref][staticRef] = ship;
        ship.ingame = true;
        coordsPlace.push([staticRef, ref]);
      }
    }
    return [...coordsPlace];
  }
  receiveAttack(x, y) {
    this.#validateCoords(x, y);
    const ship = this.board[y][x];
    const hitTwice = this.availableCoordinates.some(e => {
      return e[0] == x && e[1] == y;
    });
    if (!hitTwice) {
      throw Error("Place is already hit");
    }
    this.availableCoordinates = this.availableCoordinates.filter(v => {
      return v[0] != x || v[1] != y;
    });
    if (!ship) return false;else {
      ship.hit();
      return true;
    }
  }
  areAllShipsPlaced() {
    return this.ships.every(ship => ship.ingame);
  }
  areAllShipsSunk() {
    return this.ships.every(s => s.isSunk());
  }
  #getAvailableShip(size) {
    for (let i in this.ships) {
      const ship = this.ships[i];
      if (ship.length === size && !ship.ingame) {
        return ship;
      }
    }
    return null;
  }
  #generateBoard() {
    const board = [];
    const availableCoordinates = [];
    for (let row = 0; row < 10; row++) {
      board[row] = [];
      for (let col = 0; col < 10; col++) {
        board[row][col] = 0;
        availableCoordinates.push([col, row]);
      }
    }
    return [board, availableCoordinates];
  }
  #validateCoords() {
    for (var _len = arguments.length, coords = new Array(_len), _key = 0; _key < _len; _key++) {
      coords[_key] = arguments[_key];
    }
    [...coords].map(e => {
      if (e > 9 || e < 0) throw new Error("Coordinate is out of bounds");
    });
  }
}

/***/ }),

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createGrid)
/* harmony export */ });
function createGrid() {
  const grid = document.createElement("div");
  grid.classList.add("grid");
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");
      cell.dataset.xpos = x;
      cell.dataset.ypos = y;
      cell.classList.add("cell");
      grid.appendChild(cell);
    }
  }
  return grid;
}

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

class Player {
  constructor(name, isBot) {
    this.name = name;
    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.isBot = isBot;
  }
}

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  #hits;
  constructor(length) {
    this.length = length;
    this.#hits = 0;
    this.ingame = false;
  }
  hit() {
    this.#hits = this.#hits + 1;
  }
  isSunk() {
    return this.#hits >= this.length;
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27black%27 stroke-width=%271%27/><path d=%27M0 0 L100 100 %27 stroke=%27black%27 stroke-width=%271%27/></svg> */ "data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27black%27 stroke-width=%271%27/><path d=%27M0 0 L100 100 %27 stroke=%27black%27 stroke-width=%271%27/></svg>"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.bunny.net/css?family=black-ops-one:400);"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  font-family: "Black Ops One", display;
}

header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #c7b7a3;
}

button.btn-play,
button.btn-restart-game {
  font-size: large;
  padding-inline: 1rem;
  border-width: 4px;
  border-radius: 1rem;
}

main {
  max-width: 1400px;
  margin: auto;
  display: flex;
  justify-content: center;
  padding-block: 2rem;
  gap: 2rem;
  flex-wrap: wrap-reverse;
  border: 2px solid black;
  background-color: beige;
  height: 100vh;
}

.header-title {
  font: 1.5rem "Black Ops One", display;
}

.grid-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(10, 35px);
  grid-template-rows: repeat(10, 35px);
}

.available-ships-container .grid {
  grid-template-columns: repeat(5, 35px);
  grid-template-rows: repeat(1, 35px);
}

.cell {
  border: 2px solid black;
  background-color: aqua;
}

.cell:hover,
.cell:active {
  background-color: #c7b7a3;
}

.ship {
  background-color: blue;
}

.cell.selected {
  background-color: red;
}

.shot {
  background: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%, auto;
}
.shot.ship {
  background-color: red;
}

.game-info {
  max-width: 300px;
}

.game-info-message {
  margin-top: 1rem;
  font-weight: bold;
  list-style: circle;
  background-color: navajowhite;
  border: 2px solid black;
  padding: 1rem;
}

.available-ships-container .cell:hover {
  background-color: blue;
}

.available-ships-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;
  border: 2px solid black;
  padding: 2rem;
}

.modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.4rem;
  width: clamp(18rem, 10vh, 20rem);
  padding: 1.3rem;
  min-height: 250px;
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 15px;
  z-index: 2;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1;
}

.hidden {
  display: none;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAEA;EACE,SAAS;EACT,UAAU;EACV,sBAAsB;;EAEtB,qCAAqC;AACvC;;AAEA;EACE,aAAa;EACb,8BAA8B;EAC9B,aAAa;EACb,yBAAyB;AAC3B;;AAEA;;EAEE,gBAAgB;EAChB,oBAAoB;EACpB,iBAAiB;EACjB,mBAAmB;AACrB;;AAEA;EACE,iBAAiB;EACjB,YAAY;EACZ,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,SAAS;EACT,uBAAuB;EACvB,uBAAuB;EACvB,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,aAAa;EACb,SAAS;EACT,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,uCAAuC;EACvC,oCAAoC;AACtC;;AAEA;EACE,sCAAsC;EACtC,mCAAmC;AACrC;;AAEA;EACE,uBAAuB;EACvB,sBAAsB;AACxB;;AAEA;;EAEE,yBAAyB;AAC3B;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,mDAA4Q;EAC5Q,4BAA4B;EAC5B,kCAAkC;EAClC,gCAAgC;AAClC;AACA;EACE,qBAAqB;AACvB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,6BAA6B;EAC7B,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,eAAe;EACf,QAAQ;EACR,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,WAAW;EACX,gCAAgC;EAChC,eAAe;EACf,iBAAiB;EACjB,eAAe;EACf,SAAS;EACT,QAAQ;EACR,gCAAgC;EAChC,uBAAuB;EACvB,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;AACZ;;AAEA;EACE,eAAe;EACf,MAAM;EACN,SAAS;EACT,OAAO;EACP,QAAQ;EACR,WAAW;EACX,YAAY;EACZ,8BAA8B;EAC9B,0BAA0B;EAC1B,UAAU;AACZ;;AAEA;EACE,aAAa;AACf","sourcesContent":["@import url(https://fonts.bunny.net/css?family=black-ops-one:400);\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n\n  font-family: \"Black Ops One\", display;\n}\n\nheader {\n  display: flex;\n  justify-content: space-between;\n  padding: 1rem;\n  background-color: #c7b7a3;\n}\n\nbutton.btn-play,\nbutton.btn-restart-game {\n  font-size: large;\n  padding-inline: 1rem;\n  border-width: 4px;\n  border-radius: 1rem;\n}\n\nmain {\n  max-width: 1400px;\n  margin: auto;\n  display: flex;\n  justify-content: center;\n  padding-block: 2rem;\n  gap: 2rem;\n  flex-wrap: wrap-reverse;\n  border: 2px solid black;\n  background-color: beige;\n  height: 100vh;\n}\n\n.header-title {\n  font: 1.5rem \"Black Ops One\", display;\n}\n\n.grid-container {\n  display: flex;\n  gap: 2rem;\n  justify-content: center;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(10, 35px);\n  grid-template-rows: repeat(10, 35px);\n}\n\n.available-ships-container .grid {\n  grid-template-columns: repeat(5, 35px);\n  grid-template-rows: repeat(1, 35px);\n}\n\n.cell {\n  border: 2px solid black;\n  background-color: aqua;\n}\n\n.cell:hover,\n.cell:active {\n  background-color: #c7b7a3;\n}\n\n.ship {\n  background-color: blue;\n}\n\n.cell.selected {\n  background-color: red;\n}\n\n.shot {\n  background: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><path d='M100 0 L0 100 ' stroke='black' stroke-width='1'/><path d='M0 0 L100 100 ' stroke='black' stroke-width='1'/></svg>\");\n  background-repeat: no-repeat;\n  background-position: center center;\n  background-size: 100% 100%, auto;\n}\n.shot.ship {\n  background-color: red;\n}\n\n.game-info {\n  max-width: 300px;\n}\n\n.game-info-message {\n  margin-top: 1rem;\n  font-weight: bold;\n  list-style: circle;\n  background-color: navajowhite;\n  border: 2px solid black;\n  padding: 1rem;\n}\n\n.available-ships-container .cell:hover {\n  background-color: blue;\n}\n\n.available-ships-container {\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 5px;\n  border: 2px solid black;\n  padding: 2rem;\n}\n\n.modal {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  gap: 0.4rem;\n  width: clamp(18rem, 10vh, 20rem);\n  padding: 1.3rem;\n  min-height: 250px;\n  position: fixed;\n  left: 50%;\n  top: 40%;\n  transform: translate(-50%, -50%);\n  background-color: white;\n  border: 1px solid #ddd;\n  border-radius: 15px;\n  z-index: 2;\n}\n\n.overlay {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.5);\n  backdrop-filter: blur(2px);\n  z-index: 1;\n}\n\n.hidden {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27black%27 stroke-width=%271%27/><path d=%27M0 0 L100 100 %27 stroke=%27black%27 stroke-width=%271%27/></svg>":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27black%27 stroke-width=%271%27/><path d=%27M0 0 L100 100 %27 stroke=%27black%27 stroke-width=%271%27/></svg> ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27black%27 stroke-width=%271%27/><path d=%27M0 0 L100 100 %27 stroke=%27black%27 stroke-width=%271%27/></svg>";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.css */ "./src/style.css");



const player = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("Player", false);
const oponent = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("Bot", true);
const gameController = (0,_dom__WEBPACK_IMPORTED_MODULE_0__["default"])(player, oponent);
gameController.loadGrids();
gameController.setupEventListeners();
const placements = [[3, 1, 3, 2], [5, 1, 5, 2], [2, 6, 4, 6], [4, 8, 6, 8], [6, 4, 9, 4], [0, 2, 0, 6]];
function placeDefaultShips() {
  placements.forEach(e => {
    oponent.gameboard.placeShip(e[0], e[1], e[2], e[3]);
  });
  gameController.updateAvailableShips();
  gameController.updateShips();
}
placeDefaultShips();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q3REQyxjQUFjLENBQUN4SCxTQUFTLENBQUMsQ0FBQztBQUMxQndILGNBQWMsQ0FBQ3ZGLG1CQUFtQixDQUFDLENBQUM7QUFFcEMsTUFBTXdGLFVBQVUsR0FBRyxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNaLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ1osQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDWixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNaLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ1osQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDYjtBQUVELFNBQVNDLGlCQUFpQkEsQ0FBQSxFQUFHO0VBQzNCRCxVQUFVLENBQUNoRyxPQUFPLENBQUVhLENBQUMsSUFBSztJQUN4QmlGLE9BQU8sQ0FBQ3RHLFNBQVMsQ0FBQzhCLFNBQVMsQ0FBQ1QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUVBLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3JELENBQUMsQ0FBQztFQUNGa0YsY0FBYyxDQUFDbkcsb0JBQW9CLENBQUMsQ0FBQztFQUNyQ21HLGNBQWMsQ0FBQzFHLFdBQVcsQ0FBQyxDQUFDO0FBQzlCO0FBRUE0RyxpQkFBaUIsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBhcmVBcnJheXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgY29tcGFyZUFycmF5ID0gKGFycmF5MSwgYXJyYXkyKSA9PiB7XG4gIHJldHVybiAoXG4gICAgYXJyYXkxLmxlbmd0aCA9PT0gYXJyYXkyLmxlbmd0aCAmJlxuICAgIGFycmF5MS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gYXJyYXkyW2luZGV4XSlcbiAgKTtcbn07XG4iLCJpbXBvcnQgY3JlYXRlR3JpZCBmcm9tIFwiLi9ncmlkXCI7XG5cbmNvbnN0IFNUQVRFUyA9IHtcbiAgU0hJUF9QTEFDRU1FTlQ6IFwiU0hJUF9QTEFDRU1FTlRcIixcbiAgSU5HQU1FOiBcIklOR0FNRVwiLFxuICBGSU5JU0hFRDogXCJGSU5JU0hFRFwiLFxufTtcblxuZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIocGxheWVyMSwgcGxheWVyMikge1xuICAvLyBHYW1lIHN0YXRlXG4gIGxldCBTVEFURSA9IFNUQVRFUy5TSElQX1BMQUNFTUVOVDtcblxuICAvLyBWYXJpYWJsZXMgZm9yIHNoaXAgcGxhY2VtZW50XG4gIGxldCBzdGFydENvb3JkID0gdW5kZWZpbmVkO1xuICBsZXQgbGFzdFNlbGVjdCA9IHVuZGVmaW5lZDtcblxuICBsZXQgY3VycmVudFBsYXllciA9IHBsYXllcjE7XG5cbiAgY29uc3QgbG9hZEdyaWRzID0gKHJlc2V0ID0gZmFsc2UpID0+IHtcbiAgICBsZXQgZ3JpZENvbnRhaW5lcjtcblxuICAgIGlmIChyZXNldCkge1xuICAgICAgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuZ3JpZC1jb250YWluZXJcIik7XG4gICAgICBncmlkQ29udGFpbmVyLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBncmlkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJncmlkLWNvbnRhaW5lclwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBncmlkUGxheWVyID0gY3JlYXRlR3JpZCgpO1xuICAgIGdyaWRQbGF5ZXIuaWQgPSBcInBsYXllci1ncmlkXCI7XG4gICAgY29uc3QgZ3JpZE9wb25lbnQgPSBjcmVhdGVHcmlkKCk7XG4gICAgZ3JpZE9wb25lbnQuaWQgPSBcIm9wb25lbnQtZ3JpZFwiO1xuXG4gICAgZ3JpZENvbnRhaW5lci5hcHBlbmQoZ3JpZFBsYXllcik7XG4gICAgZ3JpZENvbnRhaW5lci5hcHBlbmQoZ3JpZE9wb25lbnQpO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIikuYXBwZW5kKGdyaWRDb250YWluZXIpO1xuICAgIHVwZGF0ZVNoaXBzKCk7XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlU2hpcHMgPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4KyspIHtcbiAgICAgICAgaWYgKHBsYXllcjEuZ2FtZWJvYXJkLmJvYXJkW3ldW3hdKSB7XG4gICAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyLWdyaWRcIik7XG4gICAgICAgICAgY29uc3QgY2VsbCA9IHBsYXllckdyaWQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGBbZGF0YS14cG9zPScke3h9J11bZGF0YS15cG9zPScke3l9J11gXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQXZhaWxhYmxlU2hpcHMoKTtcbiAgfTtcblxuICBjb25zdCB1cGRhdGVBdmFpbGFibGVTaGlwcyA9ICgpID0+IHtcbiAgICBjb25zdCBhdmFpbGFibGVTaGlwcyA9IHBsYXllcjEuZ2FtZWJvYXJkLnNoaXBzO1xuICAgIGNvbnN0IGF2YWlsYWJsZVNoaXBzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLmF2YWlsYWJsZS1zaGlwcy1jb250YWluZXJcIlxuICAgICk7XG5cbiAgICAvLyBDbGVhciBjb250YWluZXJcbiAgICBhdmFpbGFibGVTaGlwc0NvbnRhaW5lci50ZXh0Q29udGVudCA9IFwiXCI7XG5cbiAgICBhdmFpbGFibGVTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAoIXNoaXAuaW5nYW1lKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBncmlkLmNsYXNzTGlzdC5hZGQoXCJncmlkXCIpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInNoaXBcIiwgXCJjZWxsXCIpO1xuICAgICAgICAgIGdyaWQuYXBwZW5kKGNlbGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXZhaWxhYmxlU2hpcHNDb250YWluZXIuYXBwZW5kKGdyaWQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBsYXllcjEuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzUGxhY2VkKCkpIHtcbiAgICAgIGNvbnN0IHRleHRJbmZvID0gXCJBbGwgc2hpcHMgaGF2ZSBiZWVuIHBsYWNlZFwiO1xuICAgICAgY29uc3QgcGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICBwYXJhZ3JhcGgudGV4dENvbnRlbnQgPSB0ZXh0SW5mbztcblxuICAgICAgYXZhaWxhYmxlU2hpcHNDb250YWluZXIuYXBwZW5kKHBhcmFncmFwaCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHNldHVwRXZlbnRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllci1ncmlkXCIpO1xuICAgIGNvbnN0IG9wb25lbnRCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3BvbmVudC1ncmlkXCIpO1xuICAgIGNvbnN0IGdhbWVJbmZvTWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1pbmZvLW1lc3NhZ2VcIik7XG4gICAgdXBkYXRlQXZhaWxhYmxlU2hpcHMoKTtcblxuICAgIGNvbnN0IGhhbmRsZVBsYXllckJvYXJkQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgY29uc3QgcGxhY2luZ1ggPSBlLnRhcmdldC5kYXRhc2V0Lnhwb3M7XG4gICAgICBjb25zdCBwbGFjaW5nWSA9IGUudGFyZ2V0LmRhdGFzZXQueXBvcztcblxuICAgICAgY29uc29sZS5sb2coMSk7XG4gICAgICBjb25zb2xlLmxvZyhTVEFURSk7XG4gICAgICBpZiAoU1RBVEUgPT09IFNUQVRFUy5TSElQX1BMQUNFTUVOVCkge1xuICAgICAgICBjb25zb2xlLmxvZyhTVEFURSk7XG4gICAgICAgIGlmIChzdGFydENvb3JkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdGFydENvb3JkID0gW3BsYWNpbmdYLCBwbGFjaW5nWV07XG5cbiAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgbGFzdFNlbGVjdCA9IGUudGFyZ2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYXllcjEuZ2FtZWJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICAgIHN0YXJ0Q29vcmRbMF0sXG4gICAgICAgICAgICBzdGFydENvb3JkWzFdLFxuICAgICAgICAgICAgcGxhY2luZ1gsXG4gICAgICAgICAgICBwbGFjaW5nWVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1cGRhdGVTaGlwcygpO1xuXG4gICAgICAgICAgbGFzdFNlbGVjdC5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG5cbiAgICAgICAgICBsYXN0U2VsZWN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHN0YXJ0Q29vcmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVQbGF5ZXJCb2FyZENsaWNrKTtcblxuICAgIGNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idG4tcGxheVwiKTtcbiAgICBjb25zdCBoYW5kbGVTdGFydENsaWNrID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllcjEuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzUGxhY2VkKCkpIHtcbiAgICAgICAgU1RBVEUgPSBTVEFURVMuSU5HQU1FO1xuICAgICAgICBnYW1lSW5mb01lc3NhZ2UudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9IHR1cm5gO1xuICAgICAgfVxuICAgIH07XG4gICAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVN0YXJ0Q2xpY2spO1xuXG4gICAgY29uc3QgaGFuZGxlT3BvbmVudEJvYXJkQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgaWYgKFNUQVRFID09PSBTVEFURVMuSU5HQU1FKSB7XG4gICAgICAgIGNvbnN0IFtzaG90WCwgc2hvdFldID0gW2UudGFyZ2V0LmRhdGFzZXQueHBvcywgZS50YXJnZXQuZGF0YXNldC55cG9zXTtcbiAgICAgICAgY29uc3QgY2VsbCA9IGUudGFyZ2V0O1xuICAgICAgICBjb25zdCBwbGF5ZXJHYW1lYm9hcmQgPSBwbGF5ZXIxLmdhbWVib2FyZDtcblxuICAgICAgICAvLyBCcmVhayBpZiB0YXJnZXQgaXMgbm90IGEgY2VsbCAoY2F1c2UgaXRzIHBvc3NpYmxlIHRvIHRyaWdnZXIgdGhpcyBldmVudCBmcm9tIHRoZSBtYXJnaW4gc28uLi4pXG4gICAgICAgIGlmICghY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJjZWxsXCIpKSByZXR1cm47XG5cbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hvdFwiKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChwbGF5ZXIyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHNob3RYLCBzaG90WSkpIHtcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIHdpblxuICAgICAgICAgIGlmIChwbGF5ZXIyLmdhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKSkge1xuICAgICAgICAgICAgU1RBVEUgPSBTVEFURVMuRklOSVNIRUQ7XG4gICAgICAgICAgICB0b2dnbGVSZXN0YXJ0U2NyZWVuKFwiWW91XCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIGJvdCwgdGhlbiBsZXQgaXQgcGxheSBpdHMgdHVyblxuICAgICAgICAgIGlmIChwbGF5ZXIyLmlzQm90ICYmIFNUQVRFICE9IFNUQVRFUy5GSU5JU0hFRCkge1xuICAgICAgICAgICAgY29uc3QgW3gsIHldID1cbiAgICAgICAgICAgICAgcGxheWVyR2FtZWJvYXJkLmF2YWlsYWJsZUNvb3JkaW5hdGVzW1xuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogcGxheWVyR2FtZWJvYXJkLmF2YWlsYWJsZUNvb3JkaW5hdGVzLmxlbmd0aFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHBsYXllckdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuXG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgYC5jZWxsW2RhdGEteHBvcz0nJHt4fSddW2RhdGEteXBvcz0nJHt5fSddYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInNob3RcIik7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXIxLmdhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKSkge1xuICAgICAgICAgICAgICBTVEFURSA9IFNUQVRFUy5GSU5JU0hFRDtcbiAgICAgICAgICAgICAgdG9nZ2xlUmVzdGFydFNjcmVlbihcIkJvdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBvcG9uZW50Qm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZU9wb25lbnRCb2FyZENsaWNrKTtcblxuICAgIGNvbnN0IHJlc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ0bi1yZXN0YXJ0LWdhbWVcIik7XG4gICAgY29uc3QgaGFuZGxlUmVzdGFydEJ1dHRvbkNsaWNrID0gKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH07XG4gICAgcmVzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlUmVzdGFydEJ1dHRvbkNsaWNrKTtcblxuICAgIGNvbnN0IHRvZ2dsZVJlc3RhcnRTY3JlZW4gPSAod2lubmVyTmFtZSkgPT4ge1xuICAgICAgY29uc3QgcmVzdGFydE1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXN0YXJ0LWdhbWUtbW9kYWxcIik7XG4gICAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vdmVybGF5XCIpO1xuICAgICAgcmVzdGFydE1vZGFsLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwicFwiXG4gICAgICApLnRleHRDb250ZW50ID0gYCR7d2lubmVyTmFtZX0gd29uISBXYW5uYSBwbGF5IGFnYWluP2A7XG5cbiAgICAgIHJlc3RhcnRNb2RhbC5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpO1xuICAgICAgb3ZlcmxheS5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpO1xuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHsgc2V0dXBFdmVudExpc3RlbmVycywgbG9hZEdyaWRzLCB1cGRhdGVBdmFpbGFibGVTaGlwcywgdXBkYXRlU2hpcHMgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUNvbnRyb2xsZXI7XG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5pbXBvcnQgeyBjb21wYXJlQXJyYXkgfSBmcm9tIFwiLi9jb21wYXJlQXJyYXlzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIFt0aGlzLmJvYXJkLCB0aGlzLmF2YWlsYWJsZUNvb3JkaW5hdGVzXSA9IHRoaXMuI2dlbmVyYXRlQm9hcmQoKTtcbiAgICB0aGlzLnNoaXBzID0gW1xuICAgICAgbmV3IFNoaXAoMiksXG4gICAgICBuZXcgU2hpcCgyKSxcbiAgICAgIG5ldyBTaGlwKDMpLFxuICAgICAgbmV3IFNoaXAoMyksXG4gICAgICBuZXcgU2hpcCg0KSxcbiAgICAgIG5ldyBTaGlwKDUpLFxuICAgIF07XG5cbiAgICB0aGlzLnNoaXBzT25Cb2FyZCA9IDA7XG4gIH1cblxuICBwbGFjZVNoaXAoc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFkpIHtcbiAgICB0aGlzLiN2YWxpZGF0ZUNvb3JkcyhzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSk7XG4gICAgY29uc3QgY29vcmRzUGxhY2UgPSBbXTtcblxuICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IHN0YXJ0WSA9PT0gZW5kWTtcbiAgICBjb25zdCBzdGF0aWNSZWYgPSBpc0hvcml6b250YWwgPyBzdGFydFkgOiBzdGFydFg7XG5cbiAgICBjb25zdCBzdGFydFJlZiA9IGlzSG9yaXpvbnRhbFxuICAgICAgPyBNYXRoLm1pbihzdGFydFgsIGVuZFgpXG4gICAgICA6IE1hdGgubWluKHN0YXJ0WSwgZW5kWSk7XG5cbiAgICBjb25zdCBlbmRSZWYgPSBpc0hvcml6b250YWxcbiAgICAgID8gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKVxuICAgICAgOiBNYXRoLm1heChzdGFydFksIGVuZFkpO1xuXG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IGVuZFJlZiAtIHN0YXJ0UmVmICsgMTtcbiAgICBjb25zdCBzaGlwID0gdGhpcy4jZ2V0QXZhaWxhYmxlU2hpcChzaGlwTGVuZ3RoKTtcblxuICAgIGlmICghc2hpcCkgdGhyb3cgbmV3IEVycm9yKFwiVW5hdmFpbGFibGUgc2hpcFwiKTtcblxuICAgIGZvciAobGV0IHJlZiA9IHN0YXJ0UmVmOyByZWYgPD0gZW5kUmVmOyByZWYrKykge1xuICAgICAgaWYgKGlzSG9yaXpvbnRhbCkge1xuICAgICAgICBpZiAoISF0aGlzLmJvYXJkW3N0YXRpY1JlZl1bcmVmXSlcbiAgICAgICAgICB0aHJvdyBFcnJvcihcIlRoaXMgc2hpcCBpcyBvdmVybGFwcGluZyBhbm90aGVyIG9uZVwiKTtcbiAgICAgICAgdGhpcy5ib2FyZFtzdGF0aWNSZWZdW3JlZl0gPSBzaGlwO1xuICAgICAgICBzaGlwLmluZ2FtZSA9IHRydWU7XG5cbiAgICAgICAgY29vcmRzUGxhY2UucHVzaChbcmVmLCBzdGF0aWNSZWZdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghIXRoaXMuYm9hcmRbcmVmXVtzdGF0aWNSZWZdKVxuICAgICAgICAgIHRocm93IEVycm9yKFwiVGhpcyBzaGlwIGlzIG92ZXJsYXBwaW5nIGFub3RoZXIgb25lXCIpO1xuICAgICAgICB0aGlzLmJvYXJkW3JlZl1bc3RhdGljUmVmXSA9IHNoaXA7XG4gICAgICAgIHNoaXAuaW5nYW1lID0gdHJ1ZTtcblxuICAgICAgICBjb29yZHNQbGFjZS5wdXNoKFtzdGF0aWNSZWYsIHJlZl0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWy4uLmNvb3Jkc1BsYWNlXTtcbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgIHRoaXMuI3ZhbGlkYXRlQ29vcmRzKHgsIHkpO1xuXG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuYm9hcmRbeV1beF07XG4gICAgY29uc3QgaGl0VHdpY2UgPSB0aGlzLmF2YWlsYWJsZUNvb3JkaW5hdGVzLnNvbWUoKGUpID0+IHtcbiAgICAgIHJldHVybiBlWzBdID09IHggJiYgZVsxXSA9PSB5O1xuICAgIH0pO1xuXG4gICAgaWYgKCFoaXRUd2ljZSkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJQbGFjZSBpcyBhbHJlYWR5IGhpdFwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmF2YWlsYWJsZUNvb3JkaW5hdGVzID0gdGhpcy5hdmFpbGFibGVDb29yZGluYXRlcy5maWx0ZXIoKHYpID0+IHtcbiAgICAgIHJldHVybiB2WzBdICE9IHggfHwgdlsxXSAhPSB5O1xuICAgIH0pO1xuXG4gICAgaWYgKCFzaGlwKSByZXR1cm4gZmFsc2U7XG4gICAgZWxzZSB7XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgYXJlQWxsU2hpcHNQbGFjZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaW5nYW1lKTtcbiAgfVxuXG4gIGFyZUFsbFNoaXBzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwcy5ldmVyeSgocykgPT4gcy5pc1N1bmsoKSk7XG4gIH1cblxuICAjZ2V0QXZhaWxhYmxlU2hpcChzaXplKSB7XG4gICAgZm9yIChsZXQgaSBpbiB0aGlzLnNoaXBzKSB7XG4gICAgICBjb25zdCBzaGlwID0gdGhpcy5zaGlwc1tpXTtcblxuICAgICAgaWYgKHNoaXAubGVuZ3RoID09PSBzaXplICYmICFzaGlwLmluZ2FtZSkge1xuICAgICAgICByZXR1cm4gc2hpcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gICNnZW5lcmF0ZUJvYXJkKCkge1xuICAgIGNvbnN0IGJvYXJkID0gW107XG4gICAgY29uc3QgYXZhaWxhYmxlQ29vcmRpbmF0ZXMgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93KyspIHtcbiAgICAgIGJvYXJkW3Jvd10gPSBbXTtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wrKykge1xuICAgICAgICBib2FyZFtyb3ddW2NvbF0gPSAwO1xuICAgICAgICBhdmFpbGFibGVDb29yZGluYXRlcy5wdXNoKFtjb2wsIHJvd10pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbYm9hcmQsIGF2YWlsYWJsZUNvb3JkaW5hdGVzXTtcbiAgfVxuXG4gICN2YWxpZGF0ZUNvb3JkcyguLi5jb29yZHMpIHtcbiAgICBbLi4uY29vcmRzXS5tYXAoKGUpID0+IHtcbiAgICAgIGlmIChlID4gOSB8fCBlIDwgMCkgdGhyb3cgbmV3IEVycm9yKFwiQ29vcmRpbmF0ZSBpcyBvdXQgb2YgYm91bmRzXCIpO1xuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVHcmlkKCkge1xuICBjb25zdCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZ3JpZC5jbGFzc0xpc3QuYWRkKFwiZ3JpZFwiKVxuICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5KyspIHtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDEwOyB4KyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY2VsbC5kYXRhc2V0Lnhwb3MgPSB4O1xuICAgICAgY2VsbC5kYXRhc2V0Lnlwb3MgPSB5O1xuXG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ3JpZDtcbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGlzQm90KSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICB0aGlzLmlzQm90ID0gaXNCb3Q7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICAjaGl0cztcblxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLiNoaXRzID0gMDtcbiAgICB0aGlzLmluZ2FtZSA9IGZhbHNlO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuI2hpdHMgPSB0aGlzLiNoaXRzICsgMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy4jaGl0cyA+PSB0aGlzLmxlbmd0aDtcbiAgfVxufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9JTI3aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmclMjcgdmVyc2lvbj0lMjcxLjElMjcgcHJlc2VydmVBc3BlY3RSYXRpbz0lMjdub25lJTI3IHZpZXdCb3g9JTI3MCAwIDEwMCAxMDAlMjc+PHBhdGggZD0lMjdNMTAwIDAgTDAgMTAwICUyNyBzdHJva2U9JTI3YmxhY2slMjcgc3Ryb2tlLXdpZHRoPSUyNzElMjcvPjxwYXRoIGQ9JTI3TTAgMCBMMTAwIDEwMCAlMjcgc3Ryb2tlPSUyN2JsYWNrJTI3IHN0cm9rZS13aWR0aD0lMjcxJTI3Lz48L3N2Zz5cIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmJ1bm55Lm5ldC9jc3M/ZmFtaWx5PWJsYWNrLW9wcy1vbmU6NDAwKTtcIl0pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcblxuICBmb250LWZhbWlseTogXCJCbGFjayBPcHMgT25lXCIsIGRpc3BsYXk7XG59XG5cbmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgcGFkZGluZzogMXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2M3YjdhMztcbn1cblxuYnV0dG9uLmJ0bi1wbGF5LFxuYnV0dG9uLmJ0bi1yZXN0YXJ0LWdhbWUge1xuICBmb250LXNpemU6IGxhcmdlO1xuICBwYWRkaW5nLWlubGluZTogMXJlbTtcbiAgYm9yZGVyLXdpZHRoOiA0cHg7XG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XG59XG5cbm1haW4ge1xuICBtYXgtd2lkdGg6IDE0MDBweDtcbiAgbWFyZ2luOiBhdXRvO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcGFkZGluZy1ibG9jazogMnJlbTtcbiAgZ2FwOiAycmVtO1xuICBmbGV4LXdyYXA6IHdyYXAtcmV2ZXJzZTtcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XG4gIGJhY2tncm91bmQtY29sb3I6IGJlaWdlO1xuICBoZWlnaHQ6IDEwMHZoO1xufVxuXG4uaGVhZGVyLXRpdGxlIHtcbiAgZm9udDogMS41cmVtIFwiQmxhY2sgT3BzIE9uZVwiLCBkaXNwbGF5O1xufVxuXG4uZ3JpZC1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDJyZW07XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uZ3JpZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAzNXB4KTtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDM1cHgpO1xufVxuXG4uYXZhaWxhYmxlLXNoaXBzLWNvbnRhaW5lciAuZ3JpZCB7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDUsIDM1cHgpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxLCAzNXB4KTtcbn1cblxuLmNlbGwge1xuICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcbiAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcbn1cblxuLmNlbGw6aG92ZXIsXG4uY2VsbDphY3RpdmUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzdiN2EzO1xufVxuXG4uc2hpcCB7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsdWU7XG59XG5cbi5jZWxsLnNlbGVjdGVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xufVxuXG4uc2hvdCB7XG4gIGJhY2tncm91bmQ6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgYmFja2dyb3VuZC1zaXplOiAxMDAlIDEwMCUsIGF1dG87XG59XG4uc2hvdC5zaGlwIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xufVxuXG4uZ2FtZS1pbmZvIHtcbiAgbWF4LXdpZHRoOiAzMDBweDtcbn1cblxuLmdhbWUtaW5mby1tZXNzYWdlIHtcbiAgbWFyZ2luLXRvcDogMXJlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGxpc3Qtc3R5bGU6IGNpcmNsZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogbmF2YWpvd2hpdGU7XG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xuICBwYWRkaW5nOiAxcmVtO1xufVxuXG4uYXZhaWxhYmxlLXNoaXBzLWNvbnRhaW5lciAuY2VsbDpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsdWU7XG59XG5cbi5hdmFpbGFibGUtc2hpcHMtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgZ2FwOiA1cHg7XG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xuICBwYWRkaW5nOiAycmVtO1xufVxuXG4ubW9kYWwge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZ2FwOiAwLjRyZW07XG4gIHdpZHRoOiBjbGFtcCgxOHJlbSwgMTB2aCwgMjByZW0pO1xuICBwYWRkaW5nOiAxLjNyZW07XG4gIG1pbi1oZWlnaHQ6IDI1MHB4O1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGxlZnQ6IDUwJTtcbiAgdG9wOiA0MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgYm9yZGVyLXJhZGl1czogMTVweDtcbiAgei1pbmRleDogMjtcbn1cblxuLm92ZXJsYXkge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjUpO1xuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMnB4KTtcbiAgei1pbmRleDogMTtcbn1cblxuLmhpZGRlbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBRUE7RUFDRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLHNCQUFzQjs7RUFFdEIscUNBQXFDO0FBQ3ZDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDhCQUE4QjtFQUM5QixhQUFhO0VBQ2IseUJBQXlCO0FBQzNCOztBQUVBOztFQUVFLGdCQUFnQjtFQUNoQixvQkFBb0I7RUFDcEIsaUJBQWlCO0VBQ2pCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixZQUFZO0VBQ1osYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsU0FBUztFQUNULHVCQUF1QjtFQUN2Qix1QkFBdUI7RUFDdkIsdUJBQXVCO0VBQ3ZCLGFBQWE7QUFDZjs7QUFFQTtFQUNFLHFDQUFxQztBQUN2Qzs7QUFFQTtFQUNFLGFBQWE7RUFDYixTQUFTO0VBQ1QsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVDQUF1QztFQUN2QyxvQ0FBb0M7QUFDdEM7O0FBRUE7RUFDRSxzQ0FBc0M7RUFDdEMsbUNBQW1DO0FBQ3JDOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLHNCQUFzQjtBQUN4Qjs7QUFFQTs7RUFFRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxtREFBNFE7RUFDNVEsNEJBQTRCO0VBQzVCLGtDQUFrQztFQUNsQyxnQ0FBZ0M7QUFDbEM7QUFDQTtFQUNFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLDZCQUE2QjtFQUM3Qix1QkFBdUI7RUFDdkIsYUFBYTtBQUNmOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixlQUFlO0VBQ2YsUUFBUTtFQUNSLHVCQUF1QjtFQUN2QixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLHVCQUF1QjtFQUN2QixXQUFXO0VBQ1gsZ0NBQWdDO0VBQ2hDLGVBQWU7RUFDZixpQkFBaUI7RUFDakIsZUFBZTtFQUNmLFNBQVM7RUFDVCxRQUFRO0VBQ1IsZ0NBQWdDO0VBQ2hDLHVCQUF1QjtFQUN2QixzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGVBQWU7RUFDZixNQUFNO0VBQ04sU0FBUztFQUNULE9BQU87RUFDUCxRQUFRO0VBQ1IsV0FBVztFQUNYLFlBQVk7RUFDWiw4QkFBOEI7RUFDOUIsMEJBQTBCO0VBQzFCLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGFBQWE7QUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmJ1bm55Lm5ldC9jc3M/ZmFtaWx5PWJsYWNrLW9wcy1vbmU6NDAwKTtcXG5cXG4qIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcblxcbiAgZm9udC1mYW1pbHk6IFxcXCJCbGFjayBPcHMgT25lXFxcIiwgZGlzcGxheTtcXG59XFxuXFxuaGVhZGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICBwYWRkaW5nOiAxcmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2M3YjdhMztcXG59XFxuXFxuYnV0dG9uLmJ0bi1wbGF5LFxcbmJ1dHRvbi5idG4tcmVzdGFydC1nYW1lIHtcXG4gIGZvbnQtc2l6ZTogbGFyZ2U7XFxuICBwYWRkaW5nLWlubGluZTogMXJlbTtcXG4gIGJvcmRlci13aWR0aDogNHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG59XFxuXFxubWFpbiB7XFxuICBtYXgtd2lkdGg6IDE0MDBweDtcXG4gIG1hcmdpbjogYXV0bztcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBhZGRpbmctYmxvY2s6IDJyZW07XFxuICBnYXA6IDJyZW07XFxuICBmbGV4LXdyYXA6IHdyYXAtcmV2ZXJzZTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmVpZ2U7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4uaGVhZGVyLXRpdGxlIHtcXG4gIGZvbnQ6IDEuNXJlbSBcXFwiQmxhY2sgT3BzIE9uZVxcXCIsIGRpc3BsYXk7XFxufVxcblxcbi5ncmlkLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZ2FwOiAycmVtO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5ncmlkIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMzVweCk7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMzVweCk7XFxufVxcblxcbi5hdmFpbGFibGUtc2hpcHMtY29udGFpbmVyIC5ncmlkIHtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDUsIDM1cHgpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMSwgMzVweCk7XFxufVxcblxcbi5jZWxsIHtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcXG59XFxuXFxuLmNlbGw6aG92ZXIsXFxuLmNlbGw6YWN0aXZlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjN2I3YTM7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGJsdWU7XFxufVxcblxcbi5jZWxsLnNlbGVjdGVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcXG59XFxuXFxuLnNob3Qge1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgdmVyc2lvbj0nMS4xJyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PHBhdGggZD0nTTEwMCAwIEwwIDEwMCAnIHN0cm9rZT0nYmxhY2snIHN0cm9rZS13aWR0aD0nMScvPjxwYXRoIGQ9J00wIDAgTDEwMCAxMDAgJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzEnLz48L3N2Zz5cXFwiKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxMDAlIDEwMCUsIGF1dG87XFxufVxcbi5zaG90LnNoaXAge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcbn1cXG5cXG4uZ2FtZS1pbmZvIHtcXG4gIG1heC13aWR0aDogMzAwcHg7XFxufVxcblxcbi5nYW1lLWluZm8tbWVzc2FnZSB7XFxuICBtYXJnaW4tdG9wOiAxcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBsaXN0LXN0eWxlOiBjaXJjbGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBuYXZham93aGl0ZTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbiAgcGFkZGluZzogMXJlbTtcXG59XFxuXFxuLmF2YWlsYWJsZS1zaGlwcy1jb250YWluZXIgLmNlbGw6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcXG59XFxuXFxuLmF2YWlsYWJsZS1zaGlwcy1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgZ2FwOiA1cHg7XFxuICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXG4gIHBhZGRpbmc6IDJyZW07XFxufVxcblxcbi5tb2RhbCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZ2FwOiAwLjRyZW07XFxuICB3aWR0aDogY2xhbXAoMThyZW0sIDEwdmgsIDIwcmVtKTtcXG4gIHBhZGRpbmc6IDEuM3JlbTtcXG4gIG1pbi1oZWlnaHQ6IDI1MHB4O1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgbGVmdDogNTAlO1xcbiAgdG9wOiA0MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcXG4gIGJvcmRlci1yYWRpdXM6IDE1cHg7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4ub3ZlcmxheSB7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB0b3A6IDA7XFxuICBib3R0b206IDA7XFxuICBsZWZ0OiAwO1xcbiAgcmlnaHQ6IDA7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTtcXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xcbiAgei1pbmRleDogMTtcXG59XFxuXFxuLmhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xuXG4gIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9XG5cbiAgLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5vcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4vZG9tXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcblxuY29uc3QgcGxheWVyID0gbmV3IFBsYXllcihcIlBsYXllclwiLCBmYWxzZSk7XG5jb25zdCBvcG9uZW50ID0gbmV3IFBsYXllcihcIkJvdFwiLCB0cnVlKTtcblxuY29uc3QgZ2FtZUNvbnRyb2xsZXIgPSBHYW1lQ29udHJvbGxlcihwbGF5ZXIsIG9wb25lbnQpO1xuZ2FtZUNvbnRyb2xsZXIubG9hZEdyaWRzKCk7XG5nYW1lQ29udHJvbGxlci5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG5cbmNvbnN0IHBsYWNlbWVudHMgPSBbXG4gIFszLCAxLCAzLCAyXSxcbiAgWzUsIDEsIDUsIDJdLFxuICBbMiwgNiwgNCwgNl0sXG4gIFs0LCA4LCA2LCA4XSxcbiAgWzYsIDQsIDksIDRdLFxuICBbMCwgMiwgMCwgNl0sXG5dO1xuXG5mdW5jdGlvbiBwbGFjZURlZmF1bHRTaGlwcygpIHtcbiAgcGxhY2VtZW50cy5mb3JFYWNoKChlKSA9PiB7XG4gICAgb3BvbmVudC5nYW1lYm9hcmQucGxhY2VTaGlwKGVbMF0sIGVbMV0sIGVbMl0sIGVbM10pO1xuICB9KTtcbiAgZ2FtZUNvbnRyb2xsZXIudXBkYXRlQXZhaWxhYmxlU2hpcHMoKTtcbiAgZ2FtZUNvbnRyb2xsZXIudXBkYXRlU2hpcHMoKTtcbn1cblxucGxhY2VEZWZhdWx0U2hpcHMoKTtcbiJdLCJuYW1lcyI6WyJjb21wYXJlQXJyYXkiLCJhcnJheTEiLCJhcnJheTIiLCJsZW5ndGgiLCJldmVyeSIsInZhbHVlIiwiaW5kZXgiLCJjcmVhdGVHcmlkIiwiU1RBVEVTIiwiU0hJUF9QTEFDRU1FTlQiLCJJTkdBTUUiLCJGSU5JU0hFRCIsIkdhbWVDb250cm9sbGVyIiwicGxheWVyMSIsInBsYXllcjIiLCJTVEFURSIsInN0YXJ0Q29vcmQiLCJ1bmRlZmluZWQiLCJsYXN0U2VsZWN0IiwiY3VycmVudFBsYXllciIsImxvYWRHcmlkcyIsInJlc2V0IiwiYXJndW1lbnRzIiwiZ3JpZENvbnRhaW5lciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImdyaWRQbGF5ZXIiLCJpZCIsImdyaWRPcG9uZW50IiwiYXBwZW5kIiwidXBkYXRlU2hpcHMiLCJ5IiwieCIsImdhbWVib2FyZCIsImJvYXJkIiwicGxheWVyR3JpZCIsImNlbGwiLCJ1cGRhdGVBdmFpbGFibGVTaGlwcyIsImF2YWlsYWJsZVNoaXBzIiwic2hpcHMiLCJhdmFpbGFibGVTaGlwc0NvbnRhaW5lciIsImZvckVhY2giLCJzaGlwIiwiaW5nYW1lIiwiZ3JpZCIsImkiLCJhcmVBbGxTaGlwc1BsYWNlZCIsInRleHRJbmZvIiwicGFyYWdyYXBoIiwic2V0dXBFdmVudExpc3RlbmVycyIsInBsYXllckJvYXJkIiwib3BvbmVudEJvYXJkIiwiZ2FtZUluZm9NZXNzYWdlIiwiaGFuZGxlUGxheWVyQm9hcmRDbGljayIsImUiLCJwbGFjaW5nWCIsInRhcmdldCIsImRhdGFzZXQiLCJ4cG9zIiwicGxhY2luZ1kiLCJ5cG9zIiwiY29uc29sZSIsImxvZyIsInBsYWNlU2hpcCIsInJlbW92ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdGFydEJ1dHRvbiIsImhhbmRsZVN0YXJ0Q2xpY2siLCJuYW1lIiwiaGFuZGxlT3BvbmVudEJvYXJkQ2xpY2siLCJzaG90WCIsInNob3RZIiwicGxheWVyR2FtZWJvYXJkIiwiY29udGFpbnMiLCJyZWNlaXZlQXR0YWNrIiwiYXJlQWxsU2hpcHNTdW5rIiwidG9nZ2xlUmVzdGFydFNjcmVlbiIsImlzQm90IiwiYXZhaWxhYmxlQ29vcmRpbmF0ZXMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJyZXN0YXJ0QnV0dG9uIiwiaGFuZGxlUmVzdGFydEJ1dHRvbkNsaWNrIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJ3aW5uZXJOYW1lIiwicmVzdGFydE1vZGFsIiwib3ZlcmxheSIsInRvZ2dsZSIsIlNoaXAiLCJHYW1lYm9hcmQiLCJjb25zdHJ1Y3RvciIsImdlbmVyYXRlQm9hcmQiLCJzaGlwc09uQm9hcmQiLCJzdGFydFgiLCJzdGFydFkiLCJlbmRYIiwiZW5kWSIsInZhbGlkYXRlQ29vcmRzIiwiY29vcmRzUGxhY2UiLCJpc0hvcml6b250YWwiLCJzdGF0aWNSZWYiLCJzdGFydFJlZiIsIm1pbiIsImVuZFJlZiIsIm1heCIsInNoaXBMZW5ndGgiLCJnZXRBdmFpbGFibGVTaGlwIiwiRXJyb3IiLCJyZWYiLCJwdXNoIiwiaGl0VHdpY2UiLCJzb21lIiwiZmlsdGVyIiwidiIsImhpdCIsInMiLCJpc1N1bmsiLCIjZ2V0QXZhaWxhYmxlU2hpcCIsInNpemUiLCIjZ2VuZXJhdGVCb2FyZCIsInJvdyIsImNvbCIsIiN2YWxpZGF0ZUNvb3JkcyIsIl9sZW4iLCJjb29yZHMiLCJBcnJheSIsIl9rZXkiLCJtYXAiLCJhcHBlbmRDaGlsZCIsIlBsYXllciIsImhpdHMiLCJwbGF5ZXIiLCJvcG9uZW50IiwiZ2FtZUNvbnRyb2xsZXIiLCJwbGFjZW1lbnRzIiwicGxhY2VEZWZhdWx0U2hpcHMiXSwic291cmNlUm9vdCI6IiJ9