import { game } from "../../engine.js";

export function 
get_extension
(
    SUPER_CLASS
)
{
    return class extends 
    SUPER_CLASS 
    {

        // VARIABLES


        // FUNCTIONS

        get color
        ()
        {
            const rend = this.system_get([`renderer`]);
            console.log(rend.color)
            return game.utils.giveColorWithTables(rend.color,rend.transparency);
        }

        get x
        ()
        {
            return this.system_get
            (
                [
                    `properties`
                    ,`x`
                ]
            );
        }

        get y
        ()
        {
            return this.system_get
            (
                [
                    `properties`
                    ,`y`
                ]
            );
        }

        get chunk
        ()
        {
            let c = this.system_get([`properties`]).chunk;
            return game.currentscene.giveChunk(c.x,c.y);
        }


    }
}