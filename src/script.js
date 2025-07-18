class Ship {
  #length = 0;
  #numberOfTimesHit = 0;
  #destroyed = false;
  #startingPoint = 0;
  #middlePoint = 0;
  #endPoint = 0;
  #startOffSet = 0;
  #endOffSet = 0;

  constructor(length = 3, horizontal = true) {
    this.#length = length;
    this.horizontal = horizontal;
    this.#startingPoint = 0;
    this.#middlePoint = Math.trunc(this.#length / 2);
    this.#endPoint = this.#length - 1;
    this.#startOffSet = this.#startingPoint + this.#middlePoint;
    this.#endOffSet = this.#endPoint - this.#middlePoint;
  }

  hit = function () {
    this.#numberOfTimesHit += 1;
  };

  isDestroyed = function () {
    if (this.#length === this.#numberOfTimesHit) this.#destroyed = true;
  };

  rotate() {
    this.horizontal = this.horizontal ? false : true;
  };

  getLength = function () {
    return this.#length;
  };

  getStartOffSet = function () {
    return this.#startOffSet;
  };

  getEndOffSet = function () {
    return this.#endOffSet;
  };

  getOrientation (){
    return this.horizontal;
  }

}

class GameBoard {
  #GRID_SIZE = 8;
  #SHOT_HIT = -4;
  #SHOT_MISSED = -3;
  #VALID_POSITION = -2;
  #INVALID_POSITION = -1;
  #MAX_SHIPS = 7;
  #destroyed_ships = [];
  #ships = [];
  #placed_ships = [];
  #forStaging = null;
  #gridWhereTheSelectedShipIsRemoved = null;
  #locked = false;

  #grid = [
    [-2, -2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2, -2],
    [-2, -2, -2, -2, -2, -2, -2, -2],
  ];

  // INTERFACE

  placeShip(shipNumber, iPosition, jPosition) {

    if(this.#placed_ships.includes(shipNumber)){
      console.log("Invalid Request");
      return;
    }
    const ship = this.getShip(shipNumber);
    this.#forStaging = this.copyOriginalGrid();

    if (this.isDesiredPositionValid(ship, iPosition, jPosition, this.#forStaging)) {
      this.placeShipHelper(ship, shipNumber, this.#forStaging, iPosition, jPosition);
      this.refreshGameBoard(this.#forStaging); 
      return true;
    }

    return false;

  }

  movePlacedShip(shipNumber, iPosition, jPosition){

    if(this.getGridWhereTheSelectedShipIsRemoved === null){
      console.log("Invalid Request");
      return false;
    }

    this.#forStaging = this.copyGridWhereTheSelectedShipIsRemoved();
    const ship = this.getShip(shipNumber);

    if (this.isDesiredPositionValid(ship, iPosition, jPosition, this.#forStaging)) {

      this.placeShipHelper(ship, shipNumber, this.#forStaging, iPosition, jPosition);
      this.refreshGameBoard(this.#forStaging);
      return true;
    }
    
    this.#forStaging = null;
    return false;
  }

  removeShip(shipNumber, iPosition, jPosition) {

    const positionData = this.getPositionData(iPosition, jPosition); 
    if(positionData === null){
      console.log("Invalid Request");
      return;
    }

    if(positionData.shipNumber !== shipNumber && positionData.distanceFromMiddlePoint !== 0){
      console.log("Invalid Request");
      return;
    }

    const ship = this.getShip(shipNumber);
    const desiredPosition = ship.horizontal ? jPosition : iPosition;
    const shipStartingPosition =
      desiredPosition - ship.getStartOffSet();
    const shipEndingPosition = desiredPosition + ship.getEndOffSet();

    let n = shipStartingPosition;
    
    this.#gridWhereTheSelectedShipIsRemoved = this.copyOriginalGrid();

    if (ship.horizontal) {
      for (; n <= shipEndingPosition; n++) {
        this.#gridWhereTheSelectedShipIsRemoved[iPosition][n] = this.#VALID_POSITION;
      }
    } else {
      for (; n <= shipEndingPosition; n++) {
        this.#gridWhereTheSelectedShipIsRemoved[n][jPosition] = this.#VALID_POSITION;
      }
    }

    this.refreshGameBoard(this.#gridWhereTheSelectedShipIsRemoved);
  }

  getPositionData(iPosition, jPosition) {
    const grid = this.getGrid();
    const positionData = {...grid[iPosition][jPosition]};
    const ship = this.getShip(positionData.shipNumber);
    if(Object.keys(positionData).length !== 2) return null; 
    positionData.isHorizontal = ship.getOrientation();

    return positionData;
  }

  rotatePlacedShip(shipNumber, iPosition, jPosition){

    if(this.#gridWhereTheSelectedShipIsRemoved === null){
      console.log("Invalid Request");
      return false;
    } 

    const ship = this.getShip(shipNumber);
    ship.rotate();
    const isPlaced = this.movePlacedShip(shipNumber, iPosition, jPosition);
    if(!isPlaced) ship.rotate();
    return isPlaced;

  }

  updateGrid(){

    if(this.#forStaging === null){
      console.log("Invalid Request");
      return;
    }

    this.#grid = this.#forStaging;
    this.#forStaging = null;
    this.#gridWhereTheSelectedShipIsRemoved = null;

    if(!this.areAllTheShipsPlaced()) 
      this.boardIntegrityChecker();  

  }

  getGrid() {
    return this.#grid;
  }

  getTempGrid(){
    return this.#forStaging;
  }

  getGridWhereTheSelectedShipIsRemoved(){
    return this.#gridWhereTheSelectedShipIsRemoved;
  }

  lockGrid(){
    if(this.areAllTheShipsPlaced()){
      this.#locked = true;
      return true;
    }
    console.log(this.#placed_ships);
    return false;

  }

  
  // GAMELOOP INTERFACE //


  // INTERNAL  // 
  initGameBoard() {
    this.resetGameBoard();
    this.getShips();
  }

  placeShipHelper(ship, shipNumber, grid, iPosition, jPosition) {
    const desiredPosition = ship.horizontal ? jPosition : iPosition;
    const shipStartingPosition = desiredPosition - ship.getStartOffSet();
    const shipEndingPosition = desiredPosition + ship.getEndOffSet();

    let n = shipStartingPosition;
    let distanceFromMiddlePoint = Math.trunc(ship.getLength() / 2);

    if (ship.horizontal) {
      for (; n <= shipEndingPosition; n++) {
        grid[iPosition][n] = {shipNumber, distanceFromMiddlePoint };
        distanceFromMiddlePoint--;
      }
    }else{
      for (; n <= shipEndingPosition; n++) {
        grid[n][jPosition] = {shipNumber, distanceFromMiddlePoint };
        distanceFromMiddlePoint -= 1;
      }
    }
  }

  resetGameBoard() {
    for (let i = 0; i < this.#GRID_SIZE; i++) {
      for (let j = 0; j < this.#GRID_SIZE; j++) {
        this.#grid[i][j] = this.#VALID_POSITION;
      }
    }
  }

  copyOriginalGrid(){
    const tempGrid = this.#grid.map((element) => element.slice());
    return tempGrid;
  }

  copyGridWhereTheSelectedShipIsRemoved(){
    const tempGrid = this.#gridWhereTheSelectedShipIsRemoved.map((element) => element.slice());
    return tempGrid;
  }

  getDestroyedShips() {
    return this.#destroyed_ships;
  }

  getShip(shipNumber) {
    return this.#ships[shipNumber];
  }

  getShips() {
    const shipSizes = [1, 1, 2, 2, 3, 3, 4];
    for (let i = 0; i < this.#MAX_SHIPS; i++) {
      this.#ships.push(new Ship(shipSizes[i]));
    }
  }
 
  refreshGameBoard(grid) {
    for (let i = 0; i < this.#GRID_SIZE; i++) {
      for (let j = 0; j < this.#GRID_SIZE; j++) {
        const currentPosition = grid[i][j];
        if (typeof currentPosition === "object") continue;

        if (this.isThereAShipInCellPerimeter(i, j, grid))
          grid[i][j] = this.#INVALID_POSITION;
        else 
          grid[i][j] = this.#VALID_POSITION;
      }
    }
  };

  isThereAShipInCellPerimeter(iPosition, jPosition, grid) {
    for (let i = -1; i <= 1; i++) {
      const newIPosition = iPosition - i;
      if (!this.isDesiredPositionNotOutOfBounds(newIPosition, jPosition))
        continue;

      for (let j = -1; j <= 1; j++) {
        const newJPosition = jPosition - j;

        if (!this.isDesiredPositionNotOutOfBounds(newIPosition, newJPosition))
          continue;

        if (typeof grid[newIPosition][newJPosition] === "object") {
          return true;
        }
      }
    }
    return false;
  }
   
  boardIntegrityChecker(){
    const grid = this.getGrid();

    for(let i = 0; i < this.#GRID_SIZE; i++){
      for(let j = 0; j < this.#GRID_SIZE; j++){
        
        const current = grid[i][j];
        if(typeof current !== "object") continue;
        if(this.#placed_ships.includes(current.shipNumber)) continue;
        this.#placed_ships.push(current.shipNumber);
      }
    }

  }

  areAllTheShipsPlaced(){
    if(this.#placed_ships.length === this.#MAX_SHIPS) return true;
    return false;
  }

  // INTERNAL POSITION VALIDATORS //

  isDesiredPositionValid(ship, iPosition, jPosition, grid) {
    if (
      this.isDesiredPositionNotOutOfBounds(iPosition, jPosition) &&
      this.isDesiredPositionAvailable(iPosition, jPosition, grid) &&
      this.doesTheShipFitInTheDesiredPosition(ship, iPosition, jPosition) &&
      this.areThereShipCollisions(ship, iPosition, jPosition, grid)
    ) {
      return true;
    }

    return false;
  };

  isDesiredPositionNotOutOfBounds = function (iPosition, jPosition) {
    if (
      iPosition >= this.#GRID_SIZE ||
      jPosition >= this.#GRID_SIZE ||
      iPosition < 0 ||
      jPosition < 0
    ) {
      return false;
    }

    return true;
  };

  isDesiredPositionAvailable = function (iPosition, jPosition, grid) {
    return grid[iPosition][jPosition] != this.#VALID_POSITION
      ? false
      : true;
  };

  doesTheShipFitInTheDesiredPosition = function (ship, iPosition, jPosition) {
    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    if (desiredPosition - ship.getStartOffSet() < 0 || desiredPosition + ship.getEndOffSet() >= this.#GRID_SIZE) {
      return false;
    }

    return true;
  };

  areThereShipCollisions = function (ship, iPosition, jPosition, grid) {
    const desiredPosition = ship.horizontal ? jPosition : iPosition;
    const shipStartingPosition = desiredPosition - ship.getStartOffSet();
    const shipEndingPosition = desiredPosition + ship.getEndOffSet();

    let n = shipStartingPosition;

    if (ship.horizontal) {
      for (; n <= shipEndingPosition; n++) {
        if (grid[iPosition][n] != this.#VALID_POSITION) return false;
      }
    } else {
      for (; n <= shipEndingPosition; n++) {
        if (grid[n][jPosition] != this.#VALID_POSITION) return false;
      }
    }
    return true;
  };


  // UNFINISHED // 
  receiveAttack(iPosition, jPosition) {
    const positionData = this.#grid[iPosition][jPosition];

    if(typeof positionData === "object"){
      const ship = this.getShip(positionData.shipNumber);
      ship.hit();
      if(ship.isDestroyed()){
        this.#destroyed_ships.push(positionData.shipNumber);
      }
      this.#grid[iPosition][jPosition] = this.#SHOT_HIT;
      return true;
    }

    if(positionData === this.#INVALID_POSITION || positionData === this.#VALID_POSITION){
      this.#grid[iPosition][jPosition] = this.#SHOT_MISSED;
      return true; 
    }

    return false;
  }
}

class Player {
  #gameBoard = null;

  constructor(){
    this.#gameBoard = new GameBoard();
    this.#gameBoard.initGameBoard();
  }

  getGameBoard(){
    return this.#gameBoard;
  }

}


const board = new GameBoard();

export { board, Player};