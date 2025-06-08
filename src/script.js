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
    this.horizontal = false;
  }

  getLength = function(){
    return this.#length;
  }
}

class GameBoard {
  #gridSize = 5;
  #grid = [

    /* 
    -1 empty
    0 invalid position
    1 occupied

    [0, 1, 2, 3, 4, 5]
    [0, 1, 2, 3, 4, 5]
    [0, 1, 2, 3, 4, 5]
    [0, 1, 2, 3, 4, 5]
    [0, 1, 2, 3, 4, 5]
    
    */
    
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
  ];

  placeShip = function (ship, iPosition, jPosition) {
    if (
      this.checkForDesiredPositionIsOOB(iPosition, jPosition) &&
      this.checkForEdgeCollision(ship, iPosition, jPosition)
    ) {

        return true;
    }

    return false;
  };
  //OOB = OUT OF BOUNDS
  checkForDesiredPositionIsOOB = function (iPosition, jPosition) {
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

  checkForEdgeCollision = function (ship, iPosition, jPosition) {

    const length = ship.getLength();
    const startingPoint = 0;
    const middlePoint = Math.trunc(length / 2);
    const endPoint = length - 1;

    const startOffset = startingPoint + middlePoint;
    const endOffset = endPoint - middlePoint;
    
    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    console.log(desiredPosition);
    if (
      desiredPosition - startOffset >= 0 &&
      desiredPosition + endOffset < this.#gridSize &&
      checkForShipCollision(ship.horizontal, length, iPosition, jPosition, startOffset)
    ) { 
      return false;
    }

    return true;
  }

  checkForShipCollision = function(horizontal, length, iPosition, jPosition, startOffset){
    
    let iPos = iPosition;
    let jPos = jPosition;
    
    const startingPosition = 

    for(let i = 0; i < length; i++){
      
    }
  }

}

const testShip = new Ship(3);
const testGameBoard = new GameBoard();

testGameBoard.placeShip(testShip, 4, 2);

export { Ship,GameBoard };
