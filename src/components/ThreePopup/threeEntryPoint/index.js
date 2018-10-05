/**
 * Documentation of our Three.js architecture :
 * https://docs.google.com/presentation/d/1Nye76RTf3oc-8zQSNVjURh9bquHFQRs7dF9QJIVQU_o/edit#slide=id.p
 */

import BuildScene from './BuildScene';
import SceneManager from './SceneManager';
import DevTools from './DevTools';
import Controllers from './Controllers';
import Listeners from './Listeners';
import MenuAndButtons from './MenuAndButtons';

const ThreeEntryPoint = (ThreeDomContainer, buildingGltfPath, ViewerOptions) => {
    const canvas = createCanvas(document, ThreeDomContainer);

    // Display the stats and renderer stats Dev Tools
    const devTools = DevTools();

    const InitializedScene = BuildScene(canvas, buildingGltfPath, ViewerOptions);

    // TODO: put condition with NODE_ENV

    const sceneManager = SceneManager(canvas, InitializedScene, ViewerOptions);


    // its a function that loops 60 times per second ideally
    function render() {
        // TODO: look into stop running when browser on blur https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
        // FrameRequestCallback. calls the render when the tab is active ( even if browser on background)
        requestAnimationFrame(render);
        devTools.stats.update();
        // renders the frame and updates the controls and sceneSubjects
        sceneManager.update();
    }

    // setup listener outside of THREEJS, for GUI and external controls
    Listeners(canvas, sceneManager, Controllers);
    // resize the canvas to new size and in the scenemanager
    Controllers.onResize(canvas, sceneManager);
    // Show the menu and buttons
    MenuAndButtons(InitializedScene.getBuildingDatas, sceneManager);

    function destroy() {
        devTools.stats.destroy();
    }

    // starts the rendering loop
    render();
    return { destroy };
};

function createCanvas(document, container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
}


export default ThreeEntryPoint;
