import "./styles.css";

class GRID_UI{
  cell2dArray = [];
  GRID_SIZE = 8;
  SHIP_SIZES = [1, 1, 2, 2, 3, 3, 4];
  MAX_SHIPS = 7;
  cellHandlerReferences = [];
  shipSectionNodes = [];
  shipSectionHandlerReferences = [];

  constructor(parentNode, dragData, gameRequest, currentUser){
    this.dragData = dragData;
    this.gameRequest = gameRequest;
    this.currentUser = currentUser;
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

    this.parentNode = parentNode;
    this.parentNode.appendChild(this.playerContainer);


  }

  removeShipsAndContainer(){
    this.parentNode.removeChild(this.playerContainer);
  }

  detachAllListeners(){
    
    for(let i = 0; i < this.GRID_SIZE; i++){
      for(let j = 0; j < this.GRID_SIZE; j++){

        const cell = this.cell2dArray[i][j];
        const handlers = this.cellHandlerReferences[i][j];
        cell.removeEventListener("mouseenter", handlers[0]);
        cell.removeEventListener("mouseout", handlers[1]);
        cell.removeEventListener("mouseup", handlers[2]);
        cell.removeEventListener("mousedown", handlers[3]);

      }
    }

    for(let i = 0; i < this.shipSectionNodes.length; i++){
      const shipSection = this.shipSectionNodes[i];
      console.log(shipSection);
    
      const handler = this.shipSectionHandlerReferences[i];
      shipSection.removeEventListener("mousedown", handler);
    }

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
    
      if (this.dragData.unplacedShipGettingDragged){
        this.dragData.getShip().style.visibility = "hidden";
        const parameters = [this.dragData.shipNumber, iPosition, jPosition + this.dragData.distanceFromMiddlePoint];
        isPlaced = this.gameRequest(this.currentUser, "placementUtils", "placeShip", parameters);

        if(isPlaced){
          const grid = this.gameRequest(this.currentUser, "renderUtils", "getTempGrid")
          this.renderGrid(grid);
        }else{
          const grid = this.gameRequest(this.currentUser, "renderUtils", "getGrid");
          this.renderGrid(grid);
        }
        
        return;
      };

      if(this.dragData.placedShipGettingDragged){
        // Update for ship rotation
        console.log("placed");
        this.dragData.outsideGrid = false;
        
        if(this.dragData.isHorizontal){
          const parameters = [this.dragData.shipNumber, iPosition, jPosition + this.dragData.distanceFromMiddlePoint];
          isPlaced = this.gameRequest(this.currentUser, "placementUtils", "movePlacedShip", parameters);
        }else{
          const parameters = [this.dragData.shipNumber, iPosition + this.dragData.distanceFromMiddlePoint, jPosition];
          isPlaced = this.gameRequest(this.currentUser, "placementUtils", "movePlacedShip", parameters,);
        }
        
        if(isPlaced){
          const grid = this.gameRequest(this.currentUser, "renderUtils", "getTempGrid")
          this.renderGrid(grid);
        }else{
          const grid = this.gameRequest(this.currentUser, "renderUtils", "getGridWhereTheSelectedShipIsRemoved")
          this.renderGrid(grid);
        }
      }
    }

    const handleDragOutsideGrid = () => {

      isPlaced = false;

      if(this.dragData.unplacedShipGettingDragged){
        this.dragData.getShip().style.visibility = "visible";
        const grid = this.gameRequest(this.currentUser, "renderUtils", "getGrid");
        this.renderGrid(grid);
        return;
      }

      if(this.dragData.placedShipGettingDragged){
        this.dragData.outsideGrid = true;
        const grid = this.gameRequest(this.currentUser, "renderUtils", "getGridWhereTheSelectedShipIsRemoved");
        this.renderGrid(grid);
      }

    }

    const handleCellMouseUp = () => {

    // picking up and placing at the same place triggers rotation
      if(this.dragData.placedShipGettingDragged && iPosition === this.dragData.iPosition && jPosition === this.dragData.jPosition){
        
        console.log("trigger rotation");
        let isRotationSuccessful;
        
        if(this.dragData.isHorizontal){
          const parameters = [this.dragData.shipNumber, iPosition, jPosition + this.dragData.distanceFromMiddlePoint];
          isRotationSuccessful =  this.gameRequest(this.currentUser, "placementUtils", "rotatePlacedShip", parameters);
        }else{
          const parameters = [this.dragData.shipNumber, iPosition + this.dragData.distanceFromMiddlePoint, jPosition];
          isRotationSuccessful = this.gameRequest(this.currentUser, "placementUtils", "rotatePlacedShip", parameters);
        }

        console.log(`Rotation Sucessful : ${isRotationSuccessful}`);  
        if(isRotationSuccessful){
          const grid = this.gameRequest(this.currentUser, "renderUtils", "getTempGrid");
          this.renderGrid(grid);
          this.gameRequest(this.currentUser, "placementUtils", "updateGrid");
        }

        return;  
      }

      if(!isPlaced){
        const grid = this.gameRequest(this.currentUser, "renderUtils", "getGrid");
        this.renderGrid(grid);
        return;
      } 

      if(this.dragData.unplacedShipGettingDragged || this.dragData.placedShipGettingDragged){
        this.gameRequest(this.currentUser, "placementUtils", "updateGrid");
        isPlaced = false;
        return;
      }

    }

    const handleCellMouseDown = () => {
      const positionData = this.gameRequest(this.currentUser, "placementUtils", "getPositionData", [iPosition, jPosition]);
      
      if(positionData === null) return;
      this.dragData.placedShipGettingDragged = true;
      this.dragData.shipNumber = positionData.shipNumber;
      this.dragData.distanceFromMiddlePoint = positionData.distanceFromMiddlePoint;
      this.dragData.isHorizontal = positionData.isHorizontal;
      this.dragData.iPosition = iPosition;
      this.dragData.jPosition = jPosition;
      this.dragData.isHorizontal = positionData.isHorizontal;

      if(positionData.isHorizontal){
        const parameters = [this.dragData.shipNumber, iPosition, jPosition + this.dragData.distanceFromMiddlePoint];
        this.gameRequest(this.currentUser, "placementUtils", "removeShip", parameters);
       }else{
        const parameters = [this.dragData.shipNumber, iPosition + this.dragData.distanceFromMiddlePoint, jPosition];
        this.gameRequest(this.currentUser, "placementUtils", "removeShip", parameters);
      }
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
      this.dragData.draggables.push(ship);
    }

  }

  bindEventListenerToShipSection(shipNumber, shipSection, distanceFromMiddlePoint) {
    const handleShipSectionMouseDown = e => {
      this.dragData.unplacedShipGettingDragged = true;
      this.dragData.distanceFromMiddlePoint = distanceFromMiddlePoint;
      this.dragData.shipNumber = shipNumber;
      this.dragData.startX = e.clientX;
      this.dragData.startY = e.clientY;
    }
    shipSection.addEventListener("mousedown", handleShipSectionMouseDown);
    
    this.shipSectionHandlerReferences.push(handleShipSectionMouseDown);
  }

  renderGrid(grid){

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const color = this.encodeToColor(grid[i][j]);
        const cell = this.cell2dArray[i][j];
        cell.style.background = color;
      }
    }

  }

  clearGrid(){
    const grid = this.gameRequest(this.currentUser, "renderUtils", "getGrid");
    this.renderGrid(grid);
  }

  restoreShipPositions(){
    let gap = 15;

    const ships = this.dragData.draggables;

    ships.forEach(ship => {
      ship.style.visibility = "visible";
      ship.style.top = `${gap}px`;
      ship.style.left = "30px";
      gap += 85;
    });

  }

  updateCurrentUser(){
    this.currentUser = 1;
  }

  droppedOutsideGrid(){
    const grid = this.gameRequest(this.currentUser, "renderUtils", "getGrid");
    this.renderGrid(grid);
  }
  
  encodeToColor(input){
    if (typeof input === "object") return "green";
    if (input === -1) return "red";
    return "white";
  }

}

class ATTACK_UI{
  

  GRID_SIZE = 8;
  INVALID_ATTACK = 0;
  
  constructor(ID, triggerProgression, parentNode){
    this.ID = ID;
    this.triggerProgression = triggerProgression;
    this.cellContainer = document.createElement("div");
    this.cellContainer.classList.add("cell-container");
    this.createCells();
    this.parentNode = parentNode;
    this.parentNode.appendChild(cellContainer);
  }

  createCells(){
    for(let i = 0; i < this.GRID_SIZE; i++){
      for(let j = 0; j < this.GRID_SIZE; j++){
        const cell = document.createElement("div");
        cell.classList.add(cell);
        this.cellContainer.appendChild(cell);
      }
    }
  }

  bindEventListenerToGridCell(cell, i, j){
    
    cell.addEventListener("click", e => { 
      const attackStatus = this.game.request({
        user: ID,
        type: "this.gameUtils",
        request: "receiveAttack",
        parameters: [iPosition, jPosition]
      });


      if(attackStatus === this.INVALID_ATTACK) return;
      e.target.textContent = this.decodeAttackStatus(attackStatus);
      this.unrenderGrid();
      this.event();
    });


  }

  decodeAttackStatus(attackStatus){
    if(attackStatus === 1) return "X";
    if(attackStatus === 2) return ".";
    return;
  }

  renderGrid(){
    this.parentNode.appendChild(this.cellContainer);
  }

  unrenderGrid(){
    this.parentNode.removeChild(this.cellContainer);
  }
  


}



export {GRID_UI};
