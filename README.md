# clovis-3d
visualisation of ifc files with aframe/threejs/webgl and 3d file conversion/editing.

Initial goals of the project:
 - convert an .ifc file into an .obj/.gltf2 file, ven better multiple divided by group.
    - convert to multiple .obj file divided by section
 - show these .obj into a a-frame/threejs/webgl canvas.

done:
- bash script to convert .ifc file into .obj or .gltf (can maybe be done in node):
    - uses assimp (.ifc => .obj / .gltf)
    - used ifcConvert (.ifc => .obj)
    - creates a separated folder witht the output and a log for each file
- split these obj file based on .ifc sections ( walls, roof, ...)
    - js function that take an obj and output an edited version just the necessary part for displaying the sections
    - the multiple output file summed are the same weight as the original.

todo:


