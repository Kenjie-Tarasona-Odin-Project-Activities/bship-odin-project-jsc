import {Ship, GameBoard} from "./script.js";

describe('Game Board Position Check : Out of Bounds', () => {
    const board = new GameBoard();
    const shipLength = 3;
    const testShip = new Ship(shipLength);

    it('Out of bounds: X Position', () => {
        expect(board.placeShip(testShip, 6, 4)).toBe(false);
    });

    it('Out of bounds: Y Position', () => {
        expect(board.placeShip(testShip, 5, 6)).toBe(false);
    });

    it('Ship Too Large: Horizontal Orientation', () => {
        
        expect(board.placeShip(testShip, 0, 4)).toBe(false);
    });

    it('Ship Too Large: Vertical Orientation', () => {
        testShip.rotate();
        expect(board.placeShip(testShip, 4, 0)).toBe(false);
    });

});


describe('Game Board Position Check: Inbound', () => {
    const board = new GameBoard();
    const shipLength = 1;
    const testShip = new Ship(shipLength);

    it('Inbound: 1', () => {
        expect(board.placeShip(testShip, 3, 3)).toBe(true);
    });

    it('Inbound: 2', () => {
        expect(board.placeShip(testShip, 2, 3)).toBe(true);
    });

    it('Ship Fit: Horizontal Orientation', () => {
        
        expect(board.placeShip(testShip, 0, 0)).toBe(true);
    });

    it('Ship Fit: Vertical Orientation', () => {
        testShip.rotate();
        expect(board.placeShip(testShip, 4, 4)).toBe(true);
    });

});




