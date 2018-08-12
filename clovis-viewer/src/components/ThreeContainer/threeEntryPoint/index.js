/**
 * Documentation of our Three.js architecture :
 * https://docs.google.com/presentation/d/1Nye76RTf3oc-8zQSNVjURh9bquHFQRs7dF9QJIVQU_o/edit#slide=id.p
 */

import BuildScene from './BuildScene';
import SceneManager from './SceneManager';
import DevTools from './DevTools';

const ThreeEntryPoint = (domContainer, buildingGltfPath, beautifullDatasFromReact) => {
    const canvas = createCanvas(document, domContainer);
    const InitializedScene = BuildScene(canvas, buildingGltfPath);

    const sceneManager = SceneManager(
        canvas,
        // Passing initialized objects like {scene}, {camera}, {renderer}, {controls}
        InitializedScene,
        buildingGltfPath,
    );

    // MAIN UTILS

    // its a function that loops 60 times per second
    function render() {
        // update_height_of_camera(
        //     InitializedScene.getSceneCamera,
        //     InitializedScene.getBuildingDatas,
        //     sceneManager.raycaster_cam,
        // );
        // FrameRequestCallback. updates the frame when it is needed, allegedly
        requestAnimationFrame(render);
        // renders the frame and updates the controls and sceneSubjects
        sceneManager.update(
            devTools.stats,
            devTools.rendererStats,
            InitializedScene.getSceneCamera,
            InitializedScene.getSceneControls,
            InitializedScene.renderer,
        );
    }

    // LAUNCH MAIN FUNCTIONS

    // Resize the canvas element to fit the screen
    sceneManager.Controllers.resizeCanvas(
        canvas,
        InitializedScene.getSceneCamera,
        InitializedScene.renderer,
    );

    // Display the stats and renderer stats Dev Tools
    // TODO: put condition with NODE_ENV
    const devTools = DevTools(InitializedScene);

    // Launch render loop
    render();
};

// UTILITARY FUNCTIONS
function createCanvas(document, container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
}
// TODO: is this function really working ?
function update_height_of_camera(getSceneCamera, getBuildingDatas, raycaster_cam) {
    const direction = new THREE.Vector3(0, -1, 0);
    const camera = getSceneCamera();
    const { mesh_all } = getBuildingDatas;

    raycaster_cam.set(camera.position, direction);

    const objects_below = raycaster_cam.intersectObjects(mesh_all);
    // console.log(camera.position);

    if (objects_below.length > 0) {
        camera.height = objects_below[0].distance;
    } else {
        camera.height = 'No height';
    }
}


export default ThreeEntryPoint;
