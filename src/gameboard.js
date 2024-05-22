export default class Gameboard {
  constructor() {
    this.board = this.#generateBoard()
    this.availableShipsSizes = [2, 2, 3, 3, 4, 5]
  }

  #generateBoard() {
    const board = []
    for (let row = 0; row < 10; row++) {
      board[row] = [];
      for (let col = 0; col < 10; col++) {
        board[row][col] = 0
      }
    }

    return board
  }

  placeShip(coordinateStart, coordinateEnd, length) {

  }
}
