import 'three/examples/js/loaders/GLTFLoader';
import { get_building } from './utils';


const loadBuilding = (scene, buildingPath, gltfLoadedCallback, controls) => {
    // Building is in Gltf format, so we use Three.js Gltf loader
    const loader = new THREE.GLTFLoader();
    const t0 = performance.now();

    loader.load(
        // .gltf resource URL
        buildingPath,

        // Called when the resource is loaded
        (gltf) => {
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Scene
            // gltf.scenes; // Array<THREE.Scene>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object

            // Remove css class "loading to the loader"
            document.getElementById('three-progress-container').classList.remove('loading');
            const t1 = performance.now();

            scene.add(gltf.scene);

            // reaching the building from the gltf file. it is deep into the structure
            const gltfBuilding = get_building(gltf.scene);

            gltfLoadedCallback(gltfBuilding, controls);


            const t2 = performance.now();
            console.log(`Load and name all building groups took ${Math.round(t2 - t1)} milliseconds.`);
            // Dispatch a window event to build the Menu and Tools, cf "Listeners"
            const endOfLoaderCallback = new Event('endOfLoaderCallback');
            window.dispatchEvent(endOfLoaderCallback);
        },
        // Called while loading is progressing
        (xhr) => {
            // TODO: xhr.total doesn't work for gzip or on chrome.
            // We can use this to fetch the file size : https://stackoverflow.com/questions/17416274/ajax-get-size-of-file-before-downloading
            document
                .getElementById('three-progress-text')
                .innerHTML = `${(xhr.loaded / 1000000).toFixed(2)} Mo`;
        },
        // Called when loading has errors
        (error) => {
            console.log('An error happened loading the GLTF file: ', buildingPath);
            console.error(error);
        },
    );
};


export default loadBuilding;
