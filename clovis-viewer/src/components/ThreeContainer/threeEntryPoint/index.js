/**
 * Documentation of our Three.js architecture :
 * https://docs.google.com/presentation/d/1Nye76RTf3oc-8zQSNVjURh9bquHFQRs7dF9QJIVQU_o/edit#slide=id.p
 */

import InitScene from './InitScene';
import SceneManager from './SceneManager';
import { createCanvas } from './utils';
import DatGui from './DatGui.js';
import Listeners from './Listeners';

const ThreeEntryPoint = (domContainer, buildingGltfPath, beautifullDatasFromReact) => {
    const canvas = createCanvas(document, domContainer);
    const InitializedScene = InitScene(canvas, buildingGltfPath);

    const sceneManager = SceneManager(
        canvas,
        // Passing initialized objects like {scene}, {camera}, {renderer}, {controls}
        InitializedScene,
        buildingGltfPath,
    );

    // its a function that loops 60 times per second
    function render() {
        // FrameRequestCallback. updates the frame when it is needed, allegedly
        requestAnimationFrame(render);
        // renders the frame and updates the controls and sceneSubjects
        sceneManager.update();
    }


    // LAUNCH MAIN FUNCTIONS
    DatGui(
        canvas,
        InitializedScene,
        sceneManager,
    );
    Listeners(
        canvas,
        InitializedScene,
        sceneManager,
    );

    render();
};

export default ThreeEntryPoint;
