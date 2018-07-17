# Visualizer using three.js

to install dependencies (threejs):

    npm install

it requires budo, so if it is not isntalled run this command. i'm open to use different dev server environment, or use it not globally if you can tell me how.

    npm i budo -g

to start: 

    npm start

# What do i do?

I visualize a gltf file and allow user to perform some basic tasks.

## Early imprementation:
-   orbit, pan and zoom
-   turn on and of layer of floors
-   explode the building's floor verticaly witha  slider

## Planned:
-   select an object in the scene and get informations (for now name, function and id)
-   walking mode
-   switch between walking and orbit

# Structure

the code is divided in 3 main parts

- the node_modules with all the dependencies.
- three-viz that is our visualizer.
- index.html that loads both in a browser.


