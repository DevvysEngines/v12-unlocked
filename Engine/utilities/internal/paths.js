export function normalizePath(path){
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
    })
    //console.log(newpath, jPath, path)
    //cachedPaths[jPath] = newpath;
    return [...newpath];
}