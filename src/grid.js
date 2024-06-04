export default function createGrid() {
  const grid = document.createElement("div");
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }

  return grid;
}
