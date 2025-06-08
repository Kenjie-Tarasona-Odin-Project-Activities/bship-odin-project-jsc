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

  rotate = function(){
    this.horizontal = this.horizontal ? false : true;
  }

  getLength = function(){
    return this.#length;
  }
}

class GameBoard {
  #gridSize = 5;
  #VALID_POSITION = -1
  #INVALID_POSITION = 0
  #grid = [

    [0, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1,  1, -1],
    [-1,  1, -1, -1, -1],
  ];

  placeShip = function (ship, iPosition, jPosition) {
    if (
      this.checkForOutOfBoundsPosition(iPosition, jPosition) &&
      this.checkForValidPosition(iPosition, jPosition) &&
      this.checkForShipUnfitInPosition(ship, iPosition, jPosition) &&
      this.checkForShipCollision(ship, iPosition, jPosition)
    ) {

        return true;
    }

    return false;
  };

  checkForOutOfBoundsPosition = function (iPosition, jPosition) {
    if (
      iPosition >= this.#gridSize ||
      jPosition >= this.#gridSize ||
      iPosition < 0 ||
      jPosition < 0
    ) {
      return false;
    }

    return true;
  }

  checkForValidPosition = function(iPosition, jPosition){

    return this.#grid[iPosition][jPosition] != this.#VALID_POSITION ? false : true;

  }

  checkForShipUnfitInPosition = function (ship, iPosition, jPosition) {

    const length = ship.getLength();
    const startingPoint = 0;
    const middlePoint = Math.trunc(length / 2);
    const endPoint = length - 1;

    const startOffset = startingPoint + middlePoint;
    const endOffset = endPoint - middlePoint;
    
    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    if (
      desiredPosition - startOffset < 0 ||
      desiredPosition + endOffset >= this.#gridSize) { 
      return false;
    }

    return true;
  }

  checkForShipCollision = function(ship, iPosition, jPosition){
    const length = ship.getLength();
    const startingPoint = 0;
    const middlePoint = Math.trunc(length / 2);
    const endPoint = length - 1;

    const startOffset = startingPoint + middlePoint;
    const endOffset = endPoint - middlePoint;

    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    const shipStartingPosition = desiredPosition - startOffset;
    const shipEndingPosition = desiredPosition  + endOffset;

    let n = shipStartingPosition;

    console.log(`Horizontal? : ${ship.horizontal}`);
    console.log(`Starting Pos : ${shipStartingPosition}`);
    console.log(`Ending Pos : ${shipEndingPosition}`);

    if(ship.horizontal){
      for(;n <= shipEndingPosition; n++){
        if(this.#grid[iPosition][n] != this.#VALID_POSITION)
          return false;
      }
    }else{
      for(;n <= shipEndingPosition; n++){
        if(this.#grid[n][jPosition] != this.#VALID_POSITION)
          return false;
      }
    }
    return true;

  }

}

export { Ship,GameBoard };
