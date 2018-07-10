let ifc_filepath = "ifc-to-obj/objs/15-34-IMB_MARCHE_optimisations-assimp.obj"

var readline = require('readline');
var fs = require('fs');

function readlineInit(path){
    // init the readline element and its stream
    var rl = readline.createInterface({
    input: fs.createReadStream(path)
    });
    return (rl);
};

function handler (line) {
    // checks if a name is aready in the list or it adds it
    if (line.charAt(0) == 'g'){
        let name = line.split(/(?=[A-Z_])/,3)[2];
        if (!ifc_sections.includes(name)){
            ifc_sections.push(name);
        }
    }
};

let rl = readlineInit(ifc_filepath);
let ifc_sections = [];
// do on each line
rl.on('line', handler);
// do on file closure
rl.on('close', function(){
            console.log(ifc_sections);
        })