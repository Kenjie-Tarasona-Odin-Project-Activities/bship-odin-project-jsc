class Ship {
  #length = 0;
  #numberOfTimesHit = 0;
  #isDestroyed = false;
  #startingPoint = 0;
  #middlePoint = 0;
  #endPoint = 0;
  #startOffSet = 0;
  #endOffSet = 0;

  horizontal = true;

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

  checkForDestroyed = function () {
    if (this.#length === this.#numberOfTimesHit) this.#isDestroyed = true;
  };

  rotate = function () {
    this.horizontal = this.horizontal ? false : true;
  };

  getLength = function () {
    return this.#length;
  };

  getStartOffSet = function(){
    return this.#startOffSet
  }

  getEndOffSet = function(){
    return this.#endOffSet
  }
}

class GameBoard {
  #GRID_SIZE = 8;
  #MISSED_SHOT_POSITION = -2;
  #VALID_POSITION = -1;
  #INVALID_POSITION = 0;
  #OCCUPIED_POSITION = 1;
  #MAX_SHIPS = 7;
  #shipData = [
    {
      ship: null,
      iPosition: null,
      jPosition: null,
    },
    {
      ship: null,
      iPosition: null,
      jPosition: null,
    },
    {
      ship: null,
      iPosition: null,
      jPosition: null,
    },
    {
      ship: null,
      iPosition: null,
      jPosition: null,
    },
    {
      ship: null,
      iPosition: null,
      jPosition: null,
    },
    {
      ship: null,
      iPosition: null,
      jPosition: null,
    },
    {
      ship: null,
      iPosition: null,
      jPosition: null,
    },
  ];

  #grid = [
    [0, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 1, -1, -1, -1, -1],
    [-1, 1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 1, -1, -1, -1, -1],
    [-1, -1, -1, 1, -1, -1, -1, -1],
    [-1, -1, -1, 1, -1, -1, -1, -1],
  ];

  initGameBoard(){
    this.resetGameBoard();
    this.getShips();
    
  }

  resetGameBoard(){
    for(let i = 0; i < this.#GRID_SIZE; i++){
      for(let j = 0; j < this.#GRID_SIZE; j++){
        this.#grid[i][j] = this.#VALID_POSITION;
      }
    }
  }

  getShips() {
    const shipSizes = [1, 1, 2, 2, 3, 3, 4];
    for (let i = 0; i < this.#MAX_SHIPS; i++) {
      this.#shipData[i].ship = new Ship(shipSizes[i]);
    }
  };

  printGameBoard(){
    for(let i = 0; i < this.#GRID_SIZE; i++){
      let temp = "";
      for(let j = 0; j < this.#GRID_SIZE; j++){
          temp += `${this.#grid[i][j]} `;
      }
      console.log(temp);
    }
  }
  
  removeShip(shipData){
    
    const desiredPosition = shipData.ship.horizontal ? jPosition : iPosition;

    const shipStartingPosition = desiredPosition - shipData.ship.getStartOffSet();
    const shipEndingPosition = desiredPosition + shipData.ship.getEndOffSet();

    let n = shipStartingPosition;

    if (shipData.ship.horizontal) {
      for (; n <= shipEndingPosition; n++) {
        this.#grid[shipData.iPosition][n] = this.#VALID_POSITION;
      }
    } else {
      for (; n <= shipEndingPosition; n++) {
        this.#grid[n][shipData.jPosition] = this.#VALID_POSITION;
      }
    }
    return true;
  };

  refreshGameBoard = function(){  
    for(let i = 0; i < this.#GRID_SIZE; i++){
      for(let j = 0; j < this.#GRID_SIZE; j++){
        const currentPosition = this.#grid[i][j];
        if(currentPosition >= this.#OCCUPIED_POSITION || currentPosition === this.#MISSED_SHOT_POSITION) continue;
        
        if(this.isThereAShipInCellPerimeter(i, j)) this.#grid[i][j] = this.#INVALID_POSITION;
        else this.#grid[i][j] = this.#VALID_POSITION;
    
      }
    }
    
  }
  
  isThereAShipInCellPerimeter(iPosition, jPosition){
    
    for(let i = -1; i <= 1; i++){

      const newIPosition = iPosition - i;
      if(!this.isDesiredPositionOutOfBounds(newIPosition, jPosition)) continue;

      for(let j = -1; j <= 1; j++){

        const newJPosition = jPosition - j;
        if(!this.isDesiredPositionOutOfBounds(newIPosition, newJPosition)) continue;
        if(this.#grid[newIPosition][newJPosition] >= this.#OCCUPIED_POSITION) return true;
    
      }
    }
    return false;
  }

  placeShip(shipNumber, iPosition, jPosition){

    const ship = this.#shipData[shipNumber].ship;

    if(this.isDesiredPositionValid(ship, iPosition, jPosition)){
      this.placeShipHelper(ship, iPosition, jPosition);
      this.refreshGameBoard();
      return true;
    };

    return false;
    
  }

  placeShipHelper(ship, iPosition, jPosition){
    const desiredPosition = ship.horizontal ? jPosition : iPosition;
    const shipStartingPosition = desiredPosition - ship.getStartOffSet();
    const shipEndingPosition = desiredPosition + ship.getEndOffSet();

    let n = shipStartingPosition;

    if (ship.horizontal) {
      for (; n <= shipEndingPosition; n++) {
        this.#grid[iPosition][n] = 1;
      }
    } else {
      for (; n <= shipEndingPosition; n++) {
        this.#grid[n][jPosition] = 1;
      }
    }
  }

  isDesiredPositionValid = function (ship, iPosition, jPosition) {
    if (
      this.isDesiredPositionOutOfBounds(iPosition, jPosition) &&
      this.isDesiredPositionAvailable(iPosition, jPosition) &&
      this.doesTheShipFitInTheDesiredPosition(ship, iPosition, jPosition) &&
      this.areThereShipCollisions(ship, iPosition, jPosition)
    ) {
      return true;
    }

    return false;
  };

  isDesiredPositionOutOfBounds = function (iPosition, jPosition) {
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

  isDesiredPositionAvailable = function (iPosition, jPosition) {
    return this.#grid[iPosition][jPosition] != this.#VALID_POSITION
      ? false
      : true;
  };

  doesTheShipFitInTheDesiredPosition = function (ship, iPosition, jPosition) {

    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    if (
      desiredPosition - ship.getStartOffSet() < 0 ||
      desiredPosition + ship.getEndOffSet() >= this.#GRID_SIZE
    ) {
      return false;
    }

    return true;
  };

  areThereShipCollisions = function (ship, iPosition, jPosition) {
    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    const shipStartingPosition = desiredPosition - ship.getStartOffSet();
    const shipEndingPosition = desiredPosition + ship.getEndOffSet();

    let n = shipStartingPosition;

    if (ship.horizontal) {
      for (; n <= shipEndingPosition; n++) {
        if (this.#grid[iPosition][n] != this.#VALID_POSITION) return false;
      }
    } else {
      for (; n <= shipEndingPosition; n++) {
        if (this.#grid[n][jPosition] != this.#VALID_POSITION) return false;
      }
    }
    return true;
  };
}


export { Ship, GameBoard };