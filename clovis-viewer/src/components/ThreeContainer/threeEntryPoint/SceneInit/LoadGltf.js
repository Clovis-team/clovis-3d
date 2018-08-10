import 'three/examples/js/loaders/GLTFLoader';


const LoadGltf = (scene, buildingPath, gltfLoadedCallback) => {
    const loader = new THREE.GLTFLoader();

    loader.load(
        // Resource URL
        buildingPath,

        // Called when the resource is loaded
        (gltf) => {
            scene.add(gltf.scene);

            // reaching the building from the gltf file. it is deep into the structure
            const gltfBuilding = gltf.scene.children[0].children[0].children[0].children[0];

            gltfLoadedCallback(gltfBuilding);
        },
        // Called while loading is progressing
        (xhr) => {
            console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
        },
        // Called when loading has errors
        (error) => {
            console.log('An error happened loading the GLTF file: ', buildingPath);
            console.error(error);
        },
    );
};


export default LoadGltf;
