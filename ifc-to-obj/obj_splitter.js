let ifc_filepath = "ifc-to-obj/objs/15-34-IMB_MARCHE_optimisations-assimp.obj"
let fs = require('fs');
let file_array = fs.readFileSync(ifc_filepath).toString('utf8').split('\n').filter(Boolean);

// list of ifc_sections
let ifc_sections = [];

for (line of file_array){
    if (line.charAt(0) == 'g'){
        let name = line.split(/(?=[A-Z_])/)[2];;
        if (!ifc_sections.includes(name)){
            ifc_sections.push(name);
        }
    }
}

for (let section of ifc_sections){
    let aframe_path = "aframe-boilerplate-master/objs/";
    let local_path = "ifc-to-obj/objs-split/"
    let file_name = local_path + String(section) + ".obj";
    let flag = false;
    let section_array = []

    for (line of file_array){
        if (line.charAt(0) == 'v'){
            section_array.push(line)
        }
        else if (line.charAt(0) == 'g'){
            let name = line.split(/(?=[A-Z_])/)[2];
            if (name == section){
                flag = true;
                section_array.push(line)
            }
            else{
                flag = false;
            }
        }
        else if (line.charAt(0) == 'f' || line.substr(0,6) == "usemtl"){
            if (flag){
                section_array.push(line)
            }
        }
        else if (line.substr(0,6) == "mtllib"){
            section_array.push(line)
        }
    }
    fs.writeFile(
        file_name,
        section_array.join("\n"),
        () => console.log("done " + String(section))
    )
}