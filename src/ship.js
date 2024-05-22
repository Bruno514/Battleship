export default class Ship {
  #hits;

  constructor(length) {
    this.length = length;
    this.#hits = 0;
  }

  hit() {
    this.#hits = this.#hits + 1;
  }

  isSunk() {
    return this.#hits >= this.length;
  }
}
