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

const ThreeEntryPoint = (domContainer, buildingGltfPath, DatasFromReact) => {
    const canvas = createCanvas(document, domContainer);
    // TODO: use it to display tasks
    const { selectedTask, allTasks } = DatasFromReact;
    console.log('selectedTask :', selectedTask);
    console.log('allTasks :', allTasks);

    const InitializedScene = BuildScene(canvas, buildingGltfPath);

    // Display the stats and renderer stats Dev Tools
    // TODO: put condition with NODE_ENV
    const devTools = DevTools(InitializedScene);

    const sceneManager = SceneManager(canvas, InitializedScene);


    // its a function that loops 60 times per second ideally
    function render() {
        // TODO: look into stop running when tab on foreground but browser is not https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
        // FrameRequestCallback. calls the render when window is active
        requestAnimationFrame(render);
        devTools.stats.begin();
        // renders the frame and updates the controls and sceneSubjects
        sceneManager.update(
            devTools.rendererStats,
        );
        devTools.stats.end();
    }

    // setup listener outside of THREEJS, for GUI and external controls
    Listeners(canvas, sceneManager, Controllers);
    // resize the canvas to new size and in the scenemanager
    Controllers.onResize(canvas, sceneManager);
    // Show the menu and buttons
    MenuAndButtons(InitializedScene.getBuildingDatas, sceneManager);

    // starts the rendering loop
    render();
};

function createCanvas(document, container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
}


export default ThreeEntryPoint;
