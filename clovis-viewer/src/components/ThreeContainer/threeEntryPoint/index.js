/**
 * Documentation of our Three.js architecture :
 * https://docs.google.com/presentation/d/1Nye76RTf3oc-8zQSNVjURh9bquHFQRs7dF9QJIVQU_o/edit#slide=id.p
 */

import dat from 'dat.gui/build/dat.gui.module';

import InitScene from './InitScene';
import SceneManager from './SceneManager';
import { createCanvas } from './utils';
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

    // TODO: @Clement put in the gui in the right dom and position
    function loadGui() {
        // TODO: the gui stays in thre entry point because it is not a THREE element
        const new_gui = new dat.GUI();
        return new_gui;
    }

    // its a function that loops 60 times per second
    function render() {
        // FrameRequestCallback. updates the frame when it is needed, allegedly
        requestAnimationFrame(render);
        // renders the frame and updates the controls and sceneSubjects
        sceneManager.update();
    }


    // const gui = loadGui();


    // LAUNCH MAIN FUNCTIONS
    // loadGui();
    Listeners(
        canvas,
        InitializedScene,
        sceneManager,
    );

    render();
};

export default ThreeEntryPoint;
