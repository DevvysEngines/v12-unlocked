import {baseElement} from "./internal/baseElement.js";
import {nHan} from "./internal/nodeHandler.js";
import {nSea} from "./internal/nodeSearcher.js";
import {dHan} from "./internal/dimeHandler.js";
import { get_extension } from "./internal/getExtension.js";
import { script_handler } from "./internal/scriptHandler.js";

export class element extends 

script_handler
    (
        dHan
        (
            //nSea
            //(
            //    nHan
            //    (
                    get_extension
                    (
                        baseElement
                    )
            //    )
            //)
        )
    )
    {
    constructor(properties,renderer,hitbox,...allNodes){
        super(properties,renderer,hitbox,...allNodes);
    }
}