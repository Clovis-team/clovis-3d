import loadGltf from './loadGltf';
// TODO: split init anylisis here
import analyseInit from './analyseInit';
import cameras from '../SceneManager/cameras';

function BuildScene(canvas, buildingGltfPath) {
    // BUILD STUFF FUNCTIONS

    /**
     * create a THREE scene, the database of all 3d objects and lights
     *
     * @returns new scene
     */
    function buildScene() {
        const new_scene = new THREE.Scene();
        new_scene.background = new THREE.Color('#FFF');

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x777788, 1);
        new_scene.add(hemisphereLight);

        return new_scene;
    }

    /**
         * create the frame where THREE will render into
         * set sizes and ratio of pixels
         * gamma setting for balancing the birghtness
         * @param {*} { width, height } of the canvas that we render into
         * @returns new renderer
         */
    function buildRender({ width, height }) {
        const new_renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;

        new_renderer.setPixelRatio(DPR);
        new_renderer.setSize(width, height);

        new_renderer.gammaInput = true;
        new_renderer.gammaOutput = true;

        return new_renderer;
    }

    // EXTERNALY USED FUNCTIONS

    /**
     * Return updated objects of camera and controls
     */
    function getSceneCamera() {
        return camera;
    }
    function getSceneControls() {
        return controls;
    }

    /**
     * Functions to change camera, controls and renderer from other files
     */
    function modifySceneCamera(new_camera) {
        camera = new_camera;
    }
    function modifySceneControls(new_controls) {
        controls = new_controls;
    }

    // CAMERA AND CONTROLS

    const cameraTypes = [
        'Perspective',
        'Ortographic',
        'Flying drag Fps',
        'Flying drag',
        'walking drag fps',
        'walking drag',
    ];
    const starting_camera_type = 'Perspective';

    function buildCameraAndControls() {
        cameras.change_camera_and_controls(
            cameraTypes,
            starting_camera_type,
            getSceneCamera,
            getSceneControls,
            renderer,
            modifySceneCamera,
            modifySceneControls,
        );
    }

    // CALCULATE STUFF
    // TODO: put this part inside './analyseInit.js'

    /**
     * given a object3d returns a vector from origin to the object's BOX center
     *
     * @param {*} object THREEJS object3d
     * @returns THREE.Vector3
     */
    function getObjectCenter(object) {
        const box = new THREE.Box3().setFromObject(object);
        const centerVector = new THREE.Vector3();
        box.getCenter(centerVector);
        return centerVector;
    }

    /**
     * given a object3d returns a vector of the object's BOX size
     *
     * @param {*} object THREEJS object3d
     * @returns THREE.Vector3
     */
    function getgetObjectSize(object) {
        const box = new THREE.Box3().setFromObject(object);
        const sizeVector = new THREE.Vector3();
        box.getSize(sizeVector);
        return sizeVector;
    }
    /**
     * it centers the camera in the right position based on the center and size of the building
    */
    function positionCameraToBuilding() {
        console.log('here we fix the camera');
        const cameraPosition = getObjectCenter(scene).add(getgetObjectSize(scene).divideScalar(2));
        camera.position.copy(cameraPosition);
        controls.target.copy(getObjectCenter(scene));
        // controls.update() must be called after any manual changes to the camera's transform
        controls.update();
    }

    /**
     * callback from when the gltf file is loaded
     */
    function gltfLoadedCallback(building) {
        positionCameraToBuilding();
    }

    // BUILD STUFF
    const scene = buildScene();
    const renderer = buildRender(canvas);
    let camera;
    let controls;

    buildCameraAndControls();

    loadGltf(scene, buildingGltfPath, gltfLoadedCallback);

    return {
        scene,
        renderer,
        getSceneCamera,
        getSceneControls,
        modifySceneCamera,
        modifySceneControls,
        cameraTypes,
        starting_camera_type,
    };
}

export default BuildScene;
