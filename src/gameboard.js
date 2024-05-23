import Ship from "./ship";

export default class Gameboard {
  constructor() {
    this.board = this.#generateBoard();
    this.availableShipsSizes = [2, 2, 3, 3, 4, 5];
  }

  placeShip(startX, startY, endX, endY) {
    [startX, startY, endX, endY].map((e) => {
      if (e > 9 || e < 0) throw new Error("Coordinate is out of bounds");
    });

    const isHorizontal = startX === endX;
    const staticRef = isHorizontal ? startX : startY;

    const startRef = isHorizontal
      ? Math.min(startY, endY)
      : Math.min(startX, endX);
    const endRef = isHorizontal
      ? Math.max(startY, endY)
      : Math.max(startX, endX);

    const shipLength = endRef - startRef + 1;
    if (!this.availableShipsSizes.includes(shipLength))
      throw new Error("Unavailable ship");

    const ship = new Ship(shipLength);
    this.#removeShip(shipLength)

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

  #removeShip(size) {
    if (this.availableShipsSizes.includes(size)) {
      const index = this.availableShipsSizes.indexOf(size)
      this.availableShipsSizes.splice(index, 1);
    }
  }
}
