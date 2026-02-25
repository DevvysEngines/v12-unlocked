import { script } from "../../../../systems/v9/script.js";
import { utilities } from "../../../../systems/v9/utilities.js";

const convert = utilities.system_signal_converter;
const EVENT_SCRIPT_DEFAULTS = 
{
    path: `properties/x`
    ,fired(){}
    ,on_insert(){}
    ,on_removal(){}
    ,detect: `set`
}

export class event extends script
{
    constructor
    (
        path = `properties/x`
        ,fired_function = function(){}
        ,on_insert_function = function(){}
        ,on_removal_function = function(){}
        ,detect = `set`
    )
    {
        let raw_path;
        let raw_detect;
        let rest = {};
        if (typeof path === `object`)
        {
            ({path: raw_path, detect: raw_detect, ...rest} = 
            {
                ...EVENT_SCRIPT_DEFAULTS
                ,...path
            })
        }
        else
        {
            raw_path = path;
            raw_detect = detect
            rest = 
            {
                fired: fired_function
                ,on_insert: on_insert_function
                ,on_removal: on_removal_function
                ,event_node: true
            }
        }

        super
        (
            {
                ...rest
                ,signal: convert(raw_path, raw_detect)
            }
        );

    }
}