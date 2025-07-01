import "./styles.css";
import { board } from "./script.js";

const GRID_SIZE = 8;
const cellContainer = document.querySelector(".cell-container");
const body = document.querySelector("body");

const dragData = {
  draggables: [],
  isThereAnElementGettingDragged: false,
  current: null,
  distanceFromMiddlePoint: null,
  startX: null,
  startY: null,
  iPosition: null,
  jPosition: null,

  getShip: function () {
    if (this.current === null) return;
    return this.draggables[this.current].shipElementObject;
  },
};

const cell2dArray = [];

// const shipSizes = [1, 1, 2, 2, 3, 3, 4];

function renderOriginalGrid() {
  const grid = board.getGrid();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const color = encodeToColor(grid[i][j]);
      const cell = cell2dArray[i][j];
      cell.style.background = color;
    }
  }
}

function renderTempNewGrid(renderInstructions) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const color = encodeToColor(renderInstructions[i][j]);
      const cell = cell2dArray[i][j];
      cell.style.background = color;
    }
  }
}

function encodeToColor(input) {
  if (typeof input === "object") return "green";
  if (input === -1) return "red";
  return "white";
}

function createCells(parentElement) {
  for (let i = 0; i < GRID_SIZE; i++) {
    const tempArray = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement("div");
      tempArray.push(cell);
      cell.classList.add("cell");
      bindEventListenerToGridCell(cell, i, j);
      parentElement.appendChild(cell);
    }

    cell2dArray.push(tempArray);
  }
}

function bindEventListenerToGridCell(cell, iPosition, jPosition) {
  let isShipOnTopOfCell = false;

  cell.addEventListener("mouseenter", (e) => {
    if (!dragData.isThereAnElementGettingDragged) return;
    console.log(`cell : ${iPosition}, ${jPosition}`);
    isShipOnTopOfCell = true;
    dragData.iPosition = iPosition;
    dragData.jPosition = jPosition + dragData.distanceFromMiddlePoint;
    const shipElementObject = dragData.getShip();
    shipElementObject.style.visibility = "hidden";
    const renderInstructions = board.placeShipDragOn(
      dragData.current,
      dragData.iPosition,
      dragData.jPosition,
    );
    console.table(renderInstructions);
    renderInstructions === null
      ? renderOriginalGrid()
      : renderTempNewGrid(renderInstructions);
  });

  cell.addEventListener("mouseout", (e) => {
    if (!dragData.isThereAnElementGettingDragged) return;

    isShipOnTopOfCell = false;
    dragData.getShip().style.visibility = "visible";
    renderOriginalGrid();
  });

  cell.addEventListener("mouseup", (e) => {
    if (!isShipOnTopOfCell) return;

    dragData.iPosition = iPosition;
    dragData.jPosition = jPosition + dragData.distanceFromMiddlePoint;

    board.placeShipDropped(
      dragData.current,
      dragData.iPosition,
      dragData.jPosition,
    );
    board.refreshGameBoard();
    board.printGameBoard();

    renderOriginalGrid();
  });

  cell.addEventListener("mousedown", () => {
  
    const positionData = board.getPositionData(iPosition, jPosition); 
    if(!positionData.positionOccupied) return;
    dragData.isThereAnElementGettingDragged = true;
    dragData.current = positionData.shipNumber;
    dragData.distanceFromMiddlePoint = positionData.distanceFromMiddlePoint;
    board.removeShipDragOn(dragData.current);
    board.refreshGameBoard();
    renderOriginalGrid();
    board.printGameBoard();
  });

}

function createShip(shipNumber, shipLength) {
  const ship = document.createElement("div");
  ship.classList.add("ship");

  let distanceFromMiddlePoint = Math.trunc(shipLength / 2);
  for (let i = 0; i < shipLength; i++) {
    const shipSection = document.createElement("div");
    shipSection.classList.add("ship-section");

    bindEventListenerToShipSection(
      ship,
      shipNumber,
      shipSection,
      distanceFromMiddlePoint,
    );
    distanceFromMiddlePoint -= 1;

    ship.appendChild(shipSection);
  }

  body.appendChild(ship);
  dragData.draggables.push({
    isPlaced: false,
    shipElementObject: ship,
  });
}

function bindEventListenerToShipSection(
  ship,
  shipNumber,
  shipSection,
  distanceFromMiddlePoint,
) {
  shipSection.addEventListener("mousedown", () => {
    dragData.distanceFromMiddlePoint = distanceFromMiddlePoint;
    dragData.current = shipNumber;
    dragData.isThereAnElementGettingDragged = true;
  });
}

document.addEventListener("mousedown", (e) => {
  dragData.startX = e.clientX;
  dragData.startY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
  if (!dragData.isThereAnElementGettingDragged) return;
  const ship = dragData.draggables[dragData.current].shipElementObject;
  let newX = dragData.startX - e.clientX;
  let newY = dragData.startY - e.clientY;

  dragData.startX = e.clientX;
  dragData.startY = e.clientY;

  ship.style.left = `${ship.offsetLeft - newX}px`;
  ship.style.top = `${ship.offsetTop - newY}px`;
  
});

document.addEventListener("mouseup", () => {
  dragData.isThereAnElementGettingDragged = false;
  dragData.current = null;
  dragData.startX = null;
  dragData.startY = null;
});

board.initGameBoard();
board.printGameBoard();
createShip(0, 4);
createShip(1, 1);

createCells(cellContainer);
