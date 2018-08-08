import 'three/examples/js/loaders/GLTFLoader';


export default (scene, buildingPath) => {
    const loader = new THREE.GLTFLoader();
    let building;
    let floors;

    loader.load(
        // resource URL
        buildingPath,

        // called when the resource is loaded
        (gltf) => {
            scene.add(gltf.scene);
            console.log('building loaded');
            // sorry for this bad code!
            building = gltf.scene.children[0].children[0].children[0].children[0];
            floors = building.children;
        },
        // called while loading is progressing
        (xhr) => {
            console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
        },
        // called when loading has errors
        (error) => {
            console.log('An error happened loading the GLTF file: ', buildingPath);
            console.error(error);
        },
    );


    function update() {
    }

    return {
        update,
        building,
        floors,
    };
};
