import Ship from "./ship";
import { compareArray } from "./compareArrays";

export default class Gameboard {
  constructor() {
    [this.board, this.availableCoordinates] = this.#generateBoard();
    this.ships = [
      new Ship(2),
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];

    this.shipsOnBoard = 0;
  }

  placeShip(startX, startY, endX, endY) {
    this.#validateCoords(startX, startY, endX, endY);
    const coordsPlace = [];

    const isHorizontal = startY === endY;
    const staticRef = isHorizontal ? startY : startX;

    const startRef = isHorizontal
      ? Math.min(startX, endX)
      : Math.min(startY, endY);

    const endRef = isHorizontal
      ? Math.max(startX, endX)
      : Math.max(startY, endY);

    const shipLength = endRef - startRef + 1;
    const ship = this.#getAvailableShip(shipLength);

    if (!ship) throw new Error("Unavailable ship");

    for (let ref = startRef; ref <= endRef; ref++) {
      if (isHorizontal) {
        if (!!this.board[staticRef][ref])
          throw Error("This ship is overlapping another one");
        this.board[staticRef][ref] = ship;
        ship.ingame = true;

        coordsPlace.push([ref, staticRef]);
      } else {
        if (!!this.board[ref][staticRef])
          throw Error("This ship is overlapping another one");
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
    const hitTwice = this.availableCoordinates.some((e) => {
      return e[0] == x && e[1] == y;
    });

    if (!hitTwice) {
      throw Error("Place is already hit");
    }

    this.availableCoordinates = this.availableCoordinates.filter((v) => {
      return v[0] != x || v[1] != y;
    });

    if (!ship) return false;
    else {
      ship.hit();
      return true;
    }
  }

  areAllShipsPlaced() {
    return this.ships.every((ship) => ship.ingame);
  }

  areAllShipsSunk() {
    return this.ships.every((s) => s.isSunk());
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

  #validateCoords(...coords) {
    [...coords].map((e) => {
      if (e > 9 || e < 0) throw new Error("Coordinate is out of bounds");
    });
  }
}
