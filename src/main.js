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
};

// const shipSizes = [1, 1, 2, 2, 3, 3, 4];

function createCells(parentElement) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      bindEventListenerToGridCell(cell, i, j);
      parentElement.appendChild(cell);
    }
  }
}

cellContainer.addEventListener("mouseenter", () => {
  const ship = dragData.draggables[dragData.current].shipElementObject;
  if (dragData.isThereAnElementGettingDragged) ship.style.display = "none";
});

cellContainer.addEventListener("mouseout", () => {
  const ship = dragData.draggables[dragData.current].shipElementObject;
  if (dragData.isThereAnElementGettingDragged) ship.style.display = "block";
});

function bindEventListenerToGridCell(cell, i, j) {
  cell.addEventListener("mouseenter", (e) => {
    if (dragData.isThereAnElementGettingDragged) {
      const newJ = j + dragData.distanceFromMiddlePoint;
      const ship = dragData.draggables[dragData.current].shipElementObject;
      console.log(ship);
      console.log(`cell : ${i}, ${j}`);

      // if (board.receiveAttack(dragData.current, i, newJ)) {
      //   console.log("placeship success");
      // }
    }
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
  console.log(dragData);
});

document.addEventListener("mousemove", (e) => {
  if (dragData.isThereAnElementGettingDragged) {
    const ship = dragData.draggables[dragData.current].shipElementObject;
    let newX = dragData.startX - e.clientX;
    let newY = dragData.startY - e.clientY;

    dragData.startX = e.clientX;
    dragData.startY = e.clientY;

    ship.style.display = "none";
    ship.style.left = `${ship.offsetLeft - newX}px`;
    ship.style.top = `${ship.offsetTop - newY}px`;
  }
});

document.addEventListener("mouseup", () => {
  dragData.isThereAnElementGettingDragged = false;
  dragData.current = null;
  dragData.startX = null;
  dragData.startY = null;

  console.log(dragData);
});

board.initGameBoard();
board.printGameBoard();
createShip(0, 1);

createCells(cellContainer);
