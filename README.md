# clovis-3d
visualisation of ifc files with aframe/threejs/webgl and 3d file conversion/editing.

## Initial goals of the project:
 1. convert an .ifc file into an .obj/.gltf2 file, ven better multiple divided by group.
 1. show these .obj into a a-frame/threejs/webgl canvas.

# Working:
## - bash script to convert .ifc file into .obj or .gltf:
    sh convert.sh file_to_convert [output_format] [-converter]

    sh convertfolder.sh folder_to_convert [output_format] [-converter]
- can use -assimp (.ifc => .obj/.gltf) or -ifcConvert (.ifc => .obj)
- creates a separated folder witht the output files and a log for each file
## - split .obj file based on .ifc sections (walls, roof, ...)
- obj_splitter_parse.js takes an obj and output an edited version with just the necessary part for displaying the .ifc sections
- the multiple output file summed are the same weight as the original.

# ToDo:
- add materials and groups to obj_splitter_parse.js's output
- turn the converter bash script into node?

## ideas:
- bake ambient occlusion in obj files, seen in the autodesk visualizer. (python + blender)


