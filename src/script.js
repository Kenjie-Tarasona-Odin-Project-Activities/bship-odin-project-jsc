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
  #tempGrid = null;
  #gridCopy = null;

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

  initGameBoard() {
    this.resetGameBoard();
    this.getShips();
  }

  resetGameBoard() {
    for (let i = 0; i < this.#GRID_SIZE; i++) {
      for (let j = 0; j < this.#GRID_SIZE; j++) {
        this.#grid[i][j] = this.#VALID_POSITION;
      }
    }
  }

  getShips() {
    const shipSizes = [4, 1, 2, 2, 3, 3, 4];
    for (let i = 0; i < this.#MAX_SHIPS; i++) {
      this.#ships.push(new Ship(shipSizes[i]));
    }
  }

  removeShip(shipNumber, iPosition, jPosition) {

    const ship = this.getShip(shipNumber);
    const desiredPosition = ship.horizontal ? jPosition : iPosition;
    const shipStartingPosition =
      desiredPosition - ship.getStartOffSet();
    const shipEndingPosition = desiredPosition + ship.getEndOffSet();

    let n = shipStartingPosition;
    
    this.#gridCopy = this.copyOriginalGrid();

    if (ship.horizontal) {
      for (; n <= shipEndingPosition; n++) {
        this.#gridCopy[iPosition][n] = this.#VALID_POSITION;
      }
    } else {
      for (; n <= shipEndingPosition; n++) {
        this.#gridCopy[n][jPosition] = this.#VALID_POSITION;
      }
    }

    this.refreshGameBoard(this.#gridCopy);
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

  placeShip(shipNumber, iPosition, jPosition) {
    const ship = this.getShip(shipNumber);
    this.#tempGrid = this.copyOriginalGrid();

    if (this.isDesiredPositionValid(ship, iPosition, jPosition, this.#tempGrid)) {
      this.placeShipHelper(ship, shipNumber, this.#tempGrid, iPosition, jPosition);
      this.refreshGameBoard(this.#tempGrid); 
      console.table(this.#tempGrid);
      return true;
    }

    return false;

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

  movePlacedShip(shipNumber, iPosition, jPosition){

    this.#tempGrid = this.#gridCopy.map((element) => element.slice());
    const ship = this.getShip(shipNumber);

    if (this.isDesiredPositionValid(ship, iPosition, jPosition, this.#tempGrid)) {

      this.placeShipHelper(ship, shipNumber, this.#tempGrid, iPosition, jPosition);
      this.refreshGameBoard(this.#tempGrid);
      return true;
    }

    return false;
  }

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

  receiveAttack(iPos, jPos) {
    if (typeof this.#grid[iPos][jPos] === "object") {
      const shipNumber = this.#grid[iPos][jPos] - 1; // ADJUSTED FOR ARRAY INDEX MATCHING
      const attackedShip = this.#ships[shipNumber];
      attackedShip.hit();
      this.#grid[iPos][jPos] = this.#SHOT_HIT;
      return; // should be an object for front end synchronization
    }

    if (
      this.#grid[iPos][jPos] === this.#VALID_POSITION ||
      this.#grid[iPos][jPos] === this.#INVALID_POSITION
    ) {
      this.#grid[iPos][jPos] = this.#SHOT_MISSED;
      return;
    }
  }

  updateGrid(){

    this.#grid = this.#tempGrid;
    this.#tempGrid = null;
    this.#gridCopy = null;

  }

  copyOriginalGrid(){
    const tempGrid = this.#grid.map((element) => element.slice());
    return tempGrid;
  }

  getDestroyedShips() {
    return this.#destroyed_ships;
  }

  getShip(shipNumber) {
    return this.#ships[shipNumber];
  }

  getGrid() {
    return this.#grid;
  }

  getTempGrid(){
    return this.#tempGrid;
  }

  getGridCopy(){
    return this.#gridCopy;
  }

  getPositionData(iPosition, jPosition) {
    const grid = this.getGrid();
    const positionData = {...grid[iPosition][jPosition]};
    const ship = this.getShip(positionData.shipNumber);
    if(Object.keys(positionData).length !== 2) return null; 
    positionData.isHorizontal = ship.getOrientation();

    return positionData;
    
  }
}

const board = new GameBoard();

export { board };