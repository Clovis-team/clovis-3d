import 'three/examples/js/loaders/GLTFLoader';


export default (scene, buildingPath) => {
    const loader = new THREE.GLTFLoader();
    let gltfBuilding;
    let gltfFloors;

    loader.load(
        // resource URL
        buildingPath,

        // called when the resource is loaded
        (gltf) => {
            scene.add(gltf.scene);
            console.log('building loaded, event "loadedGltf" emitted');

            dispatchLoadedEvent();

            gltfBuilding = gltf.scene.children[0].children[0].children[0].children[0];
            gltfFloors = building.children;
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

    function getObjectCenter(object) {
        const box = new THREE.Box3().setFromObject(object);
        const centerVector = new THREE.Vector3();
        box.getCenter(centerVector);
        return centerVector;
    }

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
        event.center = (center);
        event.size = (size);
        event.cameraPosition = (cameraPosition);
        window.dispatchEvent(event);
    }

    // TODO: ask mathias if there is a better way to export values
    function building() {
        return gltfBuilding;
    }

    function floors() {
        return gltfFloors;
    }


    return {
    };
};
