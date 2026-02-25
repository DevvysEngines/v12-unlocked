export class script {
    #defaults = {
        fired:function(){}
        ,signal: `script`
    }
    constructor(configuration){
        Object.assign(this,this.#defaults,configuration,{type:`script`});
    }
}