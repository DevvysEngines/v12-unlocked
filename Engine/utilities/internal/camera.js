import { game } from "../../Unlocked.js";

export function aroundChunk(fn=()=>{},x,y,ts){
    const camera = game.currentscene.camera;
    x = x ?? camera.chunk.x;
    y = y ?? camera.chunk.y;
    ts = ts ?? camera.show;
    for (let i = ts.width; i>=-ts.width; i--){
        //if (game.currentscene.ifChunk(x-i,y)){
            for (let v = ts.height; v>=-ts.height; v--){
                //console.log(game.currentscene.ifChunk(x-i,y-v))
                if (game.currentscene.ifChunk(x-i,y-v)){
                    //console.log(i,v,game.currentscene.giveChunk(x-i,y-v),game.currentscene.ifChunk(x-i,y-v))
                    fn({
                        chunk: game.currentscene.giveChunk(x-i,y-v)
                        ,i
                        ,v
                        ,game
                    })
                }
            }
        //}
    }
}

export function tomap(x,y){
    const camera = game.currentscene.camera
    const window = game.window;
    return {
        x: (x-camera.x)/camera.zoom+window.width/2
        ,y: (y-camera.y)/camera.zoom+window.height/2
    };
};

export function unmap(x,y){
    const camera = game.currentscene.camera;
    const window = game.window;
    return {
        x: (x)*camera.zoom-window.width/2*camera.zoom+camera.x
        ,y: (y)*camera.zoom-window.height/2*camera.zoom+camera.y
    }
}