import createGrid from "./grid";

function domController() {
  const body = document.querySelector("body");

  const setup = () => {
    _loadHeader();

    const main = document.createElement("main");
    body.appendChild(main);
  };

  const loadGrids = () => {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    const gridPlayer = createGrid();
    gridPlayer.id = "player-grid";
    const gridOponent = createGrid();
    gridOponent.id = "oponent-grid";

    gridContainer.append(gridPlayer);
    gridContainer.append(gridOponent);

    document.querySelector("main").append(gridContainer);
  };

  const renderGrids = (playerGrid, oponentGrid) => {
    
  }

  const addEventListeners = () => {

  }

  const _loadHeader = () => {
    const header = document.createElement("header");
    const divName = document.createElement("div");

    divName.textContent = "Battleship";
    divName.classList.add("name");

    header.appendChild(divName);
    body.append(header);
  };

  return { setup, loadGrids };
}

export default domController;
