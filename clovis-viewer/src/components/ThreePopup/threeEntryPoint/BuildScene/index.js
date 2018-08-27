import 'three/examples/js/controls/OrbitControls';
import loadBuilding from './loadBuilding';
import { initSky } from './backgrounds';
import { initializeViewerHtmlContainers } from './utils';

import { fillBuildingDatas, positionCameraToBuilding } from './analyseBuilding';
import { asynchronous_gltf_loader_gui_populate } from '../DevTools/utils';

function BuildScene(canvas, buildingGltfPath, ViewerOptions) {
    initializeViewerHtmlContainers();


    let buildingDatas = {};

    const getBuildingDatas = () => buildingDatas;
    /**
     * create a THREE scene, the database of all 3d objects and lights
     *
     * @returns new scene
     */
    function buildScene(renderer) {
        const new_scene = new THREE.Scene();
        // flamingo(new_scene);
        initSky(new_scene, true);

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
        const new_renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true, // Usefull for canvas capture
        });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;

        new_renderer.setPixelRatio(DPR);
        new_renderer.setSize(width, height);

        new_renderer.gammaInput = true;
        new_renderer.gammaOutput = true;

        new_renderer.shadowMap.enabled = true;

        return new_renderer;
    }

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
     * callback from when the gltf file is loaded
     */
    function gltfLoadedCallback(building, gltf) {
        positionCameraToBuilding(gltf, controls, camera);
        // buildingDatas = fillBuildingDatas(building, buildingDatas);
        buildingDatas = fillBuildingDatas(building, gltf, buildingDatas);
        asynchronous_gltf_loader_gui_populate(buildingDatas);
    }

    // BUILD STUFF

    const renderer = buildRenderer(canvas);
    const camera = buildCamera(canvas);
    const scene = buildScene(renderer);
    const controls = buildControls(camera, renderer);

    // buildCameraAndControls();

    loadBuilding(
        scene,
        buildingGltfPath,
        gltfLoadedCallback,
    );

    return {
        scene,
        renderer,
        getBuildingDatas,
        camera,
        controls,
        buildingDatas,
        ViewerOptions,
    };
}

function shadow(object) {
    if (object.type === 'Mesh') {
        console.log(object);
        object.castShadow = true;
        object.receiveShadow = true;
    }
}


export default BuildScene;
