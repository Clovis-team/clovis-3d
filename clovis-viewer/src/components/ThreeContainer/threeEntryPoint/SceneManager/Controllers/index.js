import MenuAndButtons from '../MenuAndButtons';

// TODO: put this variables in an other "stable" place
let canvasHalfWidth;
let canvasHalfHeight;

// EVENTS CONTROLLERS

function onMouseMove({ screenX, screenY }) {
    const x = screenX - canvasHalfWidth;
    const y = screenY - canvasHalfHeight;

    // console.log('mouse moved');
}

function onKeyPressed(event) {
    // TODO: implement a submodule of walking around;
    const walking_keys = ['w', 'a', 's', 'd'];
    if (walking_keys.indexOf(event.key) > -1) {
        console.log(event);
    }
}

function onClose() {
    // gui and stats are removed inside OnViewerClose of App.jsx file
    // why ? avoid to Trigger this function from REact

    // TODO: remove eventual listeners;
}

function resizeCanvas(canvas, getSceneCamera, renderer) {
    const camera = getSceneCamera();

    // Change canvas
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // TODO: unused but could be usefull
    canvasHalfWidth = Math.round(canvas.offsetWidth / 2);
    canvasHalfHeight = Math.round(canvas.offsetHeight / 2);

    // TODO: check if all of that works
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

function onEndOfLoaderCallback(canvas, InitializedScene, Cameras) {
    MenuAndButtons(
        canvas,
        InitializedScene,
        Cameras,
    );
}


export default {
    canvasHalfWidth,
    resizeCanvas,
    onMouseMove,
    onKeyPressed,
    onClose,
    onEndOfLoaderCallback,
};
