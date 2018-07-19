const { spawn } = require('child_process');

const ifcs_path = './ifcs/';
const fs = require('fs');

fs.readdir(ifcs_path, (err, files) => {
    files.forEach(file => {
        convert(file,"gltf")
    });
})

const assimp_linux = "./converters_bin/assimp-linux"

function convert(file,extension){
    // console.log(file);
    var file_name = file.split('.')[0]
    var file_path = ifcs_path + file;
    var out_path =  "./"+extension
    var out_file_path = out_path+"/"+file_name+"."+extension;

    if (!fs.existsSync(out_path)){
        fs.mkdirSync(out_path);
    }
    
    if (extension == "gltf"){
        extension = extension + "2";
    }

    var h = "-f" + extension;

    // console.log(assimp_linux,'export',file_path,out_file_path,h)
        
    var assimp = spawn(assimp_linux, ['export',file_path,out_file_path,h]);

    assimp.stdout.on('data', (data) => {
        console.log(` stdout: file\n${data}`);
    });
    
    assimp.stderr.on('data', (data) => {
        console.log(` stderr: file\n${data}`);
    });
    
    assimp.on('close', (code) => {
        console.log('closed ',file,': child process exited with code ${code}');
    });
}

