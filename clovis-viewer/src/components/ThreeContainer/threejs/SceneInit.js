import Stats from 'stats.js/src/Stats';
import dat from 'dat.gui/build/dat.gui.module';
import loadGltf from './LoadGltf';

function initScene(canvas, buildingGltfPath) {
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

    /**
         * creates a perspective camera in THREE
         *
         * @param {*} { width, height } to calculate its proportions
         * @returns new camera
         */
    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 75;
        const nearPlane = 0.2;
        const farPlane = 1000;
        const new_camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane,
        );

        new_camera.position.z = 40;

        return new_camera;
    }

    /**
         * loads Orbitcontrols and configure it for our visualizer
         *
         * @param {*} controls_camera the camera tha he is going to move
         * @param {*} controls_renderer the renderer frame he has to lsiten too
         * @returns the new controls
         */
    function buildControls(controls_camera, controls_renderer) {
        const new_controls = new THREE.OrbitControls(controls_camera, controls_renderer.domElement);
        new_controls.enableDamping = true;
        new_controls.screenSpacePanning = true;
        new_controls.panSpeed = 0.3;
        new_controls.rotateSpeed = 0.2;
        new_controls.update();
        return new_controls;
    }

    // TODO: @Clement put in the stats in the right dom and position
    function loadStats() {
        const new_stats = new Stats();
        new_stats.showPanel(0);
        return new_stats;
    }
    // TODO: @Clement put in the gui in the right dom and position
    function loadGui() {
        const new_gui = new dat.GUI();
        return new_gui;
    }

    // CALCULATE STUFF

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
        console.log('building loaded', building);
    }

    // BUILD STUFF

    const scene = buildScene();
    const renderer = buildRender(canvas);
    const camera = buildCamera(canvas);
    const controls = buildControls(camera, renderer);

    loadGltf(scene, buildingGltfPath, gltfLoadedCallback);

    // const stats = loadStats();
    // const gui = loadGui();

    return {
        scene,
        camera,
        renderer,
        controls,
    };
}

export default initScene;
