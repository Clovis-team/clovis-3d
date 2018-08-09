import dat from 'dat.gui/build/dat.gui.module';
import SceneManager from './SceneManager';
import { createCanvas } from './utils';

const ThreeEntryPoint = (domContainer, buildingGltfPath, beautifullDatasFromReact) => {
    const canvas = createCanvas(document, domContainer);

    const sceneManager = SceneManager(canvas, buildingGltfPath);

    // this might go away soon
    let canvasHalfWidth;
    let canvasHalfHeight;

    function resizeCanvas() {
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        canvasHalfWidth = Math.round(canvas.offsetWidth / 2);
        canvasHalfHeight = Math.round(canvas.offsetHeight / 2);

        sceneManager.onWindowResize();
    }

    // TODO: @Clement put in the gui in the right dom and position
    function loadGui() {
        // TODO: the gui stays in thre entry point because it is not a THREE element
        const new_gui = new dat.GUI();
        return new_gui;
    }

    function bindEventListeners() {
        // window.onkeypress = keyPressed;
        window.addEventListener(
            'resize',
            resizeCanvas,
            false,
        );

        window.addEventListener(
            'mousemove',
            ({ screenX, screenY }) => {
                sceneManager.onMouseMove(screenX - canvasHalfWidth, screenY - canvasHalfHeight);
            },
            false,
        );

        window.addEventListener(
            'keypress',
            (e) => {
                sceneManager.onKeyPressed(e);
            },
            false,
        );
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
    bindEventListeners();
    resizeCanvas();
    render();
};

export default ThreeEntryPoint;
