import { ATTACK_UI, GRID_UI } from "./main.js";
import { Game } from "./gameLoop";
let currentUser = 0;
const main = document.querySelector("main");
const lock = document.createElement("button");
lock.textContent = "Lock in";
lock.classList.add("lock-button");

const  vsp2Button = document.querySelector("#vsp2")

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

const game = new Game();
game.start();

const gameRequest = (user, type, request, parameters = []) => {
  return game.request({user, type, request, parameters});
}

const gridUI = new GRID_UI(main, dragData, gameRequest, currentUser);

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
    gridUI.droppedOutsideGrid();
  }

  dragData.unplacedShipGettingDragged = false;
  dragData.placedShipGettingDragged = false;
  dragData.shipNumber = null;
  dragData.startX = null;
  dragData.startY = null;
  dragData.isHorizontal = true;
});

main.appendChild(lock);

const isGameOver = () => {
  let currentPlayerGrid = playerAttackGrid[currentUser];
  const gameStatus = gameRequest(currentUser, "gameUtils", "isGameOver");
  
  switch(gameStatus){
    case 0:
      alert("Player 1 Wins");
      return;
    case 1:
      alert("Player 2 Wins");
      return;
    default:
      console.log("round continues");
  }

  setTimeout(() => {
    currentPlayerGrid.unrenderGrid();
    currentUser = 1 - currentUser;
    currentPlayerGrid = playerAttackGrid[currentUser];
    currentPlayerGrid.renderGrid();
  }, 5000);

   
}

const playerAttackGrid = [
  new ATTACK_UI(0, main, isGameOver, gameRequest),
  new ATTACK_UI(1, main, isGameOver, gameRequest),
];

lock.addEventListener("click", e => {
  const lockSuccessful = gameRequest(currentUser, "placementUtils", "lockGrid");
  
  if(currentUser === 0 && lockSuccessful){
    currentUser = 1;
    console.log("lock successful");
    gridUI.updateCurrentUser();
    gridUI.clearGrid();
    gridUI.restoreShipPositions();
    return;
  }

  if(currentUser === 1 && lockSuccessful){
    gridUI.detachAllListeners();
    gridUI.removeShipsAndContainer();
    e.target.parentNode.removeChild(e.target);
    currentUser = 1 - currentUser;
    console.log("placement done");
    playerAttackGrid[currentUser].renderGrid();
    return;
  }

  console.log("lock failed");

});

 







