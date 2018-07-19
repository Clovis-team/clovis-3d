const { spawn } = require('child_process');

const ifcs = './ifcs/';
const fs = require('fs');

// fs.readdir(ifcs, (err, files) => {
//   files.forEach(file => {
//     console.log(file);
//   });
// })

const model = "/Users/nicola/code/clovis-3d/ifc-to-obj/ifcs/15"
const out = "/Users/nicola/code/clovis-3d/ifc-to-obj/objs/15.obj"
const h = "obj"

const assimp = spawn('assimp', ['export',model,out,h]);

assimp.stdout.on('data', (data) => {
	console.log(` stdout:\n${data}`);
});

assimp.stderr.on('data', (data) => {
	console.log(` stderr:\n${data}`);
});

assimp.on('close', (code) => {
	console.log(` close: child process exited with code ${code}`);
});