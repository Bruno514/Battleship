import Gameboard from "../src/gameboard";

test("check if gameboard is generated correctly", () => {
  const sampleBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const gameboard = new Gameboard();

  expect(gameboard.board).toEqual(sampleBoard);
});

test("check if ship is place correctly (horizontally following right)", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 2, 2);

  for (let i = 0; i <= 2; i++) {
    expect(gameboard.board[i][2]).not.toBe(0);
  }
});

test("check if ship is place correctly (vertically following downwards)", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 4, 0);

  for (let i = 2; i <= 4; i++) {
    expect(gameboard.board[0][i]).not.toBe(0);
  }
});

test("check if ship is place correctly (horizontally following left)", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 2, 2, 0);

  for (let i = 0; i <= 2; i++) {
    expect(gameboard.board[i][2]).not.toBe(0);
  }
});

test("check if ship is place correctly (vertically following upwards)", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 4, 0);

  for (let i = 2; i <= 4; i++) {
    expect(gameboard.board[0][i]).not.toBe(0);
  }
});

test("gameboard throws an error for an out of bounds coordinate (1)", () => {
  const gameboard = new Gameboard();
  expect(() => {
    gameboard.placeShip(0, 12, 0, 10);
  }).toThrow("Coordinate is out of bounds");
});

test("gameboard throws an error for an out of bounds coordinate (2)", () => {
  const gameboard = new Gameboard();
  expect(() => {
    gameboard.placeShip(12, 0, 10, 0);
  }).toThrow("Coordinate is out of bounds");
});

test("gameboard throws an error for an out of bounds coordinate (3)", () => {
  const gameboard = new Gameboard();
  expect(() => {
    gameboard.placeShip(0, 10, 0, 12);
  }).toThrow("Coordinate is out of bounds");
});

test("gameboard throws an error for an out of bounds coordinate (4)", () => {
  const gameboard = new Gameboard();
  expect(() => {
    gameboard.placeShip(10, 0, 12, 0);
  }).toThrow("Coordinate is out of bounds");
});

test("tries to place ship on used coordinate", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 3, 0);

  expect(() => {
    gameboard.placeShip(3, 0, 4, 0);
  }).toThrow("This ship is overlapping another one");
});

// Available ships at the beginning: size 2 x 2, size 3 x 2, size 4 x 1, size 5 x 1
test("tries to place unavailable ship of length 4", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 5, 0);

  expect(() => {
    gameboard.placeShip(2, 1, 5, 1);
  }).toThrow("Unavailable ship");
});

test("tries to place unavailable ship of length 2", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 3, 0);
  gameboard.placeShip(2, 1, 3, 1);

  expect(() => {
    gameboard.placeShip(2, 2, 3, 2);
  }).toThrow("Unavailable ship");
});

test("attack a ship coordinate", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 3, 0);

  expect(gameboard.receiveAttack(3, 0)).toBe(true);
});

test("attack the same ship coordinate 2 times", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 3, 0);

  gameboard.receiveAttack(3, 0);
  expect(gameboard.receiveAttack(3, 0)).toBe(false);
});

test("miss attack", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 3, 0);

  expect(gameboard.receiveAttack(4, 0)).toBe(false);
});

test("attack with out bounds coordinate", () => {
  const gameboard = new Gameboard();
  gameboard.placeShip(2, 0, 3, 0);

  expect(() => {gameboard.receiveAttack(4, 0)}).toThrow("Coordinate is out of bounds");
});
