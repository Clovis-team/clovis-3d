import 'three/examples/js/controls/OrbitControls';
import loadBuilding from './loadBuilding';
// TODO: split init anylisis here
// import Cameras from '../SceneManager/Cameras';

import { analyseBuilding, positionCameraToBuilding } from './analyseBuilding';


function BuildScene(canvas, buildingGltfPath) {
    const cameraTypes = [
        'Perspective',
        'Ortographic',
        'Flying drag Fps',
        'Flying drag',
        'walking drag fps',
        'walking drag',
    ];
    const starting_camera_type = 'Perspective';
    let buildingDatas = {};

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
    function buildRenderer({ width, height }) {
        const new_renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;

        new_renderer.setPixelRatio(DPR);
        new_renderer.setSize(width, height);

        new_renderer.gammaInput = true;
        new_renderer.gammaOutput = true;

        return new_renderer;
    }

    // EXTERNALY USED FUNCTIONS
    /*
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

    /*
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

    /**
     * Return updated objects of camera and controls
     */
    function getSceneCamera() {
        return camera;
    }
    function getSceneControls() {
        return controls;
    }
    function getBuildingDatas() {
        return buildingDatas;
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

    // function buildCameraAndControls() {
    //     Cameras.change_camera_and_controls(
    //         cameraTypes,
    //         starting_camera_type,
    //         getSceneCamera,
    //         getSceneControls,
    //         renderer,
    //         modifySceneCamera,
    //         modifySceneControls,
    //     );
    // }

    // CALCULATE STUFF

    /**
     * callback from when the gltf file is loaded
     */
    function gltfLoadedCallback(building, controls) {
        positionCameraToBuilding(scene, controls, camera);
        buildingDatas = analyseBuilding(building);

        // TODO: describe why we do this
        const new_controls = controls;
        new_controls.collision_objects = buildingDatas.mesh_all;
        new_controls.collision_floor = true;
        modifySceneControls(new_controls);
    }

    // BUILD STUFF
    const scene = buildScene();
    const renderer = buildRenderer(canvas);
    let camera = buildCamera(canvas);
    let controls = buildControls(camera, renderer);

    // buildCameraAndControls();

    loadBuilding(
        scene,
        buildingGltfPath,
        gltfLoadedCallback,
        controls,
    );

    return {
        scene,
        renderer,
        getSceneCamera,
        getSceneControls,
        modifySceneCamera,
        modifySceneControls,
        cameraTypes,
        starting_camera_type,
        getBuildingDatas,
    };
}

export default BuildScene;
