import 'three/examples/js/loaders/GLTFLoader';


const loadGltf = (scene, buildingPath, gltfLoadedCallback) => {
    const loader = new THREE.GLTFLoader();

    loader.load(
        // .gltf resource URL
        buildingPath,

        // Called when the resource is loaded
        (gltf) => {
            // Remove css class "loading to the loader"
            document.getElementById('three-progress-container').classList.remove('loading');

            scene.add(gltf.scene);
            // reaching the building from the gltf file. it is deep into the structure
            const gltfBuilding = gltf.scene.children[0].children[0].children[0].children[0];
            gltfLoadedCallback(gltfBuilding);
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


export default loadGltf;
