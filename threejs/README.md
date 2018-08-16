# Visualizer using three.js

to install dependencies (threejs):

    npm install

it requires budo, so if it is not isntalled run this command. i'm open to use different dev server environment, or use it not globally if you can tell me how.

    npm i budo -g

to start: 

    npm start

# What does it do?

It visualize a gltf file and allow user to perform some basic tasks.

## Early imprementation:
-   orbit, pan and zoom
-   switch visibility of floors
-   switch visibility of object based on their ifc_tag
-   explode the building's floor verticaly with a slider
-   click on an object an get information in the UI (ifc_tag and ifc_name)
-   select between perspective and ortographic camera (keeping position, rotation and orbit target) 

## Planned:
-   think about touch events for mobile phone.
-   add viusalization styles, transparency, wireframe, etc
-   better selecting management, object get colored on overlay
-   walking mode
-   switch between walking and orbit
-   add sky sphere

## Future ideas
-   bake shadows on textures (backend processing of gltf files), maybe using blender?

# Structure

the code is divided in 3 main parts

- the node_modules with all the dependencies.
- three-viz that is our visualizer.
- index.html that loads both in a browser.


