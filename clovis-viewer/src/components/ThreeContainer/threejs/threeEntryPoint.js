import SceneManager from './SceneManager';
import { createCanvas } from './utils';

const ThreeEntryPoint = (domContainer, buildingGltfPath, beautifullDatasFromReact) => {
    // // // // // // // // // //
    // CREATE THE THREE.JS CANVAS
    // // // // // // // // // //

    const canvas = createCanvas(document, domContainer);


    // // // // // // // // // //
    // INITIALIZE THE SCENE MANAGER
    // // // // // // // // // //

    // ^Clement @Mathias : why do we use fucking `new` here instead of simply Scenemanager(canvas)
    // . there's absolutely no constructor inside
    const sceneManager = new SceneManager(canvas, buildingGltfPath);


    // // // // // // // // // //
    // KIND OF CONTROLLERS ?
    // // // // // // // // // //
    // TOFIX : this block looks like a huge duplicate of sceneManager functions
    // which are suppose to be the controllers, why ?

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

    function mouseMove({ screenX, screenY }) {
        sceneManager.onMouseMove(screenX - canvasHalfWidth, screenY - canvasHalfHeight);
    }

    function keyPressed(e) {
        sceneManager.onKeyPressed(e);
    }

    function loadedGltf(e) {
        sceneManager.onLoadedGltf(e);
    }


    // // // // // // // // // //
    // LISTENERS
    // // // // // // // // // //

    function bindEventListeners() {
        window.onresize = resizeCanvas;
        window.onmousemove = mouseMove;
        window.onkeypress = keyPressed;
        window.addEventListener('loadedGltf', loadedGltf, false);
        // the old option doesnt work
        // window.addEventListener('onkeypress', keyPressed, false);

        // TOFIX : do we resize the canvas after window.resizeCanvas ?
        // Maybe the function is triggered two times
        resizeCanvas();
    }


    // // // // // // // // // //
    // RENDERING
    // // // // // // // // // //
    // TOFIX: seems that this render function was made to re-calculate the
    // geometry many times no ?

    function render(time) {
        // TODO : explain why it is for, why do we pass back render()
        requestAnimationFrame(render);
        // TODO : explain why it is for, why do we update on render ?
        sceneManager.update();
    }


    // // // // // // // // // //
    // LAUNCH MAIN FUNCTIONS
    // // // // // // // // // //
    bindEventListeners();
    render();
};

export default ThreeEntryPoint;
