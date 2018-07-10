var fs = require('fs');
let ifc_filepath = "objs/15-34-IMB_MARCHE_optimisations-assimp.obj"
let fileContents = fs.readFileSync(ifc_filepath).toString('utf8')

const OBJFile = require('obj-file-parser');
const objFile = new OBJFile(fileContents);
const original = objFile.parse();

const model = original.models[0];
const faces = model.faces;
const vertices = model.vertices;

const vertices_num = vertices.length;
const faces_num = faces.length;

console.log(vertices_num, faces_num);

function edit_get_ifc_sections(faces){
    let sections = [];

    faces.forEach((face,index,arr) => {
        let group = face.group.split(/(?=[A-Z_])/)[1]
        if (!sections.includes(group)){
            sections.push(group);
        }
    });
    return (sections);
}

const ifc_sections = edit_get_ifc_sections(faces);

console.log(ifc_sections);

faces.forEach((face,index,arr) => {
    let group = face.group.split(/(?=[A-Z_])/)[1]
    if (!sections.includes(group)){
        sections.push(group);
    }
});

// original.models[0].vertices.forEach((value,index,arr) => {
//     console.log(index)
// });
