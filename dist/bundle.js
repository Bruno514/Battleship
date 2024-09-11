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
    player.gameboard.placeShip(e[0], e[1], e[2], e[3]);
    oponent.gameboard.placeShip(e[0], e[1], e[2], e[3]);
  });
  gameController.updateAvailableShips();
  gameController.updateShips();
}
placeDefaultShips();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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L2JhdHRsZXNoaXAvLi9zcmMvY29tcGFyZUFycmF5cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dyaWQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBjb21wYXJlQXJyYXkgPSAoYXJyYXkxLCBhcnJheTIpID0+IHtcbiAgcmV0dXJuIChcbiAgICBhcnJheTEubGVuZ3RoID09PSBhcnJheTIubGVuZ3RoICYmXG4gICAgYXJyYXkxLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSBhcnJheTJbaW5kZXhdKVxuICApO1xufTtcbiIsImltcG9ydCBjcmVhdGVHcmlkIGZyb20gXCIuL2dyaWRcIjtcblxuY29uc3QgU1RBVEVTID0ge1xuICBTSElQX1BMQUNFTUVOVDogXCJTSElQX1BMQUNFTUVOVFwiLFxuICBJTkdBTUU6IFwiSU5HQU1FXCIsXG4gIEZJTklTSEVEOiBcIkZJTklTSEVEXCIsXG59O1xuXG5mdW5jdGlvbiBHYW1lQ29udHJvbGxlcihwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gIC8vIEdhbWUgc3RhdGVcbiAgbGV0IFNUQVRFID0gU1RBVEVTLlNISVBfUExBQ0VNRU5UO1xuXG4gIC8vIFZhcmlhYmxlcyBmb3Igc2hpcCBwbGFjZW1lbnRcbiAgbGV0IHN0YXJ0Q29vcmQgPSB1bmRlZmluZWQ7XG4gIGxldCBsYXN0U2VsZWN0ID0gdW5kZWZpbmVkO1xuXG4gIGxldCBjdXJyZW50UGxheWVyID0gcGxheWVyMTtcblxuICBjb25zdCBsb2FkR3JpZHMgPSAocmVzZXQgPSBmYWxzZSkgPT4ge1xuICAgIGxldCBncmlkQ29udGFpbmVyO1xuXG4gICAgaWYgKHJlc2V0KSB7XG4gICAgICBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5ncmlkLWNvbnRhaW5lclwiKTtcbiAgICAgIGdyaWRDb250YWluZXIudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGdyaWRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImdyaWQtY29udGFpbmVyXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGdyaWRQbGF5ZXIgPSBjcmVhdGVHcmlkKCk7XG4gICAgZ3JpZFBsYXllci5pZCA9IFwicGxheWVyLWdyaWRcIjtcbiAgICBjb25zdCBncmlkT3BvbmVudCA9IGNyZWF0ZUdyaWQoKTtcbiAgICBncmlkT3BvbmVudC5pZCA9IFwib3BvbmVudC1ncmlkXCI7XG5cbiAgICBncmlkQ29udGFpbmVyLmFwcGVuZChncmlkUGxheWVyKTtcbiAgICBncmlkQ29udGFpbmVyLmFwcGVuZChncmlkT3BvbmVudCk7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKS5hcHBlbmQoZ3JpZENvbnRhaW5lcik7XG4gICAgdXBkYXRlU2hpcHMoKTtcbiAgfTtcblxuICBjb25zdCB1cGRhdGVTaGlwcyA9ICgpID0+IHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDEwOyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykge1xuICAgICAgICBpZiAocGxheWVyMS5nYW1lYm9hcmQuYm9hcmRbeV1beF0pIHtcbiAgICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGF5ZXItZ3JpZFwiKTtcbiAgICAgICAgICBjb25zdCBjZWxsID0gcGxheWVyR3JpZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYFtkYXRhLXhwb3M9JyR7eH0nXVtkYXRhLXlwb3M9JyR7eX0nXWBcbiAgICAgICAgICApO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVBdmFpbGFibGVTaGlwcygpO1xuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZUF2YWlsYWJsZVNoaXBzID0gKCkgPT4ge1xuICAgIGNvbnN0IGF2YWlsYWJsZVNoaXBzID0gcGxheWVyMS5nYW1lYm9hcmQuc2hpcHM7XG4gICAgY29uc3QgYXZhaWxhYmxlU2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuYXZhaWxhYmxlLXNoaXBzLWNvbnRhaW5lclwiXG4gICAgKTtcblxuICAgIC8vIENsZWFyIGNvbnRhaW5lclxuICAgIGF2YWlsYWJsZVNoaXBzQ29udGFpbmVyLnRleHRDb250ZW50ID0gXCJcIjtcblxuICAgIGF2YWlsYWJsZVNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmICghc2hpcC5pbmdhbWUpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGdyaWQuY2xhc3NMaXN0LmFkZChcImdyaWRcIik7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiLCBcImNlbGxcIik7XG4gICAgICAgICAgZ3JpZC5hcHBlbmQoY2VsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBhdmFpbGFibGVTaGlwc0NvbnRhaW5lci5hcHBlbmQoZ3JpZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGxheWVyMS5nYW1lYm9hcmQuYXJlQWxsU2hpcHNQbGFjZWQoKSkge1xuICAgICAgY29uc3QgdGV4dEluZm8gPSBcIkFsbCBzaGlwcyBoYXZlIGJlZW4gcGxhY2VkXCI7XG4gICAgICBjb25zdCBwYXJhZ3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgIHBhcmFncmFwaC50ZXh0Q29udGVudCA9IHRleHRJbmZvO1xuXG4gICAgICBhdmFpbGFibGVTaGlwc0NvbnRhaW5lci5hcHBlbmQocGFyYWdyYXBoKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc2V0dXBFdmVudExpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyLWdyaWRcIik7XG4gICAgY29uc3Qgb3BvbmVudEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcG9uZW50LWdyaWRcIik7XG4gICAgY29uc3QgZ2FtZUluZm9NZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lLWluZm8tbWVzc2FnZVwiKTtcbiAgICB1cGRhdGVBdmFpbGFibGVTaGlwcygpO1xuXG4gICAgY29uc3QgaGFuZGxlUGxheWVyQm9hcmRDbGljayA9IChlKSA9PiB7XG4gICAgICBjb25zdCBwbGFjaW5nWCA9IGUudGFyZ2V0LmRhdGFzZXQueHBvcztcbiAgICAgIGNvbnN0IHBsYWNpbmdZID0gZS50YXJnZXQuZGF0YXNldC55cG9zO1xuXG4gICAgICBjb25zb2xlLmxvZygxKTtcbiAgICAgIGNvbnNvbGUubG9nKFNUQVRFKTtcbiAgICAgIGlmIChTVEFURSA9PT0gU1RBVEVTLlNISVBfUExBQ0VNRU5UKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFNUQVRFKTtcbiAgICAgICAgaWYgKHN0YXJ0Q29vcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHN0YXJ0Q29vcmQgPSBbcGxhY2luZ1gsIHBsYWNpbmdZXTtcblxuICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICBsYXN0U2VsZWN0ID0gZS50YXJnZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGxheWVyMS5nYW1lYm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAgICAgc3RhcnRDb29yZFswXSxcbiAgICAgICAgICAgIHN0YXJ0Q29vcmRbMV0sXG4gICAgICAgICAgICBwbGFjaW5nWCxcbiAgICAgICAgICAgIHBsYWNpbmdZXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHVwZGF0ZVNoaXBzKCk7XG5cbiAgICAgICAgICBsYXN0U2VsZWN0LmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcblxuICAgICAgICAgIGxhc3RTZWxlY3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgc3RhcnRDb29yZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVBsYXllckJvYXJkQ2xpY2spO1xuXG4gICAgY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ0bi1wbGF5XCIpO1xuICAgIGNvbnN0IGhhbmRsZVN0YXJ0Q2xpY2sgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyMS5nYW1lYm9hcmQuYXJlQWxsU2hpcHNQbGFjZWQoKSkge1xuICAgICAgICBTVEFURSA9IFNUQVRFUy5JTkdBTUU7XG4gICAgICAgIGdhbWVJbmZvTWVzc2FnZS50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0gdHVybmA7XG4gICAgICB9XG4gICAgfTtcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU3RhcnRDbGljayk7XG5cbiAgICBjb25zdCBoYW5kbGVPcG9uZW50Qm9hcmRDbGljayA9IChlKSA9PiB7XG4gICAgICBpZiAoU1RBVEUgPT09IFNUQVRFUy5JTkdBTUUpIHtcbiAgICAgICAgY29uc3QgW3Nob3RYLCBzaG90WV0gPSBbZS50YXJnZXQuZGF0YXNldC54cG9zLCBlLnRhcmdldC5kYXRhc2V0Lnlwb3NdO1xuICAgICAgICBjb25zdCBjZWxsID0gZS50YXJnZXQ7XG4gICAgICAgIGNvbnN0IHBsYXllckdhbWVib2FyZCA9IHBsYXllcjEuZ2FtZWJvYXJkO1xuXG4gICAgICAgIC8vIEJyZWFrIGlmIHRhcmdldCBpcyBub3QgYSBjZWxsIChjYXVzZSBpdHMgcG9zc2libGUgdG8gdHJpZ2dlciB0aGlzIGV2ZW50IGZyb20gdGhlIG1hcmdpbiBzby4uLilcbiAgICAgICAgaWYgKCFjZWxsLmNsYXNzTGlzdC5jb250YWlucyhcImNlbGxcIikpIHJldHVybjtcblxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaG90XCIpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHBsYXllcjIuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soc2hvdFgsIHNob3RZKSkge1xuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDaGVjayBmb3Igd2luXG4gICAgICAgICAgaWYgKHBsYXllcjIuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpKSB7XG4gICAgICAgICAgICBTVEFURSA9IFNUQVRFUy5GSU5JU0hFRDtcbiAgICAgICAgICAgIHRvZ2dsZVJlc3RhcnRTY3JlZW4oXCJZb3VcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgYm90LCB0aGVuIGxldCBpdCBwbGF5IGl0cyB0dXJuXG4gICAgICAgICAgaWYgKHBsYXllcjIuaXNCb3QgJiYgU1RBVEUgIT0gU1RBVEVTLkZJTklTSEVEKSB7XG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPVxuICAgICAgICAgICAgICBwbGF5ZXJHYW1lYm9hcmQuYXZhaWxhYmxlQ29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJHYW1lYm9hcmQuYXZhaWxhYmxlQ29vcmRpbmF0ZXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgcGxheWVyR2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICBgLmNlbGxbZGF0YS14cG9zPScke3h9J11bZGF0YS15cG9zPScke3l9J11gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hvdFwiKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllcjEuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpKSB7XG4gICAgICAgICAgICAgIFNUQVRFID0gU1RBVEVTLkZJTklTSEVEO1xuICAgICAgICAgICAgICB0b2dnbGVSZXN0YXJ0U2NyZWVuKFwiQm90XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIG9wb25lbnRCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlT3BvbmVudEJvYXJkQ2xpY2spO1xuXG4gICAgY29uc3QgcmVzdGFydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnRuLXJlc3RhcnQtZ2FtZVwiKTtcbiAgICBjb25zdCBoYW5kbGVSZXN0YXJ0QnV0dG9uQ2xpY2sgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfTtcbiAgICByZXN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVSZXN0YXJ0QnV0dG9uQ2xpY2spO1xuXG4gICAgY29uc3QgdG9nZ2xlUmVzdGFydFNjcmVlbiA9ICh3aW5uZXJOYW1lKSA9PiB7XG4gICAgICBjb25zdCByZXN0YXJ0TW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc3RhcnQtZ2FtZS1tb2RhbFwiKTtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm92ZXJsYXlcIik7XG4gICAgICByZXN0YXJ0TW9kYWwucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCJwXCJcbiAgICAgICkudGV4dENvbnRlbnQgPSBgJHt3aW5uZXJOYW1lfSB3b24hIFdhbm5hIHBsYXkgYWdhaW4/YDtcblxuICAgICAgcmVzdGFydE1vZGFsLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XG4gICAgICBvdmVybGF5LmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4geyBzZXR1cEV2ZW50TGlzdGVuZXJzLCBsb2FkR3JpZHMsIHVwZGF0ZUF2YWlsYWJsZVNoaXBzLCB1cGRhdGVTaGlwcyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQ29udHJvbGxlcjtcbiIsImltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcbmltcG9ydCB7IGNvbXBhcmVBcnJheSB9IGZyb20gXCIuL2NvbXBhcmVBcnJheXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgW3RoaXMuYm9hcmQsIHRoaXMuYXZhaWxhYmxlQ29vcmRpbmF0ZXNdID0gdGhpcy4jZ2VuZXJhdGVCb2FyZCgpO1xuICAgIHRoaXMuc2hpcHMgPSBbXG4gICAgICBuZXcgU2hpcCgyKSxcbiAgICAgIG5ldyBTaGlwKDIpLFxuICAgICAgbmV3IFNoaXAoMyksXG4gICAgICBuZXcgU2hpcCgzKSxcbiAgICAgIG5ldyBTaGlwKDQpLFxuICAgICAgbmV3IFNoaXAoNSksXG4gICAgXTtcblxuICAgIHRoaXMuc2hpcHNPbkJvYXJkID0gMDtcbiAgfVxuXG4gIHBsYWNlU2hpcChzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSkge1xuICAgIHRoaXMuI3ZhbGlkYXRlQ29vcmRzKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZKTtcbiAgICBjb25zdCBjb29yZHNQbGFjZSA9IFtdO1xuXG4gICAgY29uc3QgaXNIb3Jpem9udGFsID0gc3RhcnRZID09PSBlbmRZO1xuICAgIGNvbnN0IHN0YXRpY1JlZiA9IGlzSG9yaXpvbnRhbCA/IHN0YXJ0WSA6IHN0YXJ0WDtcblxuICAgIGNvbnN0IHN0YXJ0UmVmID0gaXNIb3Jpem9udGFsXG4gICAgICA/IE1hdGgubWluKHN0YXJ0WCwgZW5kWClcbiAgICAgIDogTWF0aC5taW4oc3RhcnRZLCBlbmRZKTtcblxuICAgIGNvbnN0IGVuZFJlZiA9IGlzSG9yaXpvbnRhbFxuICAgICAgPyBNYXRoLm1heChzdGFydFgsIGVuZFgpXG4gICAgICA6IE1hdGgubWF4KHN0YXJ0WSwgZW5kWSk7XG5cbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gZW5kUmVmIC0gc3RhcnRSZWYgKyAxO1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLiNnZXRBdmFpbGFibGVTaGlwKHNoaXBMZW5ndGgpO1xuXG4gICAgaWYgKCFzaGlwKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmF2YWlsYWJsZSBzaGlwXCIpO1xuXG4gICAgZm9yIChsZXQgcmVmID0gc3RhcnRSZWY7IHJlZiA8PSBlbmRSZWY7IHJlZisrKSB7XG4gICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XG4gICAgICAgIGlmICghIXRoaXMuYm9hcmRbc3RhdGljUmVmXVtyZWZdKVxuICAgICAgICAgIHRocm93IEVycm9yKFwiVGhpcyBzaGlwIGlzIG92ZXJsYXBwaW5nIGFub3RoZXIgb25lXCIpO1xuICAgICAgICB0aGlzLmJvYXJkW3N0YXRpY1JlZl1bcmVmXSA9IHNoaXA7XG4gICAgICAgIHNoaXAuaW5nYW1lID0gdHJ1ZTtcblxuICAgICAgICBjb29yZHNQbGFjZS5wdXNoKFtyZWYsIHN0YXRpY1JlZl0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEhdGhpcy5ib2FyZFtyZWZdW3N0YXRpY1JlZl0pXG4gICAgICAgICAgdGhyb3cgRXJyb3IoXCJUaGlzIHNoaXAgaXMgb3ZlcmxhcHBpbmcgYW5vdGhlciBvbmVcIik7XG4gICAgICAgIHRoaXMuYm9hcmRbcmVmXVtzdGF0aWNSZWZdID0gc2hpcDtcbiAgICAgICAgc2hpcC5pbmdhbWUgPSB0cnVlO1xuXG4gICAgICAgIGNvb3Jkc1BsYWNlLnB1c2goW3N0YXRpY1JlZiwgcmVmXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbLi4uY29vcmRzUGxhY2VdO1xuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayh4LCB5KSB7XG4gICAgdGhpcy4jdmFsaWRhdGVDb29yZHMoeCwgeSk7XG5cbiAgICBjb25zdCBzaGlwID0gdGhpcy5ib2FyZFt5XVt4XTtcbiAgICBjb25zdCBoaXRUd2ljZSA9IHRoaXMuYXZhaWxhYmxlQ29vcmRpbmF0ZXMuc29tZSgoZSkgPT4ge1xuICAgICAgcmV0dXJuIGVbMF0gPT0geCAmJiBlWzFdID09IHk7XG4gICAgfSk7XG5cbiAgICBpZiAoIWhpdFR3aWNlKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIlBsYWNlIGlzIGFscmVhZHkgaGl0XCIpO1xuICAgIH1cblxuICAgIHRoaXMuYXZhaWxhYmxlQ29vcmRpbmF0ZXMgPSB0aGlzLmF2YWlsYWJsZUNvb3JkaW5hdGVzLmZpbHRlcigodikgPT4ge1xuICAgICAgcmV0dXJuIHZbMF0gIT0geCB8fCB2WzFdICE9IHk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXNoaXApIHJldHVybiBmYWxzZTtcbiAgICBlbHNlIHtcbiAgICAgIHNoaXAuaGl0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhcmVBbGxTaGlwc1BsYWNlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pbmdhbWUpO1xuICB9XG5cbiAgYXJlQWxsU2hpcHNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBzLmV2ZXJ5KChzKSA9PiBzLmlzU3VuaygpKTtcbiAgfVxuXG4gICNnZXRBdmFpbGFibGVTaGlwKHNpemUpIHtcbiAgICBmb3IgKGxldCBpIGluIHRoaXMuc2hpcHMpIHtcbiAgICAgIGNvbnN0IHNoaXAgPSB0aGlzLnNoaXBzW2ldO1xuXG4gICAgICBpZiAoc2hpcC5sZW5ndGggPT09IHNpemUgJiYgIXNoaXAuaW5nYW1lKSB7XG4gICAgICAgIHJldHVybiBzaGlwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgI2dlbmVyYXRlQm9hcmQoKSB7XG4gICAgY29uc3QgYm9hcmQgPSBbXTtcbiAgICBjb25zdCBhdmFpbGFibGVDb29yZGluYXRlcyA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3crKykge1xuICAgICAgYm9hcmRbcm93XSA9IFtdO1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCsrKSB7XG4gICAgICAgIGJvYXJkW3Jvd11bY29sXSA9IDA7XG4gICAgICAgIGF2YWlsYWJsZUNvb3JkaW5hdGVzLnB1c2goW2NvbCwgcm93XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFtib2FyZCwgYXZhaWxhYmxlQ29vcmRpbmF0ZXNdO1xuICB9XG5cbiAgI3ZhbGlkYXRlQ29vcmRzKC4uLmNvb3Jkcykge1xuICAgIFsuLi5jb29yZHNdLm1hcCgoZSkgPT4ge1xuICAgICAgaWYgKGUgPiA5IHx8IGUgPCAwKSB0aHJvdyBuZXcgRXJyb3IoXCJDb29yZGluYXRlIGlzIG91dCBvZiBib3VuZHNcIik7XG4gICAgfSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUdyaWQoKSB7XG4gIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBncmlkLmNsYXNzTGlzdC5hZGQoXCJncmlkXCIpXG4gIGZvciAobGV0IHkgPSAwOyB5IDwgMTA7IHkrKykge1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjZWxsLmRhdGFzZXQueHBvcyA9IHg7XG4gICAgICBjZWxsLmRhdGFzZXQueXBvcyA9IHk7XG5cbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKGNlbGwpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBncmlkO1xufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSwgaXNCb3QpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMuaXNCb3QgPSBpc0JvdDtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gICNoaXRzO1xuXG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuI2hpdHMgPSAwO1xuICAgIHRoaXMuaW5nYW1lID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy4jaGl0cyA9IHRoaXMuI2hpdHMgKyAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLiNoaXRzID49IHRoaXMubGVuZ3RoO1xuICB9XG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz0lMjdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyUyNyB2ZXJzaW9uPSUyNzEuMSUyNyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSUyN25vbmUlMjcgdmlld0JveD0lMjcwIDAgMTAwIDEwMCUyNz48cGF0aCBkPSUyN00xMDAgMCBMMCAxMDAgJTI3IHN0cm9rZT0lMjdibGFjayUyNyBzdHJva2Utd2lkdGg9JTI3MSUyNy8+PHBhdGggZD0lMjdNMCAwIEwxMDAgMTAwICUyNyBzdHJva2U9JTI3YmxhY2slMjcgc3Ryb2tlLXdpZHRoPSUyNzElMjcvPjwvc3ZnPlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuYnVubnkubmV0L2Nzcz9mYW1pbHk9YmxhY2stb3BzLW9uZTo0MDApO1wiXSk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXG4gIGZvbnQtZmFtaWx5OiBcIkJsYWNrIE9wcyBPbmVcIiwgZGlzcGxheTtcbn1cblxuaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBwYWRkaW5nOiAxcmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzdiN2EzO1xufVxuXG5idXR0b24uYnRuLXBsYXksXG5idXR0b24uYnRuLXJlc3RhcnQtZ2FtZSB7XG4gIGZvbnQtc2l6ZTogbGFyZ2U7XG4gIHBhZGRpbmctaW5saW5lOiAxcmVtO1xuICBib3JkZXItd2lkdGg6IDRweDtcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcbn1cblxubWFpbiB7XG4gIG1heC13aWR0aDogMTQwMHB4O1xuICBtYXJnaW46IGF1dG87XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwYWRkaW5nLWJsb2NrOiAycmVtO1xuICBnYXA6IDJyZW07XG4gIGZsZXgtd3JhcDogd3JhcC1yZXZlcnNlO1xuICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcbiAgYmFja2dyb3VuZC1jb2xvcjogYmVpZ2U7XG4gIGhlaWdodDogMTAwdmg7XG59XG5cbi5oZWFkZXItdGl0bGUge1xuICBmb250OiAxLjVyZW0gXCJCbGFjayBPcHMgT25lXCIsIGRpc3BsYXk7XG59XG5cbi5ncmlkLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMnJlbTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5ncmlkIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDM1cHgpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMzVweCk7XG59XG5cbi5hdmFpbGFibGUtc2hpcHMtY29udGFpbmVyIC5ncmlkIHtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNSwgMzVweCk7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEsIDM1cHgpO1xufVxuXG4uY2VsbCB7XG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xufVxuXG4uY2VsbDpob3Zlcixcbi5jZWxsOmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNjN2I3YTM7XG59XG5cbi5zaGlwIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcbn1cblxuLmNlbGwuc2VsZWN0ZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG59XG5cbi5zaG90IHtcbiAgYmFja2dyb3VuZDogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IDEwMCUgMTAwJSwgYXV0bztcbn1cbi5zaG90LnNoaXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG59XG5cbi5nYW1lLWluZm8ge1xuICBtYXgtd2lkdGg6IDMwMHB4O1xufVxuXG4uZ2FtZS1pbmZvLW1lc3NhZ2Uge1xuICBtYXJnaW4tdG9wOiAxcmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgbGlzdC1zdHlsZTogY2lyY2xlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBuYXZham93aGl0ZTtcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XG4gIHBhZGRpbmc6IDFyZW07XG59XG5cbi5hdmFpbGFibGUtc2hpcHMtY29udGFpbmVyIC5jZWxsOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcbn1cblxuLmF2YWlsYWJsZS1zaGlwcy1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBnYXA6IDVweDtcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XG4gIHBhZGRpbmc6IDJyZW07XG59XG5cbi5tb2RhbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBnYXA6IDAuNHJlbTtcbiAgd2lkdGg6IGNsYW1wKDE4cmVtLCAxMHZoLCAyMHJlbSk7XG4gIHBhZGRpbmc6IDEuM3JlbTtcbiAgbWluLWhlaWdodDogMjUwcHg7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgbGVmdDogNTAlO1xuICB0b3A6IDQwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICBib3JkZXItcmFkaXVzOiAxNXB4O1xuICB6LWluZGV4OiAyO1xufVxuXG4ub3ZlcmxheSB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xuICB6LWluZGV4OiAxO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFFQTtFQUNFLFNBQVM7RUFDVCxVQUFVO0VBQ1Ysc0JBQXNCOztFQUV0QixxQ0FBcUM7QUFDdkM7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLGFBQWE7RUFDYix5QkFBeUI7QUFDM0I7O0FBRUE7O0VBRUUsZ0JBQWdCO0VBQ2hCLG9CQUFvQjtFQUNwQixpQkFBaUI7RUFDakIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLFlBQVk7RUFDWixhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsdUJBQXVCO0VBQ3ZCLHVCQUF1QjtFQUN2Qix1QkFBdUI7RUFDdkIsYUFBYTtBQUNmOztBQUVBO0VBQ0UscUNBQXFDO0FBQ3ZDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLFNBQVM7RUFDVCx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsdUNBQXVDO0VBQ3ZDLG9DQUFvQztBQUN0Qzs7QUFFQTtFQUNFLHNDQUFzQztFQUN0QyxtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRSx1QkFBdUI7RUFDdkIsc0JBQXNCO0FBQ3hCOztBQUVBOztFQUVFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLG1EQUE0UTtFQUM1USw0QkFBNEI7RUFDNUIsa0NBQWtDO0VBQ2xDLGdDQUFnQztBQUNsQztBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsNkJBQTZCO0VBQzdCLHVCQUF1QjtFQUN2QixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLGVBQWU7RUFDZixRQUFRO0VBQ1IsdUJBQXVCO0VBQ3ZCLGFBQWE7QUFDZjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLFdBQVc7RUFDWCxnQ0FBZ0M7RUFDaEMsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixlQUFlO0VBQ2YsU0FBUztFQUNULFFBQVE7RUFDUixnQ0FBZ0M7RUFDaEMsdUJBQXVCO0VBQ3ZCLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsVUFBVTtBQUNaOztBQUVBO0VBQ0UsZUFBZTtFQUNmLE1BQU07RUFDTixTQUFTO0VBQ1QsT0FBTztFQUNQLFFBQVE7RUFDUixXQUFXO0VBQ1gsWUFBWTtFQUNaLDhCQUE4QjtFQUM5QiwwQkFBMEI7RUFDMUIsVUFBVTtBQUNaOztBQUVBO0VBQ0UsYUFBYTtBQUNmXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuYnVubnkubmV0L2Nzcz9mYW1pbHk9YmxhY2stb3BzLW9uZTo0MDApO1xcblxcbioge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuXFxuICBmb250LWZhbWlseTogXFxcIkJsYWNrIE9wcyBPbmVcXFwiLCBkaXNwbGF5O1xcbn1cXG5cXG5oZWFkZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIHBhZGRpbmc6IDFyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzdiN2EzO1xcbn1cXG5cXG5idXR0b24uYnRuLXBsYXksXFxuYnV0dG9uLmJ0bi1yZXN0YXJ0LWdhbWUge1xcbiAgZm9udC1zaXplOiBsYXJnZTtcXG4gIHBhZGRpbmctaW5saW5lOiAxcmVtO1xcbiAgYm9yZGVyLXdpZHRoOiA0cHg7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbn1cXG5cXG5tYWluIHtcXG4gIG1heC13aWR0aDogMTQwMHB4O1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgcGFkZGluZy1ibG9jazogMnJlbTtcXG4gIGdhcDogMnJlbTtcXG4gIGZsZXgtd3JhcDogd3JhcC1yZXZlcnNlO1xcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBiZWlnZTtcXG4gIGhlaWdodDogMTAwdmg7XFxufVxcblxcbi5oZWFkZXItdGl0bGUge1xcbiAgZm9udDogMS41cmVtIFxcXCJCbGFjayBPcHMgT25lXFxcIiwgZGlzcGxheTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBnYXA6IDJyZW07XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmdyaWQge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAzNXB4KTtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAzNXB4KTtcXG59XFxuXFxuLmF2YWlsYWJsZS1zaGlwcy1jb250YWluZXIgLmdyaWQge1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNSwgMzVweCk7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxLCAzNXB4KTtcXG59XFxuXFxuLmNlbGwge1xcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xcbn1cXG5cXG4uY2VsbDpob3ZlcixcXG4uY2VsbDphY3RpdmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2M3YjdhMztcXG59XFxuXFxuLnNoaXAge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcXG59XFxuXFxuLmNlbGwuc2VsZWN0ZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcbn1cXG5cXG4uc2hvdCB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB2ZXJzaW9uPScxLjEnIHByZXNlcnZlQXNwZWN0UmF0aW89J25vbmUnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48cGF0aCBkPSdNMTAwIDAgTDAgMTAwICcgc3Ryb2tlPSdibGFjaycgc3Ryb2tlLXdpZHRoPScxJy8+PHBhdGggZD0nTTAgMCBMMTAwIDEwMCAnIHN0cm9rZT0nYmxhY2snIHN0cm9rZS13aWR0aD0nMScvPjwvc3ZnPlxcXCIpO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMCUgMTAwJSwgYXV0bztcXG59XFxuLnNob3Quc2hpcCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxufVxcblxcbi5nYW1lLWluZm8ge1xcbiAgbWF4LXdpZHRoOiAzMDBweDtcXG59XFxuXFxuLmdhbWUtaW5mby1tZXNzYWdlIHtcXG4gIG1hcmdpbi10b3A6IDFyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGxpc3Qtc3R5bGU6IGNpcmNsZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IG5hdmFqb3doaXRlO1xcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxuICBwYWRkaW5nOiAxcmVtO1xcbn1cXG5cXG4uYXZhaWxhYmxlLXNoaXBzLWNvbnRhaW5lciAuY2VsbDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibHVlO1xcbn1cXG5cXG4uYXZhaWxhYmxlLXNoaXBzLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBnYXA6IDVweDtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbiAgcGFkZGluZzogMnJlbTtcXG59XFxuXFxuLm1vZGFsIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBnYXA6IDAuNHJlbTtcXG4gIHdpZHRoOiBjbGFtcCgxOHJlbSwgMTB2aCwgMjByZW0pO1xcbiAgcGFkZGluZzogMS4zcmVtO1xcbiAgbWluLWhlaWdodDogMjUwcHg7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICBsZWZ0OiA1MCU7XFxuICB0b3A6IDQwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xcbiAgYm9yZGVyLXJhZGl1czogMTVweDtcXG4gIHotaW5kZXg6IDI7XFxufVxcblxcbi5vdmVybGF5IHtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIHRvcDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIGxlZnQ6IDA7XFxuICByaWdodDogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjUpO1xcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDJweCk7XFxuICB6LWluZGV4OiAxO1xcbn1cXG5cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcbm9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi9kb21cIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xuXG5jb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKFwiUGxheWVyXCIsIGZhbHNlKTtcbmNvbnN0IG9wb25lbnQgPSBuZXcgUGxheWVyKFwiQm90XCIsIHRydWUpO1xuXG5jb25zdCBnYW1lQ29udHJvbGxlciA9IEdhbWVDb250cm9sbGVyKHBsYXllciwgb3BvbmVudCk7XG5nYW1lQ29udHJvbGxlci5sb2FkR3JpZHMoKTtcbmdhbWVDb250cm9sbGVyLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcblxuY29uc3QgcGxhY2VtZW50cyA9IFtcbiAgWzMsIDEsIDMsIDJdLFxuICBbNSwgMSwgNSwgMl0sXG4gIFsyLCA2LCA0LCA2XSxcbiAgWzQsIDgsIDYsIDhdLFxuICBbNiwgNCwgOSwgNF0sXG4gIFswLCAyLCAwLCA2XSxcbl07XG5cbmZ1bmN0aW9uIHBsYWNlRGVmYXVsdFNoaXBzKCkge1xuICBwbGFjZW1lbnRzLmZvckVhY2goKGUpID0+IHtcbiAgICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChlWzBdLCBlWzFdLCBlWzJdLCBlWzNdKTtcblxuICAgIG9wb25lbnQuZ2FtZWJvYXJkLnBsYWNlU2hpcChlWzBdLCBlWzFdLCBlWzJdLCBlWzNdKTtcbiAgfSk7XG4gIGdhbWVDb250cm9sbGVyLnVwZGF0ZUF2YWlsYWJsZVNoaXBzKCk7XG4gIGdhbWVDb250cm9sbGVyLnVwZGF0ZVNoaXBzKCk7XG59XG5cbnBsYWNlRGVmYXVsdFNoaXBzKCk7XG4iXSwibmFtZXMiOlsiY29tcGFyZUFycmF5IiwiYXJyYXkxIiwiYXJyYXkyIiwibGVuZ3RoIiwiZXZlcnkiLCJ2YWx1ZSIsImluZGV4IiwiY3JlYXRlR3JpZCIsIlNUQVRFUyIsIlNISVBfUExBQ0VNRU5UIiwiSU5HQU1FIiwiRklOSVNIRUQiLCJHYW1lQ29udHJvbGxlciIsInBsYXllcjEiLCJwbGF5ZXIyIiwiU1RBVEUiLCJzdGFydENvb3JkIiwidW5kZWZpbmVkIiwibGFzdFNlbGVjdCIsImN1cnJlbnRQbGF5ZXIiLCJsb2FkR3JpZHMiLCJyZXNldCIsImFyZ3VtZW50cyIsImdyaWRDb250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ0ZXh0Q29udGVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJncmlkUGxheWVyIiwiaWQiLCJncmlkT3BvbmVudCIsImFwcGVuZCIsInVwZGF0ZVNoaXBzIiwieSIsIngiLCJnYW1lYm9hcmQiLCJib2FyZCIsInBsYXllckdyaWQiLCJjZWxsIiwidXBkYXRlQXZhaWxhYmxlU2hpcHMiLCJhdmFpbGFibGVTaGlwcyIsInNoaXBzIiwiYXZhaWxhYmxlU2hpcHNDb250YWluZXIiLCJmb3JFYWNoIiwic2hpcCIsImluZ2FtZSIsImdyaWQiLCJpIiwiYXJlQWxsU2hpcHNQbGFjZWQiLCJ0ZXh0SW5mbyIsInBhcmFncmFwaCIsInNldHVwRXZlbnRMaXN0ZW5lcnMiLCJwbGF5ZXJCb2FyZCIsIm9wb25lbnRCb2FyZCIsImdhbWVJbmZvTWVzc2FnZSIsImhhbmRsZVBsYXllckJvYXJkQ2xpY2siLCJlIiwicGxhY2luZ1giLCJ0YXJnZXQiLCJkYXRhc2V0IiwieHBvcyIsInBsYWNpbmdZIiwieXBvcyIsImNvbnNvbGUiLCJsb2ciLCJwbGFjZVNoaXAiLCJyZW1vdmUiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhcnRCdXR0b24iLCJoYW5kbGVTdGFydENsaWNrIiwibmFtZSIsImhhbmRsZU9wb25lbnRCb2FyZENsaWNrIiwic2hvdFgiLCJzaG90WSIsInBsYXllckdhbWVib2FyZCIsImNvbnRhaW5zIiwicmVjZWl2ZUF0dGFjayIsImFyZUFsbFNoaXBzU3VuayIsInRvZ2dsZVJlc3RhcnRTY3JlZW4iLCJpc0JvdCIsImF2YWlsYWJsZUNvb3JkaW5hdGVzIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicmVzdGFydEJ1dHRvbiIsImhhbmRsZVJlc3RhcnRCdXR0b25DbGljayIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwid2lubmVyTmFtZSIsInJlc3RhcnRNb2RhbCIsIm92ZXJsYXkiLCJ0b2dnbGUiLCJTaGlwIiwiR2FtZWJvYXJkIiwiY29uc3RydWN0b3IiLCJnZW5lcmF0ZUJvYXJkIiwic2hpcHNPbkJvYXJkIiwic3RhcnRYIiwic3RhcnRZIiwiZW5kWCIsImVuZFkiLCJ2YWxpZGF0ZUNvb3JkcyIsImNvb3Jkc1BsYWNlIiwiaXNIb3Jpem9udGFsIiwic3RhdGljUmVmIiwic3RhcnRSZWYiLCJtaW4iLCJlbmRSZWYiLCJtYXgiLCJzaGlwTGVuZ3RoIiwiZ2V0QXZhaWxhYmxlU2hpcCIsIkVycm9yIiwicmVmIiwicHVzaCIsImhpdFR3aWNlIiwic29tZSIsImZpbHRlciIsInYiLCJoaXQiLCJzIiwiaXNTdW5rIiwiI2dldEF2YWlsYWJsZVNoaXAiLCJzaXplIiwiI2dlbmVyYXRlQm9hcmQiLCJyb3ciLCJjb2wiLCIjdmFsaWRhdGVDb29yZHMiLCJfbGVuIiwiY29vcmRzIiwiQXJyYXkiLCJfa2V5IiwibWFwIiwiYXBwZW5kQ2hpbGQiLCJQbGF5ZXIiLCJoaXRzIiwicGxheWVyIiwib3BvbmVudCIsImdhbWVDb250cm9sbGVyIiwicGxhY2VtZW50cyIsInBsYWNlRGVmYXVsdFNoaXBzIl0sInNvdXJjZVJvb3QiOiIifQ==