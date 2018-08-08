import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/loaders/GLTFLoader';

import Stats from 'stats.js/src/Stats';
import dat from 'dat.gui/build/dat.gui.module';
import loadGltf from './LoadGltf';

export default (canvas) => {
    const clock = new THREE.Clock();
    const origin = new THREE.Vector3(0, 0, 0);
    // const buildingGltfPath = '/gltfs/Project1-assimp.gltf';
    const buildingGltfPath = '/gltfs/15-assimp.gltf';

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height,
    };

    const mousePosition = {
        x: 0,
        y: 0,
    };

    // here all the bloacks that have to be loaded at the beginning
    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const controls = buildControls(camera, renderer);
    const gltf = loadGltf(scene, buildingGltfPath);
    // const stats = loadStats();
    // const gui = loadGui();

    const sceneSubjects = createSceneSubjects(scene);

    function buildScene() {
        const new_scene = new THREE.Scene();
        new_scene.background = new THREE.Color('#FFF');

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x777788, 1);
        new_scene.add(hemisphereLight);

        return new_scene;
    }

    function buildRender({ width, height }) {
        const new_renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;

        new_renderer.setPixelRatio(DPR);
        new_renderer.setSize(window.innerWidth, window.innerHeight);

        new_renderer.gammaInput = true;
        new_renderer.gammaOutput = true;

        return new_renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 75;
        const nearPlane = 0.2;
        const farPlane = 1000;
        const new_camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        new_camera.position.z = 40;

        return new_camera;
    }
    function buildControls(controls_camera, controls_renderer) {
        const new_controls = new THREE.OrbitControls(controls_camera, controls_renderer.domElement);
        new_controls.enableDamping = true;
        new_controls.screenSpacePanning = true;
        new_controls.panSpeed = 0.3;
        new_controls.rotateSpeed = 0.2;
        return new_controls;
    }

    function loadStats() {
        const new_stats = new Stats();
        // TODO: find the best place to dom the stats (this is only developer stuff)
        canvas.appendChild(new_stats.dom);
        new_stats.showPanel(0);
        return new_stats;
    }

    function loadGui() {
        const new_gui = new dat.GUI();
        new_gui.domElement = canvas.parentNode;
        // canvas.parentNode
        // TODO: append gui to the right different dom from canvas
        return new_gui;
    }

    function createSceneSubjects(scene) {
        const sceneSubjects = [
            // new GeneralLights(scene),
        ];

        return sceneSubjects;
    }

    function update() {
        const elapsedTime = clock.getElapsedTime();

        for (let i = 0; i < sceneSubjects.length; i++) { sceneSubjects[i].update(elapsedTime); }

        // updateCameraPositionRelativeToMouse();
        // stats.update();
        controls.update();
        renderer.render(scene, camera);
    }

    function updateCameraPositionRelativeToMouse() {
        camera.position.x += ((mousePosition.x * 0.01) - camera.position.x) * 0.01;
        camera.position.y += (-(mousePosition.y * 0.01) - camera.position.y) * 0.01;
        camera.lookAt(origin);
    }

    function onWindowResize() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    function onMouseMove(x, y) {
        mousePosition.x = x;
        mousePosition.y = y;
    }

    function onLoadedGltf(event) {
        console.log(event);
        camera.position.copy(event.cameraPosition);
        controls.target.copy(event.center);
        // controls.target.copy(event.center);
        console.log(controls);
    }

    function onKeyPressed(event) {
        // TODO: implement a submodule of walking around;
        const walking_keys = ['w', 'a', 's', 'd'];
        if (walking_keys.indexOf(event.key) > -1) {
            console.log(event);
        }
    }

    function onClose() {
        // gui.destroy();
        // remove stats
        // remove eventual listeners;
    }

    return {
        update,
        onWindowResize,
        onMouseMove,
        onKeyPressed,
        onLoadedGltf,
        onClose,
    };
};
