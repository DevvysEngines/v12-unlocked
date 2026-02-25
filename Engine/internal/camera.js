export class camera{
    x=0;
    y=0;
    zoom=1;
    rotation=0;
    chunk={x:0,y:0};
    show={width:5,height:5};
    constructor(scene){
        scene.addCamera(this);
    }
    update(){
        const game = this.scene.game;
        const chunk = game.currentscene.locateChunkByPos(this.x,this.y)
        const chunkpos = {x:chunk.pos.x,y:chunk.pos.y};
        const mychunkpos = this.chunk;
        if (chunkpos.x!=mychunkpos.x||chunkpos.y!=mychunkpos.y){
            this.chunk = chunkpos;
            console.log(chunkpos);
        }
    }
}