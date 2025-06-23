
import "./styles.css";

const numberOfCells = 64;
const cellContainer = document.querySelector(".cell-container");
const body = document.querySelector("body");
const dragData = {
    isThereAnElementGettingDragged: false,
    current: null,
    distanceFromMiddlePoint: null
}

// const shipSizes = [1, 1, 2, 2, 3, 3, 4];


function createCells(parentElement){

    for(let i = 0; i < numberOfCells; i++){

        const cell = document.createElement("div");
        cell.classList.add("cell");
        parentElement.appendChild(cell);
    }
}

function createShip(shipNumber, shipLength){
    const ship = document.createElement("div");
    ship.classList.add("ship");
    ship.addEventListener("mousedown", () => {
        dragData.isThereAnElementGettingDragged = true;
        dragData.current = shipNumber;
        console.log(dragData);
    });
    ship.addEventListener("mouseup", () => {
        dragData.isThereAnElementGettingDragged = false;
        dragData.current = null;
        console.log(dragData);

    });

    let distanceFromMiddlePoint = Math.trunc(shipLength / 2); 
    for(let i = 0; i < shipLength; i++){
        const shipSection = document.createElement("div");
        shipSection.classList.add("ship-section");
        bindEventListenerToShipSection(shipSection, distanceFromMiddlePoint);
        distanceFromMiddlePoint -= 1;
        console.log(shipSection);
        ship.appendChild(shipSection);
    }


    body.appendChild(ship);
}

function bindEventListenerToShipSection(shipSection, distanceFromMiddlePoint){
    shipSection.addEventListener("mousedown", () => {
        dragData.distanceFromMiddlePoint = distanceFromMiddlePoint; 
    });

    shipSection.addEventListener("mouseup", () => {
        dragData.distanceFromMiddlePoint = null; 
    });
}

createShip(1, 4);
createCells(cellContainer); 





