import Gameboard from "./gameboard";

export default class Player {
  constructor(name, isBot) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.isBot = isBot;
  }
}
