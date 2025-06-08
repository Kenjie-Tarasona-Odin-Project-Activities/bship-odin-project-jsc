import {Ship, GameBoard} from "./script.js";

describe('Game Board Position Check : Invalid Positions Ship size 4', () => {
    const board = new GameBoard();
    const shipLength = 4;
    const testShip = new Ship(shipLength);

    it('Out of bounds: i Position', () => {
        expect(board.checkForOutOfBoundsPosition(5, 0)).toBe(false);
    });

    it('Out of bounds: j Position', () => {
        expect(board.checkForOutOfBoundsPosition(0, 5)).toBe(false);
    });

    it('Invalid Position', () => {
        expect(board.checkForValidPosition(0, 0)).toBe(false);
    });

    it('Ship Too Large: Horizontal Orientation', () => {
        
        expect(board.checkForShipUnfitInPosition(testShip, 0, 4)).toBe(false);
    });

    it('Ship Too Large: Vertical Orientation', () => {
        testShip.rotate();
        expect(board.checkForShipUnfitInPosition(testShip, 4, 0)).toBe(false);
    });

    it('Ship Collision: Horizontal Orientation', () => {
        testShip.rotate();
        expect(board.checkForShipCollision(testShip, 3, 2)).toBe(false);
    });

    it('Ship Collision: Vertical Orientation', () => {
        testShip.rotate();
        expect(board.checkForShipCollision(testShip, 2, 3)).toBe(false);
    });

});

describe('Game Board Position Check : Invalid Positions Ship size 3', () => {
    const board = new GameBoard();
    const shipLength = 3;
    const testShip = new Ship(shipLength);

    it('Out of bounds: i Position', () => {
        expect(board.checkForOutOfBoundsPosition(5, 0)).toBe(false);
    });

    it('Out of bounds: j Position', () => {
        expect(board.checkForOutOfBoundsPosition(0, 5)).toBe(false);
    });

    it('Invalid Position', () => {
        expect(board.checkForValidPosition(0, 0)).toBe(false);
    });

    it('Ship Too Large: Horizontal Orientation', () => {
        
        expect(board.checkForShipUnfitInPosition(testShip, 0, 4)).toBe(false);
    });

    it('Ship Too Large: Vertical Orientation', () => {
        testShip.rotate();
        expect(board.checkForShipUnfitInPosition(testShip, 4, 0)).toBe(false);
    });

    it('Ship Collision: Horizontal Orientation', () => {
        testShip.rotate();
        expect(board.checkForShipCollision(testShip, 3, 2)).toBe(false);
    });

    it('Ship Collision: Vertical Orientation', () => {
        testShip.rotate();
        expect(board.checkForShipCollision(testShip, 2, 3)).toBe(false);
    });

});