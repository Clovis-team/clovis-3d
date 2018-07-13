# Visualizer using three.js

to install dependencies (threejs):

    npm install

it requires budo, so if it is not isntalled run this command. i'm open to use different dev server environment, or use it not globally if you can tell me how.

    npm i budo -g

to start: 

    npm start

# What do i do?

I take a 3d .obj and its .mtl files and loads it into a threejs canvas.
the threejs canvas is setup in thee-viz.js.
Index.html  has the core functions of threejs loaded in its header and 
then threejs loads a 3d file (15.obj) and its material (15.mtl).


