var fs = require('fs');
let ifc_filepath = "objs/15-34-IMB_MARCHE_optimisations-assimp.obj"
let fileContents = fs.readFileSync(ifc_filepath).toString('utf8')
let local_dir = "objs-split/"

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
        let group = face.group.split(/(?=[A-Z_])/)[1];
        face.group = group;
        if (!sections.includes(group)){
            sections.push(group);
        }
    });
    return (sections);
}

const ifc_sections = edit_get_ifc_sections(faces);

function stringifyVertex(vertex){
    return "v " + String(vertex.x) + " " + vertex.y + " " + vertex.z
};

if (!fs.existsSync(local_dir)){
    fs.mkdirSync(local_dir);
}

ifc_sections.forEach((section) =>{
    console.log("editing " + section)
    let output_file_name = local_dir + String(section) + ".obj";
    let vertices_new = [];
    let faces_new = []
    let vertices_map = [];
    let vertices_assigned = 1;
    faces.forEach((face,f_i) => {
        if (face.group == section){
            let face_str = "f"
            face.vertices.forEach((vertex) => {
                v_i = vertex.vertexIndex;
                if (!vertices_map[v_i]){
                    // vertices_map(v_i) = vertices_assigned++;
                    let vertex_str = stringifyVertex(vertices[v_i - 1]);
                    vertices_new.push(vertex_str);
                    vertices_map[v_i] = vertices_new.length;
                }
                face_str += " " + String(vertices_map[v_i]);
            })
            faces_new.push(face_str);
        }
    });
    let section_array = vertices_new.concat(faces_new);
    console.log("saving " + section)
    fs.writeFile(
        output_file_name,
        section_array.join("\n"),
        () => console.log("done " + String(section))
    )
});

// original.models[0].vertices.forEach((value,index,arr) => {
//     console.log(index)
// });
