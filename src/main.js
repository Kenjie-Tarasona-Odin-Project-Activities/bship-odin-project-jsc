import "./styles.css";
import { board } from "./script.js";

const GRID_SIZE = 8;
const cellContainer = document.querySelector(".cell-container");
const body = document.querySelector("body");

const dragData = {
  draggables: [],
  unplacedShipGettingDragged: false,
  placedShipGettingDragged: false,
  shipNumber: null,
  distanceFromMiddlePoint: null,
  startX: null,
  startY: null,
  iPosition: null,
  jPosition: null,
  outsideGrid: false,
  isHorizontal: true,

  getShip: function () {
    if (this.shipNumber === null) return;
    return this.draggables[this.shipNumber];
  },
};

const cell2dArray = [];

function renderGrid(grid) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const color = encodeToColor(grid[i][j]);
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
  let isPlaced = false;

  cell.addEventListener("mouseenter", () => {

    if (dragData.unplacedShipGettingDragged){
      dragData.getShip().style.visibility = "hidden";
      isPlaced = board.placeShip(dragData.shipNumber, iPosition, jPosition + dragData.distanceFromMiddlePoint);
      isPlaced ? renderGrid(board.getTempGrid()) : renderGrid(board.getGrid());
      return;
    };

    if(dragData.placedShipGettingDragged){
      // Update for ship rotation
      dragData.outsideGrid = false;
      isPlaced = board.movePlacedShip(dragData.shipNumber, iPosition, jPosition + dragData.distanceFromMiddlePoint);
      isPlaced ? renderGrid(board.getTempGrid()) : renderGrid(board.getGridCopy());
      return;
    }

  });

  cell.addEventListener("mouseout", () => {

    if(dragData.unplacedShipGettingDragged){
      dragData.getShip().style.visibility = "visible";
      renderGrid(board.getGrid());
      return;
    }

    if(dragData.placedShipGettingDragged){
      dragData.outsideGrid = true;
      renderGrid(board.getGridCopy());
    }

  });

  cell.addEventListener("mouseup", () => {

  
    if(!isPlaced){
      renderGrid(board.getGrid());
      return;
    } 

    // picking up and placing at the same place triggers rotation
    if(iPosition === dragData.iPosition && jPosition === dragData.jPosition){
      console.log("trigger rotation");
      return;  
    }

    if(dragData.unplacedShipGettingDragged || dragData.placedShipGettingDragged){
      board.updateGrid();
      return;
    }

  });

  // for picking up placed ship
  cell.addEventListener("mousedown", () => {

    const positionData = board.getPositionData(iPosition, jPosition);
    if(positionData === null) return;
    dragData.placedShipGettingDragged = true;
    dragData.shipNumber = positionData.shipNumber;
    dragData.distanceFromMiddlePoint = positionData.distanceFromMiddlePoint;
    dragData.isHorizontal = positionData.isHorizontal;
    dragData.iPosition = iPosition;
    dragData.jPosition = jPosition;
    dragData.isHorizontal = positionData.isHorizontal;
    console.log(dragData.isHorizontal);
    
    //change for orientation
    board.removeShip(dragData.shipNumber, iPosition, jPosition + dragData. distanceFromMiddlePoint);

  });
}

function createShip(shipNumber, shipLength) {
  const ship = document.createElement("div");
  ship.classList.add("ship");

  let distanceFromMiddlePoint = Math.trunc(shipLength / 2);
  for (let i = 0; i < shipLength; i++) {
    const shipSection = document.createElement("div");
    shipSection.classList.add("ship-section");

    bindEventListenerToShipSection(shipNumber, shipSection, distanceFromMiddlePoint);
    distanceFromMiddlePoint -= 1;
    ship.appendChild(shipSection);

  }

  body.appendChild(ship);
  dragData.draggables.push(ship);

}

function bindEventListenerToShipSection(shipNumber, shipSection, distanceFromMiddlePoint) {
  shipSection.addEventListener("mousedown", e => {
    dragData.unplacedShipGettingDragged = true;
    dragData.distanceFromMiddlePoint = distanceFromMiddlePoint;
    dragData.shipNumber = shipNumber;
    dragData.startX = e.clientX;
    dragData.startY = e.clientY;
    document.addEventListener("mouseup", resetDragData);
  });
  
}

document.addEventListener("mousemove", e => {
  if (!dragData.unplacedShipGettingDragged) return;
  const ship = dragData.getShip()

  let newX = dragData.startX - e.clientX;
  let newY = dragData.startY - e.clientY;

  dragData.startX = e.clientX;
  dragData.startY = e.clientY;

  ship.style.left = `${ship.offsetLeft - newX}px`;
  ship.style.top = `${ship.offsetTop - newY}px`;
  
});

function resetDragData(){

  if(dragData.placedShipGettingDragged && dragData.outsideGrid){
    renderGrid(board.getGrid());
  }

  dragData.unplacedShipGettingDragged = false;
  dragData.placedShipGettingDragged = false;
  dragData.shipNumber = null;
  dragData.startX = null;
  dragData.startY = null;
  dragData.isHorizontal = true;
}

board.initGameBoard();
createShip(0, 4);
createShip(1, 1);
createCells(cellContainer);