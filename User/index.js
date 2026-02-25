import { game } from "../Engine/engine.js";


const myNode = new game.presets.scripts.event({
    path: `renderer/color/`
    ,fired(){
        //console.log("color changed");
    }
})



const myElement = new game.element(
    {},{},{}
    , new game.presets.scripts.frame({
        fired(){
            this.set(`renderer/color/0`,(this.get(`renderer/color/0`)+1))
        }
    })
    ,myNode
);















/*

const myElement = new game.element();
const myScript = new game.script({
    fired(){
        console.log("My Script has fired!");
    }
    ,signal: "mySignal"
});

myElement.insert(myScript);
myElement.emit("mySignal");

console.log(
    
)

window.myElement = myElement;

window.ifChunk = game.currentscene.ifChunk;


*/









/*

console.log(utils)
window.game = game;

let player = new game.element(
   {x:500} // properties Name, ids, chunk, x,y, ui
   ,{color:[255,0,0], type:`arc`} // Renderer how the object looks
   ,{}
);

game.player = player;

player.set(`vitals`, {health:500});
let x = player.do(new game.node(`node`, [`player`],function(){
    //console.log(`heyy`)
}))

player.on(game.presets.mouse.Left.Down,
    function(){
        this.link(x);
        console.log(this.secondaryNode)
        this.remove();
    }
)

window.player = player

*/
// types
// box, arc, txt, img

/*
Scopes
    properties
    renderer
    hitbox
    --nodes system stuff

    custom - vitals - health and stuff
    custom - physics - mass, friction
*/