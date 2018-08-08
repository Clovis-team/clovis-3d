import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/loaders/GLTFLoader';

import GeneralLights from './GeneralLights';
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

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const controls = buildControls(camera, renderer);
    const gltf = loadGltf(scene, buildingGltfPath);
    const sceneSubjects = createSceneSubjects(scene);


    function buildScene() {
        // builds a basic scene (the entire 3d world in threejs)
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#FFF');
        const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 1);
        scene.add(hemisphereLight);

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;

        renderer.setPixelRatio(DPR);
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 4;
        const farPlane = 1000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.z = 40;

        return camera;
    }
    function buildControls(camera, renderer) {
        const new_controls = new THREE.OrbitControls(camera, renderer.domElement);
        new_controls.enableDamping = true;
        new_controls.screenSpacePanning = true;
        new_controls.panSpeed = 0.3;
        new_controls.rotateSpeed = 0.2;
        return new_controls;
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

    return {
        update,
        onWindowResize,
        onMouseMove,
    };
};
