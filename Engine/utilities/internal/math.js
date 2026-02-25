export function toradians(degrees){
    return (Math.PI/180)*degrees;
}
export function distance(x1,y1,x2,y2){
    return (Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1))));
}
export function rotatepoint(x=0,y=0,rotation=0,xorigin=0,yorigin=0){
    rotation = toradians(rotation);
    x-=xorigin;
    y-=yorigin;
    let newpos = {
        x: x*Math.cos(rotation)-y*Math.sin(rotation)
        ,y: x*Math.sin(rotation)+y*Math.cos(rotation)
    };
    newpos.x+=xorigin;
    newpos.y+=yorigin;
    return newpos;
}
export function tosec(value){
    return (value/1000*60)
}