
import {Player} from "./script.js";

class Game {
    
    #gameStart = false;
    #players = null;
    #placementMode = true;
    #currentPlayerPlacing = 0;
    #playersLocked = 0;

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
        if(payload.user !== this.#currentPlayerPlacing);

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
            
            default:
                console.log("Request Type Invalid");
                return;
        }     

    }

    placementUtils(caller, request, parameters){
        switch(request){

             case "lockGrid": 
                if(!caller.lockGrid()) return false       
                if(this.#currentPlayerPlacing === 1) this.#placementMode = false;
                
                this.#currentPlayerPlacing = 1;
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

}

export {Game};
