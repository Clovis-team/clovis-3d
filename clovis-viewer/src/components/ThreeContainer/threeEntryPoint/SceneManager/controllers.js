// EVENTS CONTROLLERS

function onMouseMove(x, y) {
    // console.log('mouse moved');
}

function onKeyPressed(event) {
    // TODO: implement a submodule of walking around;
    const walking_keys = ['w', 'a', 's', 'd'];
    if (walking_keys.indexOf(event.key) > -1) {
        console.log(event);
    }
}

// function to be implemented
function onClose() {
    // gui and stats are removed inside OnViewerClose of App.jsx file
    // why ? avoid to Trigger this function from REact

    // TODO: remove eventual listeners;
}

export function onWindowResize(canvas, camera, renderer) {
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}
// very ugly but we will remove this part later after front-end tests
// of resizeCnavas
let canvasHalfWidth;
let canvasHalfHeight;
function resizeCanvas(canvas, getSceneCamera, renderer) {
    console.log('>>>> Window resized ! <<<<<');
    const camera = getSceneCamera();

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvasHalfWidth = Math.round(canvas.offsetWidth / 2);
    canvasHalfHeight = Math.round(canvas.offsetHeight / 2);
    onWindowResize(canvas, camera, renderer);
}


export default {
    onWindowResize,
    canvasHalfWidth,
    resizeCanvas,
    onMouseMove,
    onKeyPressed,
    onClose,
};
