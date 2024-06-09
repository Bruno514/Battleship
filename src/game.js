export default class Game {
  static gameTypes = {
    BOT: "Bot",
    VERSUS: "Versus",
  };

  constructor(player1, player2) {
    this.players = {
      one: player1,
      oneScore: 0,
      two: player2,
      twoScore: 0,
    };

    this.gameType = undefined;

    this.turn = undefined;
    this.oponentTurn = undefined;
  }

  placeTurn(startX, startY, endX, endY) {
    if (this.turn.gameboard.areAllShipsPlaced()) {
      return false;
    }

    this.turn.gameboard.placeShip(startX, startY, endX, endY);
  }

  attackTurn(x, y) {
    this.oponentTurn.gameboard.receiveAttack(x, y);
  }

  checkWinner() {
    return this.turn.gameboard.areAllShipsSunk() ? this.oponentTurn : this.turn;
  }
}
