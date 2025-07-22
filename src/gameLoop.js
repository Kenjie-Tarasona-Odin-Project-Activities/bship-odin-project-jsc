
import {Player} from "./script.js";

class Game {
    
    #gameStart = false;
    #players = null;
    #placementMode = true;
    #currentPlayer = 0;
    #playersLocked = 0;
    #winCondition = 7;

    constructor(){

        this.#players = [new Player(), new Player()];

    }

    start(){
        if(this.#gameStart){
            console.log("Invalid Request");
            return;
        }
        this.#gameStart = true;
    }

    request(payload = null){

        if(!this.#gameStart) return;
        if(payload === null) return;
        if(payload.user !== this.#currentPlayer) return;

        const caller = this.#players[payload.user].getGameBoard();

        switch(payload.type){
            
            case "placementUtils":
                if(!this.#placementMode){
                    console.log("Invalid Request");
                    return;
                };
                return this.placementUtils(caller, payload.request, payload.parameters);
            
            case "renderUtils":
                return this.renderUtils(caller, payload.request);
            
            case "gameUtils":
                if(this.#placementMode) return false;
                return this.gameUtils(caller, payload.request, payload.parameters);
            default:
                console.log("Request Type Invalid");
                return;
        }     

    }

    placementUtils(caller, request, parameters){
        switch(request){
            
            case "lockGrid": 
                if(!caller.lockGrid()) return false       
                if(this.#currentPlayer === 1){
                    this.#placementMode = false;
                    this.#currentPlayer = 0; 
                    return true;
                }
                this.#currentPlayer = 1;
                console.log(this.#currentPlayer);
                console.log(this.#placementMode);
                return true;

            case "placeShip":
                if(caller.areAllTheShipsPlaced()) return false;
                return caller.placeShip(...parameters);

            case "movePlacedShip":
                return caller.movePlacedShip(...parameters);
            
            case "removeShip":
                return caller.removeShip(...parameters);

            case "getPositionData":
                return caller.getPositionData(...parameters);
            
            case "rotatePlacedShip":
                return caller.rotatePlacedShip(...parameters);

            case "updateGrid":
                return caller.updateGrid(...parameters);

            case "test":
                return caller.test(...parameters);
        }
    }

    renderUtils(caller, request){

        switch(request){
            case "getGrid":
                return caller.getGrid();
            
            case "getTempGrid":
                return caller.getTempGrid();
            
            case "getGridWhereTheSelectedShipIsRemoved":
                return caller.getGridWhereTheSelectedShipIsRemoved();
        }

    }

    gameUtils(caller, request, parameters){
        const receiver = this.#players[1 - this.#currentPlayer].getGameBoard();

        switch(request){

            case "receiveAttack":
                console.log(`caller ${this.#currentPlayer}`);
                console.log(`receiver ${receiver}`);
                const attackStatus = receiver.receiveAttack(...parameters);
                if(attackStatus > 0){
                    this.#currentPlayer = 1 - this.#currentPlayer;
                    console.log(`current player after successful attack: ${this.#currentPlayer}`);
                }
                
                return attackStatus;

            case "isGameOver":
                const player1 = this.#players[0].getGameBoard();
                const player2 = this.#players[1].getGameBoard();
                
                if(player1.getDestroyedShipsCount === this.#winCondition){
                    return 0;
                }
                if(player2.getDestroyedShipsCount === this.#winCondition){
                    return 1;
                }
                return - 1;
        }
        
    }
}

export {Game};
