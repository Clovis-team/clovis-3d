import 'three/examples/js/loaders/GLTFLoader';
import { get_building } from './utils';

/**
 * adds a gltf from buildingPath and add it to the scene
 * after calls the callback and emit an unecessary event
 *
 * @param {*} scene THREE.Scene
 * @param {*} buildingPath string
 * @param {*} gltfLoadedCallback function that takes the building object3D
 */
const loadBuilding = (scene, buildingPath, gltfLoadedCallback) => {
    const loader = new THREE.GLTFLoader();
    const t0 = performance.now();

    loader.load(
        // .gltf resource URL
        buildingPath,

        // Called when the resource is loaded
        (gltf) => {
            const t1 = performance.now();

            // remove loader
            document.getElementById('three-progress-container').classList.remove('loading');

            // adding scene
            scene.add(gltf.scene);
            const gltfBuilding = get_building(gltf.scene);
            gltfLoadedCallback(gltfBuilding);

            // event call
            const endOfLoaderCallback = new Event('endOfLoaderCallback');
            window.dispatchEvent(endOfLoaderCallback);

            const t2 = performance.now();
            console.log(`gtlf loading: ${Math.round(t1 - t0)} ms`);
            console.log(`post processing gtlf: ${Math.round(t2 - t1)} ms`);
            // Dispatch a window event to build the Menu and Tools, cf "Listeners"
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
