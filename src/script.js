class Ship {
  #length = 0;
  #numberOfTimesHit = 0;
  #isDestroyed = false;
  horizontal = true;

  constructor(length, horizontal = true) {
    this.#length = length;
    this.horizontal = horizontal;
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
}

class GameBoard {
  #GRID_SIZE = 5;
  #MISSED_SHOT_POSITION = -2;
  #VALID_POSITION = -1;
  #INVALID_POSITION = 0;
  #OCCUPIED_POSITION = 1;
  #MAX_SHIPS = 3;
  #ships = [];

  #grid = [
    [0, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, 1, -1],
    [-1, 1, -1, -1, -1],
  ];

  getShips = function () {
    for (let i = 0; i < this.#MAX_SHIPS; i++) {
      this.#ships.push(new Ship(3));
    }
  };
  
  refreshGameBoard = function(){
    
    for(let i = 0; i < this.#GRID_SIZE; i++){
      for(let j = 0; j < this.#GRID_SIZE; j++){
        const currentPosition = this.#grid[i][j];
        if(currentPosition === this.#VALID_POSITION || currentPosition === this.#MISSED_SHOT_POSITION) continue;
        
        if(isThereAShipInCellPerimeter(i, j)) this.#grid[i][j] = this.#INVALID_POSITION;
        else this.#grid[i][j] = this.#VALID_POSITION;
    
      }
    }
    
  }
  
  isThereAShipInCellPerimeter = function(iPosition, jPosition){
    
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
    const length = ship.getLength();
    const startingPoint = 0;
    const middlePoint = Math.trunc(length / 2);
    const endPoint = length - 1;

    const startOffset = startingPoint + middlePoint;
    const endOffset = endPoint - middlePoint;

    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    if (
      desiredPosition - startOffset < 0 ||
      desiredPosition + endOffset >= this.#GRID_SIZE
    ) {
      return false;
    }

    return true;
  };

  areThereShipCollisions = function (ship, iPosition, jPosition) {
    const length = ship.getLength();
    const startingPoint = 0;
    const middlePoint = Math.trunc(length / 2);
    const endPoint = length - 1;

    const startOffset = startingPoint + middlePoint;
    const endOffset = endPoint - middlePoint;

    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    const shipStartingPosition = desiredPosition - startOffset;
    const shipEndingPosition = desiredPosition + endOffset;

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