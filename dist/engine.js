class Canvas{
    constructor(){
        this.canvas = document.createElement(`canvas`);
        this.canvas.style.position = `fixed`;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.left = 0;
        this.canvas.style.top = 0;
        this.ctx = this.canvas.getContext(`2d`);
        this.ctx.textAlign = `center`;
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);
    }
}

function toradians(degrees){
    return (Math.PI/180)*degrees;
}
function distance(x1,y1,x2,y2){
    return (Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1))));
}
function rotatepoint(x=0,y=0,rotation=0,xorigin=0,yorigin=0){
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
function tosec(value){
    return (value/1000*60)
}

var math = /*#__PURE__*/Object.freeze({
    __proto__: null,
    distance: distance,
    rotatepoint: rotatepoint,
    toradians: toradians,
    tosec: tosec
});

function aroundChunk(fn=()=>{},x,y,ts){
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
                    });
                }
            }
        //}
    }
}

function tomap(x,y){
    const camera = game.currentscene.camera;
    const window = game.window;
    return {
        x: (x-camera.x)/camera.zoom+window.width/2
        ,y: (y-camera.y)/camera.zoom+window.height/2
    };
}
function unmap(x,y){
    const camera = game.currentscene.camera;
    const window = game.window;
    return {
        x: (x)*camera.zoom-window.width/2*camera.zoom+camera.x
        ,y: (y)*camera.zoom-window.height/2*camera.zoom+camera.y
    }
}

var camera$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    aroundChunk: aroundChunk,
    tomap: tomap,
    unmap: unmap
});

function normalizePath(path){
    let newpath = [];
    if (!Array.isArray(path))path=[path];
    //let jPath = path.join(`,`);
    //let cPath = cachedPaths[jPath];
    //if (cPath)return cPath;
    path.forEach((newstr)=>{
        if (typeof newstr == `string`)
        {
            /*
            newstr = newstr.replaceAll(`.`, `/`);
            newstr = newstr.replaceAll(`[`, `/`);
            newstr = newstr.replaceAll(`]`, ``);
            newstr = newstr.split(`/`);
            */
            newstr = newstr.split(/[.\[\]\/]+/).filter(s => s.length);
            newpath.push(...newstr);
        } else {
            newpath.push(newstr);
        }
    });
    //console.log(newpath, jPath, path)
    //cachedPaths[jPath] = newpath;
    return [...newpath];
}

var paths = /*#__PURE__*/Object.freeze({
    __proto__: null,
    normalizePath: normalizePath
});

function giveColorWithTables(color,transparency){
    return `${color[0]},${color[1]},${color[2]},${transparency}`;
}

function givefont(size=16,style=`sans-serif`,type=``){
    return (`${style} ${size}px ${type}`); // bold ${13/(game.hud ? 1:camera.zoom)}px sans-serif
}

function measureText(text,renderer){
    game.ctx.font = utils.givefont(renderer.fontsize,renderer.fonttype,renderer.fontstyle);
    return game.ctx.measureText(text).width
}

var render = /*#__PURE__*/Object.freeze({
    __proto__: null,
    giveColorWithTables: giveColorWithTables,
    givefont: givefont,
    measureText: measureText
});

const utils$1 = {
    ...math,
    ...render,
    ...camera$1,
    ...paths
};

class events{
    constructor(){
        window.addEventListener(`resize`,events.resize);
        window.addEventListener(`keydown`,events.keyboard);
        window.addEventListener(`mousemove`,events.mousemove);
        window.addEventListener(`mousedown`,events.mousedown);
        window.addEventListener(`mouseup`,events.mouseup);
        window.addEventListener(`contextmenu`,events.preventRight);
    }
    static preventRight(event){
        event.preventDefault();
    }
    static resize(){
        game.canvas.width = game.window.width = window.innerWidth;
        game.window.height = game.canvas.height = window.innerHeight;
        game.ctx.textAlign = `center`;
    };
    static keyboard(info){
        //
        switch(info.key){
            case `w`:
                game.currentscene.camera.y-=5;
                break;
            case `a`:
                game.currentscene.camera.x-=5;
                break;
            case `s`:
                game.currentscene.camera.y+=5;
                break;
            case `d`:
                game.currentscene.camera.x+=5;
                break;
            case `e`:
                game.currentscene.camera.zoom+=1/4;
                break;
            case `q`:
                game.currentscene.camera.zoom-=1/4;
                break;
        }
                //
                
        events.mousemove();
    }
    static mousemove(info=game.mouse){
        game.mouse.x = info.x;
        game.mouse.y = info.y;
        let isover = false;
        for (let v in Object.values(game.currentscene.uiList)){
            if (v.ifover(info.x,info.y)){
                v.set(`mouse/over`,true);
                isover = true;
            } else if (v.get(`mouse/over`)==true){
                v.set(`mouse/over`,false);
            }
        }
        info = utils$1.unmap(info.x,info.y);
        game.mouse.filteredX = info.x;
        game.mouse.filteredY = info.y;
        utils$1.aroundChunk((c_info)=>{
            Object.values(c_info.chunk.mouseElements).forEach((v)=>{
                if (v.ifover(info.x,info.y)){
                    v.set(`mouse/over`,true);
                    isover = true;
                } else if (v.get(`mouse/over`)==true){
                    v.set(`mouse/over`,false);
                }
            });
        });
        if (isover){
            document.body.style.cursor = `pointer`;
        } else {
            document.body.style.cursor = `default`;
        }
        game.mouse.isover = isover;
    }
    static mousedown(info){
        let lor = info.button == 0 ? `left`: info.button==1 ? `middle`:`right`;
        if (lor==`middle`)info.preventDefault();
        for (let v in Object.values(game.currentscene.uiList)){
            if (v.ifover(info.x,info.y)){
                v.set(`mouse/${lor}/down`,true);
                v.set(`mouse/${lor}/dragging`,true);
            }
        }
        info = utils$1.unmap(info.x,info.y);
        utils$1.aroundChunk((c_info)=>{
            Object.values(c_info.chunk.mouseElements).forEach((v)=>{
                if (v.ifover(info.x,info.y)){
                    v.set(`mouse/${lor}/down`,true);
                    v.set(`mouse/${lor}/dragging`,true);
                }
            });
        });
    }
    static mouseup(info){
        let lor = info.button == 0 ? `left`: info.button==1 ? `middle`:`right`;
        if (lor==`middle`)info.preventDefault();
        for (let v in Object.values(game.currentscene.uiList)){
            if (v.ifover(info.x,info.y)){
                if (v.ifover(info.x,info.y)&&v.get(`mouse/${lor}/down`)==true){
                    v.set(`mouse/${lor}/down`,false);
                    v.set(`mouse/${lor}/dragging`, false);
                } else if (v.get(`mouse/${lor}/down`)==true){
                    v.system_set([`mouse`,lor,`down`],false);
                    v.set(`mouse/${lor}/dragging`, false);
                }
            }
        }
        info = utils$1.unmap(info.x,info.y);
        utils$1.aroundChunk((c_info)=>{
            Object.values(c_info.chunk.mouseElements).forEach((v)=>{
                if (v.ifover(info.x,info.y)&&v.get(`mouse/${lor}/down`)==true){
                    v.set(`mouse/${lor}/down`,false);
                    v.set(`mouse/${lor}/dragging`, false);
                } else if (v.get(`mouse/${lor}/down`)==true){
                    v.system_set([`mouse`,lor,`down`],false);
                    v.set(`mouse/${lor}/dragging`, false);
                }
            });
        });
    }
}

class chunk{
    constructor(scene,x,y){
        
        this.pos = {x,y};
        this.scene = scene;
        this.x = this.pos.x*this.scene.chunkSize;
        this.y = this.pos.y*this.scene.chunkSize;
        this.mouseElements = {};
        this.allElements = {};
        this.elements = {};
        this.renderChunk();
    }
    addElement(element){
        //console.log(`${element.Name} is joining chunk ${this.pos.x},${this.pos.y}.`)
        if (element.get(`properties/usesMouse`)){
            this.mouseElements[element.id] = element;
        }
        element.set(`properties/chunk`,this.pos);
        const color = element.color;
        const id = element.id;
        this.allElements[id] = element;
        let colormap;
        if (!this.elements[color]) this.elements[color] = {};
        colormap = this.elements[color];
        if (colormap[id])console.warn(`WARNING`);
        colormap[id] = element;
    }
    removeElement(element){
        //console.log(`${element.Name} is leaving chunk ${this.pos.x},${this.pos.y}.`)
        if (this.mouseElements[element.id]){
            delete this.mouseElements[element.id];
        }
        element.set(`properties/chunk`,{x:-1,y:-1});
        const color = element.color;
        const id = element.id;
        delete this.allElements[id];
        let colormap;
        if (!this.elements[color])return;
        colormap = this.elements[color];
        delete colormap[id];
        if (Object.keys(colormap).length<=0){
            delete this.elements[color];
        }
    }
    update(deltatime, delta){
        Object.values(this.allElements).forEach((key)=>{
            key.update(deltatime, delta);
        });
    }
    render(ctx){
        //this.renderChunk(ctx);
        Object.keys(this.elements).forEach((key)=>{
            //console.log(`rgb(${key})`)
            ctx.fillStyle = `rgb(${key})`;
            ctx.beginPath();
            Object.values(this.elements[key]).forEach((element)=>{
                element.render(ctx);
                ctx.closePath();
            });
            ctx.fill();
        });
    }
    renderChunk(ctx){
        /*const tomappos = utils.tomap(this.x,this.y);
        ctx.save();
        ctx.translate(tomappos.x,tomappos.y);
        ctx.fillRect(this.scene.chunkSize/2,this.scene.chunkSize/2,this.scene.chunkSize-5,this.scene.chunkSize-5)
        ctx.restore();
        */
    }
}

class camera{
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
        const chunk = game.currentscene.locateChunkByPos(this.x,this.y);
        const chunkpos = {x:chunk.pos.x,y:chunk.pos.y};
        const mychunkpos = this.chunk;
        if (chunkpos.x!=mychunkpos.x||chunkpos.y!=mychunkpos.y){
            this.chunk = chunkpos;
            console.log(chunkpos);
        }
    }
}

class scene{
    constructor(Name){
        this.Name = Name;
        this.game = game;
        this.chunks = {};
        this.uiList = {};
        this.chunkSize = 600;
        this.addCamera(new camera(this));
    }
    ifChunk(x=0,y=0){
        window.chunk = this;
        if (!this.chunks[`${x}`])return;
        if (!this.chunks[`${x}`][`${y}`])return;
        return true;
    }
    moveElementToChunk(element,newchunk){
        element.chunk.removeElement(element);
        newchunk.addElement(element);
    }
    giveChunk(x,y){
        if (!this.ifChunk(x,y)){
            this.insertChunk(x,y);
        }
        //console.log(this.ifChunk(x,y));
        return this.chunks[`${x}`][`${y}`];
    }
    insertChunk(x,y){
        if (this.ifChunk(x,y))console.warn(`STOP MAKING CHUNKS IN ${x},${y}`);
        if (!this.chunks[`${x}`]);this.chunks[`${x}`]={};
        this.chunks[`${x}`][`${y}`] = new chunk(this,x,y);
    }
    locateChunkByPos(x,y){
        const newX = Math.floor(x/this.chunkSize);
        const newY = Math.floor(y/this.chunkSize);
        return this.giveChunk(newX,newY);
    }
    addElement(element){
        if (element.get(`properties/ui`)){
            element.setToUi();
            return;
        }
        const chunk = this.locateChunkByPos(element.x,element.y);
        if (!chunk)return;
        chunk.addElement(element);
    }
    removeElement(element){
        const chunk = element.chunk;
        chunk.removeElement(element);
    }
    addCamera(camera){
        this.camera = camera;
        camera.scene = this;
    }
    render(ctx){
        utils$1.aroundChunk((info)=>{
            info.chunk.render(ctx);
        });
    }
    update(deltatime){
        const delta = deltatime*60/1000;
        utils$1.aroundChunk((info)=>{
            info.chunk.update(deltatime, delta);
        });
    }
}

function frame$2(timestamp=0){
    if (!game.time)game.time = timestamp;

    const deltatime = timestamp - game.time;
    game.time = timestamp;

    //console.log(deltatime/1000*3600)

    game.ctx.clearRect(0,0,game.window.width,game.window.height);

    game.currentscene.update(deltatime);
    for (let value in Object.values(game.currentscene.uiList)){
        value.update(deltatime, deltatime*60/1000);
    }

    game.currentscene.render(game.ctx);

    for (let value in Object.values(game.currentscene.uiList)){
        game.ctx.beginPath();
        game.ctx.fillStyle = `rgb(${value.color})`;
        value.render(game.ctx);
        game.ctx.fill();
    }

    requestAnimationFrame(frame$2);
}

class types{
    static box = {
        render: (ctx,dime)=>{
            ctx.roundRect(-dime.width/2,-dime.height/2,dime.width,dime.height,0);
            ctx.closePath();
        }
        ,ifover(x1,y1,hd){
            let {x,y} = utils$1.rotatepoint(x1,y1,hd.rotation,hd.x,hd.y);
            return (x>hd.x-hd.width/2&&x<hd.x+hd.width/2&&y<hd.y+hd.height/2&&y>hd.y-hd.height/2);
        }
    }
    static arc = {
        render: (ctx,dime)=>{
            ctx.arc(0,0,dime.radius,0,2*Math.PI);
            ctx.closePath();
        }
        ,ifover(x,y,hd){
            return utils$1.distance(x,y,hd.x,hd.y)<hd.radius;
        }
    }
    static txt = {
        render: (ctx,dime,renderer)=>{
            ctx.font = utils$1.givefont(dime.fontsize,renderer.fonttype,renderer.fontstyle);
            ctx.fillText(renderer.string, 0, dime.fontsize/4);
        }
        ,ifover(x,y,hd,hb,element){
            //x:hd.x,y:hd.y,width:element.textWidth,height:element.dime.fontsize
            return types[`box`].ifover(x,y,hd);
        }
    }
}

let idList = {};

class utilities {
    static generateId = function(length = 28){
        const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=+_|!@#$%^&*()`;
        let result = ``;
        for (let i=0; i<length-4; i++){
            result+=chars.charAt(Math.floor(Math.random()*chars.length));
        }
        if (idList[result]){
            console.log(`Damn lucky day! `, result);
            result = utilities.generateId(length);
        }
        let gen = Math.floor(Math.random()*(result.length+1));
        result = result.slice(0, gen) + 'gen-' + result.slice(gen);
        idList[result] = true;
        return result;
    }
    static normalize_path(...path){
        let newpath = [];
        path.forEach((part)=>{
            switch(typeof part){
                case `string`:
                    newpath.push(
                        ...part
                            .replaceAll(`.`,`/`)
                            .replaceAll(`[`,`/`)
                            .replaceAll(`]`,``)
                            .split(`/`)
                    );
                    break;
                default:
                    newpath.push(part);
                    break;
            }
        });
        return newpath;
    }
    static system_signal_converter(signal=`/`,type=`set`){
        return `*v9$:$${type[0]}?{>${utilities.normalize_path(signal).join(`>`)}}*`;
    }
    static ctxUse(script,module,type){
        return (...args)=>{
            module.set_context(script);
            let call = script.proto[type].call(module,...args);
            module.remove_context();
            if (typeof call != `object`)return;
            Object.assign(script,call);
        }
    }
}

class base_module{
    #context = [];
    #files = {
        scripts_storage:{}
        ,signals_storage:{}
    };
    get id(){
        return this.#files[`id`];
    }
    get context(){
        return this.#context[this.#context.length-1];
    }
    set_context(context){
        return this.#context.push(context);
    }
    remove_context(){
        return this.#context.pop();
    }
    system_set(path=[],value=0){
        let current = this.#files;
        let oldValue;
        for (let part = 0; part<path.length-1; part++){
            if (typeof current[path[part]] != `object`)current[path[part]]={};
            current = current[path[part]];
        }
        oldValue = current[path[path.length-1]];
        current[path[path.length-1]] = value;
        return [oldValue,value,...path];
    }
    system_delete(path=[]){
        let current = this.#files;
        let oldValue;
        for (let part = 0; part<path.length-1; part++){
            if (typeof current[path[part]] != `object`)return [undefined,false,...path];
            current = current[path[part]];
        }
        oldValue = current[path[path.length-1]];
        delete current[path[path.length-1]];
        return [oldValue,true,...path];
    }
    system_get(path=[]){
        let current = this.#files;
        for (let part = 0; part<path.length-1; part++){
            if (typeof current[path[part]] != `object`)return;
            current = current[path[part]];
        }
        return current[path[path.length-1]];
    }
    set(...path){
        let value = path.pop();
        let normalized_path = utilities.normalize_path(...path);
        let change = this.system_set(normalized_path,value);
        if (change[0]==value)return;
        let newpath = ``;
        this.emit(`*v9$:$s?{>>}*`,change);
        normalized_path.forEach((part)=>{
            newpath+=`>${part}`;
            this.emit(`*v9$:$s?{${newpath}>}*`,change);
        });
        this.emit(`*v9$:$s?{${newpath}}*`,change);
    }
    get(...path){
        return this.system_get(utilities.normalize_path(...path));
    }
    delete(...path){
        let normalized_path = utilities.normalize_path(...path);
        let change = this.system_delete(normalized_path);
        if (!change[1])return;
        let newpath = ``;
        this.emit(`*v9$:$d?{>>}*`,change);
        normalized_path.forEach((part)=>{
            newpath+=`>${part}`;
            this.emit(`*v9$:$d?{${newpath}>}*`,change);
        });
        this.emit(`*v9$:$d?{${newpath}}`,change);
    }
    constructor(config,...scripts){
        Object.assign(this.#files,config,{scripts_storage:{},signals_storage:{},id:utilities.generateId()});
        scripts.forEach((script)=>{
            this.insert(...script);
        });
    }
}

function script_handler$1(sCls)
{
    return class extends sCls 
    {
        insert
        (
            script
            ,...args
        )
        {
            let stored_script = 
            {
                id: utilities.generateId()
                ,info:args
                ,proto: script
            };
            stored_script.run = utilities.ctxUse
            (
                stored_script
                ,this
                ,`fired`
            );
            this.set
            (
                `scripts_storage/${stored_script.id}`
                ,stored_script
            );
            this.set
            (
                `signals_storage/${stored_script.proto.signal}/${stored_script.id}`
                ,true
            );
            return stored_script.id;
        }
        remove
        (script=this.context)
        {
            if (typeof script == `string`)script = this.script(script);
            this.set();
        }
        script
        (id=this.context.id)
        {
            return this.system_get
            (
                [
                    `scripts_storage`
                    ,id
                ]
            );
        }
        emit
        (signal,...args)
        {
            /*console.log(
                `%cEmit from '%c${this.id}%c': %c${signal}`
                ,"color: pink"
                ,"color: yellow"
                ,"color: pink"
                ,"color: orange"
            );*/
            let scripts = this.system_get
            (
                [
                    `signals_storage`
                    ,signal
                ]
            );
            if (!scripts)return;
            Object.keys(scripts).forEach((id)=>
            {
                let script = this.script(id);
                script.run
                (
                    ...args,
                    ...script.info
                );
            });
        }
    }
}

let module$1 = class module extends script_handler$1(base_module){};

const FILE_VALUE_DEFAULTS = 
{
    properties:
    {
        x:0
        ,y:0
        ,chunk:{x:0,y:0}
        ,ui: false
        ,inUi: false
    }
    ,renderer:
    {
        type:`box`
        ,x:0
        ,y:0
        ,width:30
        ,height:30
        ,radius:15
        ,string: `String`
        ,fonttype: `bold`
        ,fontstyle: `sans-serif`
        ,fontsize: 20
        ,roundedness:0
        ,color:[0,0,0]
        ,rotation:0
        ,transparency: 1
    }
    ,hitbox:
    {
        type:`box`
        ,x:0
        ,y:0
        ,rotation:0
        ,width:30
        ,height:30
        ,radius:15
    }
    ,reactions: {}
    ,reactionsList: {}
    ,nodes: {}
    ,mouse: 
    {
        over:false
        ,left:{
            over:false
            ,dragging:false
        }
        ,right:{
            over:false
            ,dragging:false
        }
        ,middle:{
            over:false
            ,dragging:false
        }
    }
};

class baseElement extends module$1 {

    // FUNCTIONS

    update // Sends out an emit for frame updates, used by nodes, or scripts with the signal.
    (...args)
    {
        this.emit("-u$u",...args);
    }

    render // currently renders the element, soon to be changed to an emit signal, and then this rendering will be added to a system preset
    (ctx)
    {
        const dime = this.dime;
        
        ctx.save();
        ctx.translate(dime.x, dime.y);

        const rend = this.system_get([`renderer`]);

        types[rend.type].render(ctx, dime, rend);
        ctx.restore();
    }
    
    has // Uses system_has function in baseElement to check if some value exists in files
    (...path)
    {
        return this.system_has(utils$1.normalizePath(path));
    }

    system_has // Uses system_get in module to check if some value exists in files
    (path)
    {
        return this.system_get(path)!==undefined
    }

    // CONSTRUCTURE

    constructor
    (
        properties = {}
        ,renderer = {}
        ,hitbox = {}
        ,...scripts
    )
    {
        // Makes a clone so that no default value references are shared between 2 elements
        const deep_cloned_defaults = structuredClone(FILE_VALUE_DEFAULTS);

        // Assigns user values to properties, renderer, and hitbox files and then making sure the defaults are applied.
        deep_cloned_defaults.properties = 
        {
            ...deep_cloned_defaults.properties
            ,...properties
        };
        deep_cloned_defaults.renderer = 
        {
            ...deep_cloned_defaults.renderer
            ,...renderer
        };
        deep_cloned_defaults.hitbox = 
        {
            ...deep_cloned_defaults.hitbox
            ,...hitbox
        };
        
        // Calling for module to assign the new main files to the current module/element.
        super
        (
            deep_cloned_defaults
        );

        if 
        (scripts.length<1)
        return;

        let possible_initilization = scripts.pop();

        if 
        (typeof possible_initilization != `function`)
        {
            scripts.push(possible_initilization);
            possible_initilization = false;
        }

        this.use
        (...scripts);

        if 
        (possible_initilization)
        {
            possible_initilization.call(this);
        }
    }
}






/*
export class baseElement{
    #scopes = {
        "properties": {
            x:0
            ,y:0
            ,id:null
            ,chunk:{x:0,y:0}
            ,ui: false
            ,inUi: false
            ,Name: `No Name`
        }
        ,"renderer": {
            type:`box`
            ,x:0
            ,y:0
            ,width:30
            ,height:30
            ,radius:15
            ,string: `String`
            ,fonttype: `bold`
            ,fontstyle: `sans-serif`
            ,fontsize: 20
            ,roundedness:0
            ,color:[0,0,0]
            ,rotation:0
            ,transparency: 1
        }
        ,"reactions": {}
        ,"reactionsList": {}
        ,"script_storage": {}
        ,"signals_storage": {}
        ,"hitbox": {
            type:`box`
            ,x:0
            ,y:0
            ,rotation:0
            ,width:30
            ,height:30
            ,radius:15
        }
        ,"nodes": {}
        ,"mouse": {
            over:false
            ,left:{
                over:false
                ,dragging:false
            }
            ,right:{
                over:false
                ,dragging:false
            }
            ,middle:{
                over:false
                ,dragging:false
            }
        }
    }
    isElement=true;
    isDestroyed=false;
    #nodeStack=[];
    #internal_setup(){
        let r = this.#scopes[`renderer`];
        let p = this.#scopes[`properties`];
        let h = this.#scopes[`hitbox`];

        if (!types[r.type]){
            console.warn(`${r.type} is not a valid rendering type for '${this.Name}'.(SYSTEM WARNING)`)
            r.type = `box`;
        }
        if (!types[h.type]){
            console.warn(`${h.type} is not a valid hitbox type for '${this.Name}'.(SYSTEM WARNING)`)
            h.type = `box`;
        }
        if (r.type==`txt`){
            this.set(`renderer/width`,this.Width);
            this.set(`renderer/height`,this.dime.fontsize);
        }
    }
    get scopes(){
        return JSON.parse(JSON.stringify({...this.#scopes}));
    }
    get currentNode(){
        return this.#nodeStack[this.#nodeStack.length-1];
    }
    get linked(){
        if (!this.currentNode)return;
        if (!this.currentNode.linked)return [];
        return Object.keys(this.currentNode.linked);
    }
    get secondaryNode(){
        if (!this.currentNode)return;
        let link = this.linked[0];
        if (!link) return;
        return this.anyNodeById(link);
    }
    system_set_currentNode(node){
        this.#nodeStack[this.#nodeStack.length] = node;
    }
    set_context(script){
        this.#nodeStack[this.#nodeStack.length] = script;
    }
    remove_context(){
        this.#nodeStack.pop();
    }
    system_remove_currentNode(){
        this.#nodeStack.pop();
    }
    get textWidth(){
        let dime = this.dime;
        let renderer = this.#scopes[`renderer`];
        game.ctx.font = utils.givefont(dime.fontsize,renderer.fonttype,renderer.fontstyle)
        return game.ctx.measureText(renderer.string).width*game.currentscene.camera.zoom
    }
    get Name(){
        return this.#scopes[`properties`].Name;
    }
    get x(){
        return this.#scopes[`properties`].x;
    }
    get y(){
        return this.#scopes[`properties`].y;
    }
    get color(){
        return utils.giveColorWithTables(this.#scopes[`renderer`].color,this.#scopes[`renderer`].transparency);
    }
    get chunk(){
        let c = this.#scopes[`properties`].chunk;
        return game.currentscene.giveChunk(c.x,c.y);
    }
    get id(){
        return this.#scopes[`properties`].id
    }
    get getInfo(){
        return {
            color: this.color
            ,id: this.id
            ,chunk: this.chunk
        }
    }
    ifover(x,y){
        let hd = this.hitboxDime;
        return types[this.#scopes[`hitbox`].type].ifover(x,y,hd,this.#scopes[`hitbox`],this);
    }
    #setScope(scope,startingVal){
        if (this.#scopes[scope]){
            console.warn(`${scope} is already a scope for ${this.Name}.`);
            return;
        }
        this.#scopes[scope] =  startingVal;
    }
    render(ctx){
        if (this.isDestroyed) return;
        const dime = this.dime;
        
        ctx.save();
        ctx.translate(dime.x, dime.y);

        types[this.#scopes[`renderer`].type].render(ctx, dime, this.#scopes[`renderer`]);
        ctx.restore();
    }
    get(...path){
        path = utils.normalizePath(path);
        return this.system_get(path);
    }
    set(...path){
        let val = path.pop();
        path = utils.normalizePath(path);
        //console.log(`is a safe one`)
        let [value,oldvalue,centeral,...newpath] = this.system_set(path,val);
        path = newpath;
        if (oldvalue==value)return;
        let events = this.get("reactions",centeral,...path,"events");
        if (!events)return;
        for (let e in events)
        {
            let event = events[e];
            if (!event.active)continue;
            if (!event.checkNode(oldvalue,value))continue;
            let da = event.runNode([oldvalue,value],...event.info);
            if (da)Object.assign(event,da);
            if (!event.node.triggerTimes)continue;
            event.node.triggerTimes--;
            if (event.node.triggerTimes>0)continue;
            this.deleteEventNode(event);
        }
    }
    has(...path){
        return this.system_has(utils.normalizePath(path));
    }
    delete(...path){
        path = utils.normalizePath(path);
        let centeral = path.shift();
        let current = this.#scopes[centeral];
        if (!current)return;
        for (let i = 0; i<path.length-1; i++){
            if (current[path[i]]===undefined)return false;
            current = current[path[i]];
        }
        delete current[path[path.length-1]];
    }
    system_set(path,value){
        let oldvalue;
        path = [...path];
        let centeral = path.shift();
        let current = this.#scopes[centeral]
        if (!current){
            this.#setScope(centeral, value);
            current = this.#scopes[centeral];
            if (path.length<=0)return [value,undefined,centeral];
        }
        for (let i = 0; i<path.length-1; i++){
            if (typeof current[path[i]] !== 'object' || current[path[i]] === null) {
                current[path[i]] = {};
            }
            current = current[path[i]];
        }
        oldvalue = current[path[path.length-1]];
        //console.log(path[path.length-1]);
        current[path[path.length-1]] = value;
        return [value, oldvalue, centeral, ...path];
    }
    system_get(path){
        let centeral = path.shift();
        let current = this.#scopes[centeral]
        for (let i in path){
            if (current[path[i]]===undefined)return undefined;
            current = current[path[i]];
        }
        return current;
    }
    system_has(path){
        return this.system_get(path)!==undefined
    }
    destroy(){
        game.removeElement(this);
        this.isDestroyed=true
        this.customdestroy()
        
        this.#scopes[`reactionsList`] = {};
        this.#scopes[`reactions`] = {};
        this.#scopes[`nodes`] = {};

        for (let i in this){
            //this[i] = undefined;
        }
    }
    batchSet(...paths){
        paths.forEach((path)=>{
            this.set(...path)
        })
    }
    batchGet(...paths){
        return paths.map(path => this.get(...path));
    }
    batchHas(...paths){
        return paths.map(path => this.has(...path));
    }
    batchDelete(...paths){
        paths.forEach((path)=>{
            this.delete(...path)
        })
    }
    update(deltatime, delta){
        if (this.isDestroyed)return;
        this.customupdate(deltatime,delta);
        Object.values(this.#scopes[`nodes`]).forEach((node)=>{
            //let da = node.node.update({element:this,key:node})
            if (!node.active)return;
            let da = node.runNode(delta,...node.info);
            if (!da)return;
            Object.assign(node,da);
        });
    }
    setToUi(){
        if (this.#scopes[`properties`].inUi)return;
        this.set(`properties/inUi`,true);
        if (this.chunk) this.chunk.removeElement(this);
        game.currentscene.uiList[this.id] = this;
    }
    removeFromUi(){
        if (!this.#scopes[`properties`].inUi)return;
        delete game.currentscene.uiList[this.id];
        game.currentscene.addElement(this);
    }
    setup(){};customdestroy(){};customupdate(){};
    constructor(properties,renderer,hitbox,...allNodes){
        Object.assign(this.#scopes[`properties`],properties);
        Object.assign(this.#scopes[`renderer`],renderer);
        Object.assign(this.#scopes[`hitbox`],hitbox)
        this.#scopes[`properties`].id = game.generateId();
        this.setup();
        
        let setup = (typeof allNodes[allNodes.length-1] == `function`) ? allNodes.pop() : false;
        //this.add(...allNodes);
        
        //this.add(...game.presets.system_presets.element);
        this.#internal_setup();
        if (setup)setup.call(this, allNodes.length, game.presets.system_presets.element.length);
    }
}

*/

function dHan(sCls){
    return class extends sCls{
        get dime(){
            const r = this.system_get([`renderer`]);
            const p = this.system_get([`properties`]);
            if (p.ui){
                return {
                    x: Math.round(p.x+r.x)
                    ,y: Math.round(p.y+r.y)
                    ,width: Math.round(r.width)
                    ,height: Math.round(r.height)
                    ,radius: Math.round(r.radius)
                    ,fontsize: r.fontsize
                    ,rotation: r.rotation
                }
            }
            const camera = game.currentscene.camera;
            const tomappos = utils$1.tomap(p.x+r.x,p.y+r.y);
            return {
                x: Math.round(tomappos.x)
                ,y: Math.round(tomappos.y)
                ,width:Math.round(r.width/camera.zoom)
                ,height:Math.round(r.height/camera.zoom)
                ,radius:Math.round(r.radius/camera.zoom)
                ,fontsize: r.fontsize/camera.zoom
                ,rotation: r.rotation
            }
        }
        get hitboxDime(){
            let h = this.system_get([`hitbox`]);
            return {
                x: this.x+h.x
                ,y: this.y+h.y
                ,type: h.type
                ,width: h.width
                ,height: h.height
                ,radius: h.radius
                ,rotation: h.rotation
            }
        }
    }
}

function 
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
            console.log(rend.color);
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

function
script_handler
(
    SUPER_CLASS
)
{
    return class extends
    SUPER_CLASS
    {
        // FUNCTIONS

        use
        (...scripts)
        {
            for 
            (let i in scripts)
            {
                if 
                (Array.isArray(scripts[i]))
                {
                    this.insert(...scripts[i]);
                } 
                else 
                {
                    this.insert(scripts[i]);
                }
            }
        }
    }
}

class element extends 

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

class entity extends element {
    constructor(properties,renderer,hitbox,...allNodes){
        super(properties,renderer,hitbox,...allNodes);
    }
    setup(){
        let hI;
        if(!this.get(`vitals`))this.set(`vitals`,{});
        if (!this.get(`vitals/maxHealth`))this.set(`vitals/maxHealth`,100);
        if (!this.get(`vitals/health`))this.set(`vitals/health`,100);
        hI = this.getHealthInfo;
        this.batchSet(
            [`vitals/healthPercentage`,hI.health/hI.maxHealth]
            ,[`vitals/lastDamaged`,null]
            ,[`vitals/entitiesThatDamaged`,new Map()]
            ,[`vitals/lastDamageDealtTo`,null]
            ,[`vitals/lastDamageDealtAmount`,0]
            ,[`vitals/entitiesKilled`,0]
            ,[`vitals/entitiesThatThisDamaged`,new Map()]
        );
    }
    get health(){
        return this.get(`vitals/health`);
    }
    get healthPercentage(){
        return this.get(`vitals/healthPercentage`)
    }
    get getHealthInfo(){
        return {
            health: this.health
            ,maxHealth: this.get(`vitals/maxHealth`)
            ,healthPercentage: this.healthPercentage
            ,lastDamaged: this.get(`vitals/lastDamaged`)
            ,entitiesThatDamaged: this.get(`vitals/entitiesThatDamaged`)
        }
    }
    get getDamageInfo(){
            return {
                lastDamageDealtTo: this.get(`vitals/lastDamageDealtTo`)
                ,lastDamageDealtAmount: this.get(`vitals/lastDamageDealtAmount`)
                ,entitiesThatThisDamaged: this.get(`vitals/entitiesThatThisDamaged`)
                ,entitiesKilled: this.get(`vitals/entitiesKilled`)
            }
    }
    Damage(damage,entity){
        if (!entity)return;else if(!entity.isElement)return;
        const oldhealth = this.get(`vitals/health`);
        const eid = entity.id;
        const id = this.id;
        this.set(`vitals/health`,oldhealth-damage);
        this.set(`vitals/lastDamaged`,eid);
        let hI = this.getHealthInfo;
        this.set(`vitals/healthPercentage`,hI.health/hI.maxHealth);

        if (!hI.entitiesThatDamaged.has(eid)){
            let newMap = hI.entitiesThatDamaged;
            newMap.set(eid,{
                id: eid
                ,times: 1
                ,totalDamage: damage
                ,lastDamage: damage
            });
        } else {
            let newMap = hI.entitiesThatDamaged;
            let oldMap = newMap.get(entity.id);
            newMap.set(eid,{
                id: eid
                ,times: oldMap.times+1
                ,totalDamage: ((oldMap.totalDamage)+damage)
                ,lastDamage: damage
            });
            this.set(`vitals/entitiesThatDamaged`,newMap);
        }

        entity.set(`vitals/lastDamageDealtTo`,id);
        entity.set(`vitals/lastDamageDealtAmount`,damage);
        let dI = entity.getDamageInfo;
        if (!dI.entitiesThatThisDamaged.has(id)){
            let newMap = dI.entitiesThatThisDamaged;
            newMap.set(id,{
                id: id
                ,times: 1
                ,totalDamage: damage
                ,lastDamage: damage
            });
        } else {
            let newMap = dI.entitiesThatThisDamaged;
            let oldMap = dI.entitiesThatThisDamaged.get(id);
            newMap.set(id,{
                id: id
                ,times: oldMap.times+1
                ,totalDamage: ((oldMap.totalDamage)+damage)
                ,lastDamage: damage
            });
        }

        if (damage>=oldhealth){
            let amm = dI.entitiesKilled+1;
            entity.set(`vitals/entitiesKilled`,amm);
            entity.set(`vitals/entitiesKilledAmount`,dI.entitiesKilledAmount+1);
            this.death();
        }    }
    dealDamage(damage,entity){
        entity.Damage(damage,this);
    }
    death(){
        const hI = this.getHealthInfo;
        console.log(`${this.Name} has died to ${game.allElements[hI.lastDamaged].Name}!`);
        this.destroy();
    };
    customdestroy(){
        const id = this.id;
        let eTTD = this.get(`vitals/entitiesThatThisDamaged`);
        let eTD = this.get(`vitals/entitiesThatDamaged`);
        for (let [ki,vi] of eTTD){
            let entity = game.allElements[vi.id];
            let newMap = entity.get(`vitals/entitiesThatDamaged`);
            newMap.delete(id);
            entity.set(`vitals/entitiesThatDamaged`,newMap);
        }
        for (let [kv, vv] of eTD){
            let entity = game.allElements.get(vv.id);
            let newMap = entity.get(`vitals/entitiesThatThisDamaged`);
            newMap.delete(id);
            entity.set(`vitals/entitiesThatThisDamaged`,newMap);
        }
    }
    customupdate(deltatime){

    }
}

class eventNode{
    #defaults = {
        triggerTimes: 0
        ,active: true
        ,condition:function(){return true;}
        ,trigger:function(){return true;}
        ,Name:`eventNode`
        ,tags:[]
        ,path:[`properties/health`]
        ,onApply:function(){}
        ,onFinished:function(){}
    }
    constructor(Name, tags, path, condition, trigger, triggerTimes, onApply, onFinished){
        if (typeof Name !== `object`){Name={Name, tags, path, condition, trigger, triggerTimes, onApply, onFinished};}
        Object.assign(
            this
            ,{...this.#defaults}
            ,Object.fromEntries(
                Object.entries(Name).filter(([_, v]) => v !== undefined)
            )
        );
        this.tags = utils$1.normalizePath(this.tags);
        this.path = utils$1.normalizePath(this.path);
        this.type = `eventNode`;
    }
}

let en$2 = eventNode;

function urp(path,[ov,v]){ // update renderer property
    let chunk = this.chunk;
    if (!chunk)return;
    this.system_set([`renderer`,path],ov);
    chunk.removeElement(this);
    this.system_set([`renderer`,path],v);
    chunk.addElement(this);
}
function pc(type){ // position changed
    let chunk = this.chunk;
    if (!chunk)return;
    let newchunk = game.currentscene.locateChunkByPos(this.x,this.y);
    if (!newchunk)return;
    if (chunk.pos[type]!=newchunk.pos[type]){
        game.currentscene.moveElementToChunk(this,newchunk);
    }
}

let system_presets = {
    element: [
        [new en$2(`xPositionChange`,[`system/presets/x/position/change`],[`properties/x`],undefined,function(){pc.call(this,`x`);})]
        ,[new en$2(`yPositionChange`,[`system/presets/y/position/change`],[`properties/y`],undefined,function(){pc.call(this,`y`);})]
        ,[new en$2(`colorChange`,[`system/presets/color`],[`renderer/color`],undefined,function(v){urp.call(this,`color`,v);})]
        ,[new en$2(`transparencyChange`,[`system/presets/transparency`],[`renderer/transparency`],undefined,function(v){urp.call(this,`transparency`,v);})]
        ,[new en$2(`uiOn`,[`ui/system/on`],[`properties/ui`],function(ov,v){return v;},function(){this.setToUi();})]
        ,[new en$2(`uiOff`,[`ui/system/off`],[`properties/ui`],function(ov){return ov;},function(){this.removeFromUi();})]
        ,[new en$2(`usesMouseChange`,[`system/input`],[`properties/usesMouse`],undefined,function(){let chunk = this.chunk;if(!chunk)return;game.currentscene.moveElementToChunk(this,chunk);})]
    ]
};

var system_presets$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    system_presets: system_presets
});

class node{
    #defaults = {
        Name:`node`
        ,tags:[]
        ,onApply:function(){}
        ,update:function(){}
        ,onFinished:function(){}
        ,type:`node`
    }
    constructor(Name, tags, update, onApply, onFinished){
        if (typeof Name !== `object`){Name={Name, tags, update, onApply, onFinished, type:`node`};}
        Object.assign(
            this
            ,{...this.#defaults}
            ,Object.fromEntries(
                Object.entries(Name).filter(([_, v]) => v !== undefined)
            )
        );
        this.tags = utils$1.normalizePath(this.tags);
        this.type = `node`;
    }
}

let en$1 = eventNode;

let mT = [`mouse`];

function mouseFn(v,fn,...args){ // when the mouse leaves or enters
    let call = fn.call(this,...args);
    if (call){if(call.info)call.info.unshift(fn);}    return call;
}

function sumt(fn){ // sets uses mouse true
    this.set(`properties/usesMouse`,true);
    if (!fn){
        return {info:[function(){}]}
    }
}

function rfum(){ // removes from uses mouse
    if (this.searchForEventNodeByTag(mT).length<=0){
        this.set(`properties/usesMouse`,false);
    }
}

/*

function makeItWork(element, ){

}

Dragging: new en({
    condition(ov,v){
        return v; 
    }
    trigger(v,...args){
        this.do(
            new game.node({
                update:mouseFn
            }
            ,...args
        )
    }
})


*/

new node({
    update(delta, fn, ...args){
        fn.call(this, ...args);
    }
});


function rpths(path){ // returns paths
    return {
        Down: new en$1(`mouseDown`,[`mouse/presets/down/${path}`],[`mouse/${path}/down`],rv,...mE)
        ,Up: new en$1(`mouseUp`,[`mouse/presets/up/${path}`],[`mouse/${path}/down`],rov,...mE)
        ,Dragging: new en$1({
            path:[`mouse/${path}/dragging`]
            ,condition:rv
            ,trigger(){
                this.do(

                );
            }
            ,onApply:sumt
            ,onFinished:rfum
        })
    }
}

function rv(ov,v){return v;} // return value
function rov(ov){return ov;} // return old value(reversed)

let mE = [mouseFn,0,sumt,rfum]; // main functions

let mouse = {
    Enters: new en$1(`mouseEntered`,[`mouse/presets/entered`],[`mouse/over`],rv,...mE)
    ,Leaves: new en$1(`mouseLeft`,[`mouse/presets/left`],[`mouse/over`],rov,...mE)
    ,Left:rpths(`left`)
    ,Right:rpths(`right`)
    ,Middle:rpths(`middle`)
};

var mouse$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    mouse: mouse
});

let effect = class {
    node;
    constructor(Name,tags,onApply,update,onFinished){
        this.node = new node(Name,tags,onApply,update,onFinished);
        this.Name = this.node.Name;
        this.tags = this.node.tags;
        this.type = this.node.type;
    }
    onApply(time=1, ...info){
        time*=60;//utils.tosec(time)*1000/16.6666;
        let app = this.currentNode.node.node.onApply.call(this,...info);
        if (app){
            if (!app.info){app.info=[];}
            app.info = [time,...app.info];
            return app;
        }        return {info:[time,...info]};
    }
    update(delta, time,...info){
        if (time<=0){
            this.remove();
            return;
        }
        time-=delta;
        let upd = this.currentNode.node.node.update.call(this, delta, ...info);
        if (upd){
            if (!upd.info){upd.info=[];}
            upd.info = [time,...upd.info];
            return upd;
        }
        return {info:[time,...info]};
    }
    onFinished(time,...info){
        let fin = this.currentNode.node.node.onFinished.call(this,...info);
        if (fin){
            if (!fin.info){fin.info=[];}            fin.info = [time,...fin.info];
            return fin;
        }
    }
};

var effect$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    effect: effect
});

let en = eventNode;

let Links = {
    arc:
    [
        new en({
            path:[`renderer/radius`]
            ,tags:[`arc`]
            ,trigger:function([ov,v]){
                this.system_set(`hitbox/radius`,v);
            }
            ,onApply:function(){
                this.set(`hitbox/radius`,this.system_get([`renderer`,`radius`]));
            }
        })
    ]
    ,box:
    [
        new en({
            path:[`renderer/width`]
            ,tags:[`box`]
            ,trigger:function([ov,v]){
                this.set(`hitbox/width`,v);
            }
            ,onApply:function(){
                this.set(`hitbox/width`,this.system_get([`renderer`,`width`]));
            }
        })
        ,new en({
            path:[`renderer/height`]
            ,tags:[`box`]
            ,trigger:function([ov,v]){
                this.set(`hitbox/height`,v);
            }
            ,onApply:function(){
                this.set(`hitbox/height`,this.system_get([`renderer`,`height`]));
            }
        })
    ]
    ,txt:
    [
        new en({
            path:[`renderer/string`]
            ,tags:[`txt`]
            ,trigger:function([ov,v]){
                let rend = this.system_get([`renderer`]);
                let length = utils$1.measureText(v,rend);
                this.set(`hitbox/width`,length);
                this.set(`hitbox/height`,rend.fontsize);
            }
            ,onApply:function(){
                let rend = this.system_get([`renderer`]);
                let length = utils$1.measureText(rend.string,rend);
                this.set(`hitbox/width`,length);
                this.set(`hitbox/height`,rend.fontsize);
            }
        })
    ]
};

let Base = [
    new en({
        path:[`renderer/rotation`]
        ,trigger:function([ov,v]){
            this.set(`hitbox/rotation`,v);
        }
        ,onApply:function(){
            this.set(`hitbox/rotation`,this.system_get([`renderer`,`rotation`]));
        }
    })
    ,new en({
        path:[`renderer/x`]
        ,trigger:function([ov,v]){
            this.set(`hitbox/x`,v);
        }
        ,onApply:function(){
            this.set(`hitbox/x`,this.system_get([`renderer`,`x`]));
        }
    })
    ,new en({
        path:[`renderer/y`]
        ,trigger:function([ov,v]){
            this.set(`hitbox/y`,v);
        }
        ,onApply:function(){
            this.set(`hitbox/y`,this.system_get([`renderer`,`y`]));
        }
    })
];

let linkHitboxToRenderer = 
[
    new en({
        path:[`renderer/type`]
        ,tags:[`linkHitboxToRenderer`]
        ,trigger:function([ov,v]){
            this.set(`hitbox/type`,v);
            this.remove(...this.anyNodeByTag(ov));
            this.add(...Links[v]);
        }
        ,onApply:function(){
            let rType = this.system_get([`renderer`,`type`]);
            this.set(`hitbox/type`,rType);
            this.add(...Base);
            this.add(
                ...Links[rType]
            );
        }
    })
];

var linkHitboxToRenderer$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    linkHitboxToRenderer: linkHitboxToRenderer
});

class script {
    #defaults = {
        fired:function(){}
        ,signal: `script`
    }
    constructor(configuration){
        Object.assign(this,this.#defaults,configuration,{type:`script`});
    }
}

const convert = utilities.system_signal_converter;
const EVENT_SCRIPT_DEFAULTS = 
{
    path: `properties/x`
    ,fired(){}
    ,on_insert(){}
    ,on_removal(){}
    ,detect: `set`
};

class event extends script
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
            });
        }
        else
        {
            raw_path = path;
            raw_detect = detect;
            rest = 
            {
                fired: fired_function
                ,on_insert: on_insert_function
                ,on_removal: on_removal_function
                ,event_node: true
            };
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

var event$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    event: event
});

const FRAME_SCRIPT_DEFAULTS = 
{
    fired_function(){}
    ,on_insert_function(){}
    ,on_removal_function(){}
    ,detect: `update`
};

class frame extends script
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
            );
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
            };
        }
        super
        (
            {
                ...rest
                ,signal: `-u$${raw_detect[0]}`
            }
        );
    }
}

var frame$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    frame: frame
});

const scripts = {
    ...event$1
    ,...frame$1
};

var scripts$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    scripts: scripts
});

let presets = {
    ...system_presets$1
    ,...mouse$1
    ,...effect$1
    ,...linkHitboxToRenderer$1
    ,...scripts$1
};

class Game{
    idList = {};
    Canvas = new Canvas();
    canvas = this.Canvas.canvas
    ctx = this.Canvas.ctx;
    time = 0;
    eventNode = eventNode;
    node = node;
    presets = presets;
    utils = utils$1;
    script = script;
    mouse = {
        x: 0
        ,y: 0
        ,filteredX: 0
        ,filteredY: 0
        ,isover: false
    }
    scenes = {};
    allElements = {};
    window = {width:window.innerWidth,height:window.innerHeight};
    constructor(){
        let game = this;
        this.element = class extends element{
            constructor(properties,renderer,hitbox,...allNodes){
                super(properties,renderer,hitbox,...allNodes);
                game.addElement(this);
            }
        };
        this.entity = class extends entity{
            constructor(properties,renderer,hitbox,...allNodes){
                super(properties,renderer,hitbox,...allNodes);
                game.addElement(this);
            }
        };
    }
    generateId = function(length = 28){
        const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=+_|!@#$%^&*()<>`;
        let result = ``;
        for (let i=0; i<length-4; i++){
            result+=chars.charAt(Math.floor(Math.random()*chars.length));
        }
        if (this.idList[result]){
            console.log(`Damn lucky day! `, result);
            result = this.generateId(length);
        }
        let gen = Math.floor(Math.random()*(result.length+1));
        result = result.slice(0, gen) + 'gen-' + result.slice(gen);
        this.idList[result] = true;
        return result;
    }
    begin(){
        this.events = new events(this);
        this.addScene(`Main`);
        frame$2();
    }
    addScene(Name){
        if (this.scenes[Name])console.warn(`STOP PUTTING SCENES WITH THE NAME ${Name}!!!`);
        this.currentscene = new scene(Name);
        this.scenes[Name] = this.currentscene;
    }
    callScene(Name){
        if (!this.scenes[Name]){
            console.warn(`NO SCENE WITH THE NAME ${Name}!!!`);
            return;
        }
        this.currentscene = this.scenes[Name];
    }
    addElement(element){
        this.allElements[element.id] =  element;
        this.currentscene.addElement(element);
    }
    removeElement(element){
        delete this.allElements[element.id];
        this.currentscene.removeElement(element);
    }
}

let game = new Game();
game.begin();

export { game };
//# sourceMappingURL=engine.js.map
