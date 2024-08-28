export default function createGrid() {
  const grid = document.createElement("div");
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
