import { game } from "../../engine.js";

export function giveColorWithTables(color,transparency){
    return `${color[0]},${color[1]},${color[2]},${transparency}`;
}

export function givefont(size=16,style=`sans-serif`,type=``){
    return (`${style} ${size}px ${type}`); // bold ${13/(game.hud ? 1:camera.zoom)}px sans-serif
}

export function measureText(text,renderer){
    game.ctx.font = utils.givefont(renderer.fontsize,renderer.fonttype,renderer.fontstyle);
    return game.ctx.measureText(text).width
}