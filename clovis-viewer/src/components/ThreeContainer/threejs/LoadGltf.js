import 'three/examples/js/loaders/GLTFLoader';


const LoadGltf = (scene, buildingPath) => {
    const loader = new THREE.GLTFLoader();

    // // // // // // // // // //
    // UTILITARY FUNCTIONS
    // // // // // // // // // //

    // Object center coordinates helps to set the position of initial camera
    function getObjectCenter(object) {
        const box = new THREE.Box3().setFromObject(object);
        const centerVector = new THREE.Vector3();
        box.getCenter(centerVector);
        return centerVector;
    }

    // Object size helps to set the distance between the camera and the center of object
    function getgetObjectSize(object) {
        const box = new THREE.Box3().setFromObject(object);
        const sizeVector = new THREE.Vector3();
        box.getSize(sizeVector);
        return sizeVector;
    }

    function dispatchLoadedEvent() {
        const event = new Event('loadedGltf');
        const center = getObjectCenter(scene);
        const size = getgetObjectSize(scene);
        const cameraPosition = getObjectCenter(scene).add(getgetObjectSize(scene).divideScalar(2));
        // TODO: ^Clement @Nicola : explain why we have to set these subkeys for 'event'
        event.center = (center);
        event.size = (size);
        event.cameraPosition = (cameraPosition);

        // TODO: ^Clement @Nicola : could you explain what exactly this function does ?
        // What does "dispatch" means, and why we put some 'size' and 'center '
        // informations inside it.
        window.dispatchEvent(event);
    }


    // // // // // // // // // //
    // LOAD GLTF
    // // // // // // // // // //

    let gltfBuilding;
    let gltfFloors;

    loader.load(
        // Resource URL
        buildingPath,

        // Called when the resource is loaded
        (gltf) => {
            scene.add(gltf.scene);
            console.log('building loaded, event "loadedGltf" emitted');

            dispatchLoadedEvent();

            // TODO: ^Clement @Nicola: explain also quickly why the Building Object
            // is so deep inside the 'gltf.scene' object
            gltfBuilding = gltf.scene.children[0].children[0].children[0].children[0];
            gltfFloors = building.children;
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


    // // // // // // // // // //
    // 'EXPORTED' FUNCTIONS
    // // // // // // // // // //

    // TODO: ask mathias if there is a better way to export values
    // ^Clement@Mathias : maybe like this : instead of void object return the functions
    // (see the exports inside Scene Manager file)
    // Ex:
    //  return {
    //      building,
    //      floors,
    //  };
    // Moreover why do you use functions to just return object ?
    function building() {
        return gltfBuilding;
    }
    function floors() {
        return gltfFloors;
    }

    return {
    };
};


export default LoadGltf;
