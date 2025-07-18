import "./styles.css";
import {Game} from "./gameLoop.js";
import { Player } from "./script.js";

const cellContainer = document.querySelector(".cell-container");
const shipContainer = document.querySelector(".ship-container");
let currentUser = 0;
const main = document.querySelector("main");
const lock = document.createElement("button");

lock.textContent = "Lock in";
lock.classList.add("lock-button");

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

// vs player2 
const  vsp2Button = document.querySelector("#vsp2");


class GRID_UI{
  cell2dArray = [];
  GRID_SIZE = 8;
  SHIP_SIZES = [1, 1, 2, 2, 3, 3, 4];
  MAX_SHIPS = 7;
  cellHandlerReferences = [];
  shipSectionNodes = [];
  shipSectionHandlerReferences = [];

  constructor(){
    this.playerContainer = document.createElement("div"); 
    this.cellContainer = document.createElement("div");
    this.shipContainer = document.createElement("div");
    
    this.playerContainer.classList.add("player-container");
    this.cellContainer.classList.add("cell-container");
    this.shipContainer.classList.add("ship-container");

    this.createCells();
    this.createShips();

    this.playerContainer.appendChild(this.shipContainer);
    this.playerContainer.appendChild(this.cellContainer);

    main.appendChild(this.playerContainer);

  }
 
  createCells(){
    for (let i = 0; i < this.GRID_SIZE; i++) {
      const tempArray = [];
      const tempRefArray = [];
      for (let j = 0; j < this.GRID_SIZE; j++) {
        const cell = document.createElement("div");
        tempArray.push(cell);
        cell.classList.add("cell");
        const handlerReference = this.bindEventListenerToGridCell(cell, i, j);
        tempRefArray.push(handlerReference);
        this.cellContainer.appendChild(cell);
      }
      this.cell2dArray.push(tempArray);
      this.cellHandlerReferences.push(tempRefArray);
    }
  }

  bindEventListenerToGridCell(cell, iPosition, jPosition){
    let isPlaced = false;
    const handleDragInsideGrid = () => {
    
      if (dragData.unplacedShipGettingDragged){
        dragData.getShip().style.visibility = "hidden";
        isPlaced = game.request({
          user: currentUser,
          type: "placementUtils",
          request: "placeShip",
          parameters: [dragData.shipNumber, iPosition, jPosition + dragData.distanceFromMiddlePoint],
        })

        if(isPlaced){
          this.renderGrid(game.request({
          user: currentUser,
          type: "renderUtils",
          request: "getTempGrid",
          parameters: [],
          }));
        }else{
          this.renderGrid(game.request({
            user: currentUser,
            type: "renderUtils",
            request: "getGrid",
            parameters: [],
          }));
        }
        
        return;
      };

      if(dragData.placedShipGettingDragged){
        // Update for ship rotation
        console.log("placed");
        dragData.outsideGrid = false;
        
        if(dragData.isHorizontal){
          isPlaced = game.request({
            user: currentUser,
            type: "placementUtils",
            request: "movePlacedShip",
            parameters: [dragData.shipNumber, iPosition, jPosition + dragData.distanceFromMiddlePoint]
          })
        }else{
          isPlaced = game.request({
            user: currentUser,
            type: "placementUtils",
            request: "movePlacedShip",
            parameters: [dragData.shipNumber, iPosition + dragData.distanceFromMiddlePoint, jPosition]
          });
        }
        
        if(isPlaced){
          this.renderGrid(game.request({
            user: currentUser,
            type: "renderUtils",
            request: "getTempGrid",
            parameters: [],
          }));
        }else{
          this.renderGrid(game.request({
            user: currentUser,
            type: "renderUtils",
            request: "getGridWhereTheSelectedShipIsRemoved",
            parameters: [],
          }));
        }
      }
    }

    const handleDragOutsideGrid = () => {

      isPlaced = false;

      if(dragData.unplacedShipGettingDragged){
        dragData.getShip().style.visibility = "visible";
        this.renderGrid(game.request({
          user: currentUser,
          type: "renderUtils",
          request: "getGrid",
          parameters: [],
        }));
        return;
      }

      if(dragData.placedShipGettingDragged){
        dragData.outsideGrid = true;
        this.renderGrid(game.request({
          user: currentUser,
          type: "renderUtils",
          request: "getGridWhereTheSelectedShipIsRemoved",
          parameters: [],
        }));
      }

    }

    const handleCellMouseUp = () => {

    // picking up and placing at the same place triggers rotation
      if(dragData.placedShipGettingDragged && iPosition === dragData.iPosition && jPosition === dragData.jPosition){
        
        console.log("trigger rotation");
        let isRotationSuccessful;
        
        if(dragData.isHorizontal){
          isRotationSuccessful =  game.request({
            user: currentUser,
            type: "placementUtils",
            request: "rotatePlacedShip",
            parameters: [dragData.shipNumber, iPosition, jPosition + dragData.distanceFromMiddlePoint],
          });
        }else{
          isRotationSuccessful = game.request({
            user: currentUser,
            type: "placementUtils",
            request: "rotatePlacedShip",
            parameters: [dragData.shipNumber, iPosition + dragData.distanceFromMiddlePoint, jPosition],
          });
        }

        console.log(isRotationSuccessful);  
        if(isRotationSuccessful){
          this.renderGrid(game.request({
            user: currentUser,
            type: "renderUtils",
            request: "getTempGrid",
            parameters: [],
          }));
          game.request({
            user: currentUser,
            type: "placementUtils",
            request: "updateGrid",
            parameters: [],
          });
        }

        return;  
      }

      if(!isPlaced){
        this.renderGrid(game.request({
          user: currentUser,
          type: "renderUtils",
          request: "getGrid",
          parameters: [],
        }));
        return;
      } 

      if(dragData.unplacedShipGettingDragged || dragData.placedShipGettingDragged){
        game.request({
          user: currentUser,
          type: "placementUtils",
          request: "updateGrid",
          parameters: [],
        });

        isPlaced = false;
        return;
      }

    }

    const handleCellMouseDown = () => {
      const positionData = game.request({
        user: currentUser,
        type: "placementUtils",
        request: "getPositionData",
        parameters: [iPosition, jPosition]
      });
      
      console.log(positionData);
      if(positionData === null) return;
      dragData.placedShipGettingDragged = true;
      dragData.shipNumber = positionData.shipNumber;
      dragData.distanceFromMiddlePoint = positionData.distanceFromMiddlePoint;
      dragData.isHorizontal = positionData.isHorizontal;
      dragData.iPosition = iPosition;
      dragData.jPosition = jPosition;
      dragData.isHorizontal = positionData.isHorizontal;

      if(positionData.isHorizontal)
        game.request({
          user: currentUser,
          type: "placementUtils",
          request: "removeShip",
          parameters: [dragData.shipNumber, iPosition, jPosition + dragData.distanceFromMiddlePoint]
        });
      else
        game.request({
          user: currentUser,
          type: "placementUtils",
          request: "removeShip",
          parameters: [dragData.shipNumber, iPosition + dragData.distanceFromMiddlePoint, jPosition]
        });
    }

    cell.addEventListener("mouseenter", handleDragInsideGrid);
    cell.addEventListener("mouseout", handleDragOutsideGrid);
    cell.addEventListener("mouseup", handleCellMouseUp);
    cell.addEventListener("mousedown",handleCellMouseDown);

    return[
      handleDragInsideGrid,
      handleDragOutsideGrid, 
      handleCellMouseUp, 
      handleCellMouseDown
    ];

  }

  createShips() {

    let gap = 10;
    for(let i = 0; i < this.MAX_SHIPS; i++){
      const shipNumber = i;
      const shipLength = this.SHIP_SIZES[i];
      const ship = document.createElement("div");
      ship.classList.add("ship");
      let distanceFromMiddlePoint = Math.trunc(shipLength / 2);

      for (let j = 0; j < shipLength; j++) {
        const shipSection = document.createElement("div");
        shipSection.classList.add("ship-section");
        this.shipSectionNodes.push(shipSection);
        this.bindEventListenerToShipSection(shipNumber, shipSection, distanceFromMiddlePoint);
        distanceFromMiddlePoint -= 1;
        ship.appendChild(shipSection);
      }

      ship.style.top = `${gap}px`; 
      ship.style.left = "30px"; 
      gap += 85;
      this.playerContainer.appendChild(ship);
      dragData.draggables.push(ship);
    }

  }

  bindEventListenerToShipSection(shipNumber, shipSection, distanceFromMiddlePoint) {
    const handleShipSectionMouseDown = e => {
      dragData.unplacedShipGettingDragged = true;
      dragData.distanceFromMiddlePoint = distanceFromMiddlePoint;
      dragData.shipNumber = shipNumber;
      dragData.startX = e.clientX;
      dragData.startY = e.clientY;
    }
    shipSection.addEventListener("mousedown", handleShipSectionMouseDown);
    
    this.shipSectionHandlerReferences.push(handleShipSectionMouseDown);
  }

  renderGrid(grid){

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const color = encodeToColor(grid[i][j]);
        const cell = this.cell2dArray[i][j];
        cell.style.background = color;
      }
    }

  }

  clearGrid(){
    const newGrid = game.request({
      user: currentUser,
      type: "renderUtils",
      request: "getGrid"
    })

    this.renderGrid(newGrid);

  }

  removeNode(parent, child){
    parent.removeChild(child);
  }

  restoreShipPositions(){
    let gap = 15;

    const ships = dragData.draggables;

    ships.forEach(ship => {
      ship.style.visibility = "visible";
      ship.style.top = `${gap}px`;
      ship.style.left = "30px";
      gap += 85;
    });

  }

}

function encodeToColor(input) {
  if (typeof input === "object") return "green";
  if (input === -1) return "red";
  return "white";
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

document.addEventListener("mouseup", () => {
  
  if(dragData.placedShipGettingDragged && dragData.outsideGrid){
    grid.renderGrid(game.request({
      user: currentUser,
      type: "renderUtils",
      request: "getGrid",
      parameters: [],
    }));
  }

  dragData.unplacedShipGettingDragged = false;
  dragData.placedShipGettingDragged = false;
  dragData.shipNumber = null;
  dragData.startX = null;
  dragData.startY = null;
  dragData.isHorizontal = true;
});

const game = new Game();

game.start()

const grid = new GRID_UI();

main.appendChild(lock);
lock.addEventListener("click", () => {
  const lockSuccessful = game.request({
    user: currentUser,
    type: "placementUtils",
    request: "lockGrid",
    parameter: [],
  });
  
  if(currentUser === 0 && lockSuccessful){
    currentUser = 1;
    console.log("lock successful");
    grid.clearGrid();
    grid.restoreShipPositions();
    return;
  }

  if(currentUser === 1 && lockSuccessful){
    console.log("placement done");
    return;
  }

  console.log("lock failed");

});