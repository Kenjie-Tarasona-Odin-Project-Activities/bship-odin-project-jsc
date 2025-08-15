import { ATTACK_UI, GRID_UI } from "./main.js";
import { Game } from "./gameLoop";

const local = {
  currentUser: 0,
  dragAndDropController:  {
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
  },
  main: document.querySelector("main"),
  lockButton: document.createElement("button"),
  vsp2Button: document.querySelector("#vsp2"),
  game: new Game(), 
  gridUI: null,
  playerAttackGrid: null,
}


function gameRequest(user, type, request, parameters = []){
  return local.game.request({user, type, request, parameters});
}

function appInit(){
  local.gridUI = new GRID_UI(local.main, local.dragAndDropController, gameRequest);
  local.playerAttackGrid = [
      new ATTACK_UI(0, local.main, isGameOver, gameRequest),
      new ATTACK_UI(1, local.main, isGameOver, gameRequest),
  ];

  document.addEventListener("mousemove", e => {
    if (!local.dragAndDropController.unplacedShipGettingDragged) return;
    const ship = local.dragAndDropController.getShip()

    let newX = local.dragAndDropController.startX - e.clientX;
    let newY = local.dragAndDropController.startY - e.clientY;

    local.dragAndDropController.startX = e.clientX;
    local.dragAndDropController.startY = e.clientY;

    ship.style.left = `${ship.offsetLeft - newX}px`;
    ship.style.top = `${ship.offsetTop - newY}px`;
    
  });

  document.addEventListener("mouseup", () => {
    
    if(local.dragAndDropController.placedShipGettingDragged && local.dragAndDropController.outsideGrid){
      local.gridUI.droppedOutsideGrid();
    }

    local.dragAndDropController.unplacedShipGettingDragged = false;
    local.dragAndDropController.placedShipGettingDragged = false;
    local.dragAndDropController.shipNumber = null;
    local.dragAndDropController.startX = null;
    local.dragAndDropController.startY = null;
    local.dragAndDropController.isHorizontal = true;
  });

  local.lockButton.addEventListener("click", e => {
  const lockSuccessful = gameRequest(local.currentUser, "placementUtils", "lockGrid");
  
  if(local.currentUser === 0 && lockSuccessful){
    local.currentUser = 1;
    console.log("lock successful");
    local.gridUI.updateCurrentUser();
    local.gridUI.clearGrid();
    local.gridUI.restoreShipPositions();
    return;
  }

  if(local.currentUser === 1 && lockSuccessful){
    local.gridUI.detachAllListeners();
    local.gridUI.removeShipsAndContainer();
    e.target.parentNode.removeChild(e.target);
    local.currentUser = 0;
    console.log("placement done");
    local.playerAttackGrid[local.currentUser].renderGrid();
    return;
  }

  console.log("lock failed");

  });

  local.lockButton.textContent = "Lock in";
  local.lockButton.classList.add("lock-button");
  local.game.start();
  local.main.appendChild(local.lockButton);
}

appInit();

function isGameOver(){
  let currentPlayerGrid = local.playerAttackGrid[local.currentUser];
  currentPlayerGrid.disablePtrEvents();
  local.currentUser = 1 - local.currentUser;
  const gameStatus = gameRequest(local.currentUser, "gameUtils", "isGameOver");
  console.log(`Game Status: ${gameStatus}`);
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
    const newPlayerGrid = local.playerAttackGrid[local.currentUser];
    newPlayerGrid.renderGrid();
  }, 2000);
  
}







