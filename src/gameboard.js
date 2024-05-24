import Ship from "./ship";

export default class Gameboard {
  constructor() {
    this.board = this.#generateBoard();
    this.ships = [
      new Ship(2),
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];

    this.attackTries = [];
  }

  placeShip(startX, startY, endX, endY) {
    this.#validateCoords(startX, startY, endX, endY);

    const isHorizontal = startX === endX;
    const staticRef = isHorizontal ? startX : startY;

    const startRef = isHorizontal
      ? Math.min(startY, endY)
      : Math.min(startX, endX);
    const endRef = isHorizontal
      ? Math.max(startY, endY)
      : Math.max(startX, endX);

    const shipLength = endRef - startRef + 1;
    const ship = this.#getAvailableShip(shipLength);

    if (!ship) throw new Error("Unavailable ship");

    for (let ref = startRef; ref <= endRef; ref++) {
      if (isHorizontal) {
        if (!!this.board[ref][staticRef])
          throw Error("This ship is overlapping another one");
        this.board[ref][staticRef] = ship;
      } else {
        if (!!this.board[staticRef][ref])
          throw Error("This ship is overlapping another one");
        this.board[staticRef][ref] = ship;
      }
    }
  }

  receiveAttack(x, y) {
    this.#validateCoords(x, y);

    const ship = this.board[y][x];
    const hitTwice = this.attackTries.some((e) => {
      return e[0] === x && e[1] === y;
    });

    if (hitTwice || !ship) return false;
    else {
      ship.hit();
      this.attackTries.push([x, y]);

      return true;
    }
  }

  areAllShipsSunk() {
    return this.ships.every((s) => s.isSunk());
  }

  #getAvailableShip(size) {
    for (let i in this.ships) {
      const ship = this.ships[i];

      if (ship.length === size && !ship.ingame) {
        ship.ingame = true;

        return ship;
      }
    }

    return null;
  }

  #generateBoard() {
    const board = [];
    for (let row = 0; row < 10; row++) {
      board[row] = [];
      for (let col = 0; col < 10; col++) {
        board[row][col] = 0;
      }
    }

    return board;
  }

  #validateCoords(...coords) {
    [...coords].map((e) => {
      if (e > 9 || e < 0) throw new Error("Coordinate is out of bounds");
    });
  }
}
