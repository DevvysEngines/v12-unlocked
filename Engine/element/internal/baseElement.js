import { game } from "../../engine.js";
import { types } from "../../internal/types.js"
import { utils } from "../../utilities/utils.js";
import { module } from "../../systems/v9/module/module.js";

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
}

export class baseElement extends module {

    // FUNCTIONS

    update // Sends out an emit for frame updates, used by nodes, or scripts with the signal.
    (...args)
    {
        this.emit("-u$u",...args)
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
        return this.system_has(utils.normalizePath(path));
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
        }
        deep_cloned_defaults.renderer = 
        {
            ...deep_cloned_defaults.renderer
            ,...renderer
        }
        deep_cloned_defaults.hitbox = 
        {
            ...deep_cloned_defaults.hitbox
            ,...hitbox
        }
        
        // Calling for module to assign the new main files to the current module/element.
        super
        (
            deep_cloned_defaults
        );

        if 
        (scripts.length<1)
        return;

        let possible_initilization = scripts.pop()

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