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

  checkIfDestroyed = function () {
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
    // -1 empty
    // 0 invalid position
    // 1 occupied
    
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
  ];

  placeShip = function (ship, iPosition, jPosition) {
    if (
      this.checkIfDesiredPositionIsOOB(iPosition, jPosition) &&
      this.checkIfShipIsTooLarge(ship, iPosition, jPosition)
    ) {

        return true;
    }

    return false;
  };
  //OOB = OUT OF BOUNDS
  checkIfDesiredPositionIsOOB = function (iPosition, jPosition) {
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

  checkIfShipIsTooLarge = function (ship, iPosition, jPosition) {
    const length = ship.getLength();
    const startingPoint = 0;
    const middlePoint = Math.trunc(length / 2);
    const endPoint = length - 1;

    const startingSide = startingPoint + middlePoint;
    const endingSide = endPoint - middlePoint;
    
    console.log(startingSide);
    console.log(endingSide);

    const desiredPosition = ship.horizontal ? jPosition : iPosition;

    console.log(desiredPosition);
    if (
      desiredPosition - startingSide < 0 ||
      desiredPosition + endingSide >= this.#gridSize
    ) { 
      return false;
    }

    return true;
  }

}

const testShip = new Ship(3);
const testGameBoard = new GameBoard();

testGameBoard.placeShip(testShip, 4, 2);

export { Ship,GameBoard };
