import Ship from "../src/ship";

test("sink ship of length 4", () => {
  const ship = new Ship(4);
  for (let i = 0; i < 4; i++) ship.hit();

  expect(ship.isSunk()).toBe(true);
});

test("check hitting 3 times a ship of length 4 does not sink it", () => {
  const ship = new Ship(4);
  for (let i = 0; i < 3; i++) ship.hit();

  expect(ship.isSunk()).toBe(false);
});
