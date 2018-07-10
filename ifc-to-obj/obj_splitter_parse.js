var fs = require('fs');
let ifc_filepath = "ifc-to-obj/objs/15-34-IMB_MARCHE_optimisations-assimp.obj"
let fileContents = fs.readFileSync(ifc_filepath).toString('utf8')

const OBJFile = require('obj-file-parser');
const objFile = new OBJFile(fileContents);
const output = objFile.parse()

// outputs the first vertex
console.log(output.models[0].faces[0]);