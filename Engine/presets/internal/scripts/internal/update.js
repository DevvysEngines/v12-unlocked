import { script } from "../../../../systems/v9/script.js";

const FRAME_SCRIPT_DEFAULTS = 
{
    fired_function(){}
    ,on_insert_function(){}
    ,on_removal_function(){}
    ,detect: `update`
}

export class frame extends script
{
    constructor
    (
        fired_function = function(){}
        ,on_insert_function = function(){}
        ,on_removal_function = function(){}
        ,detect = `update`
    )
    {
        let raw_detect;
        let rest;
        if (typeof fired_function === `object`)
        {
            (
                {detect: raw_detect, ...rest} = 
                {
                    ...FRAME_SCRIPT_DEFAULTS
                    ,...fired_function
                }
            )
        }
        else
        {
            raw_detect = detect;
            rest = 
            {
                fired: fired_function
                ,on_insert: on_insert_function
                ,on_removal: on_removal_function
                ,detect
            }
        }
        super
        (
            {
                ...rest
                ,signal: `-u$${raw_detect[0]}`
            }
        )
    }
}