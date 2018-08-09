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


    // LAUNCH MAIN FUNCTIONS
    bindEventListeners();
    resizeCanvas();
    render();
};

export default ThreeEntryPoint;
