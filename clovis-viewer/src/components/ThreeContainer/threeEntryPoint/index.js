/**
 * Documentation of our Three.js architecture :
 * https://docs.google.com/presentation/d/1Nye76RTf3oc-8zQSNVjURh9bquHFQRs7dF9QJIVQU_o/edit#slide=id.p
 */

import BuildScene from './BuildScene';
import SceneManager from './SceneManager';
import MenuAndTools from './MenuAndTools';
import Listeners from './Listeners';


function createCanvas(document, container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
}


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
        // FrameRequestCallback. updates the frame when it is needed, allegedly
        requestAnimationFrame(render);
        // renders the frame and updates the controls and sceneSubjects
        sceneManager.update(
            menuAndTools.stats,
            menuAndTools.rendererStats,
            InitializedScene.getSceneCamera,
            InitializedScene.getSceneControls,
            InitializedScene.renderer,
        );
    }

    // LAUNCH MAIN FUNCTIONS

    // Resize the canvas element to fit the screen
    sceneManager.controllers.resizeCanvas(
        canvas,
        InitializedScene.getSceneCamera,
        InitializedScene.renderer,
    );

    // Display the dat.gui menu
    const menuAndTools = MenuAndTools(
        canvas,
        InitializedScene,
        sceneManager,
    );

    // Initialize the Listeners
    Listeners(
        canvas,
        InitializedScene,
        sceneManager,
    );

    // Launch render loop
    render();
};

export default ThreeEntryPoint;
