const Listeners = (canvas, InitializedScene, SceneManager) => {
    const {
        scene, getSceneCamera, getSceneControls, renderer,
    } = InitializedScene;


    const {
        update,
        controllers,
    } = SceneManager;

    // window.onkeypress = keyPressed;

    // TODO: this listener is working only on first load,
    // not working on page resize, find why
    window.addEventListener(
        'resize',
        controllers.resizeCanvas(
            canvas,
            getSceneCamera,
            renderer,
        ),
        false,
    );

    // This listener is working
    window.addEventListener(
        'mousemove',
        ({ screenX, screenY }) => {
            controllers.onMouseMove(
                screenX - controllers.canvasHalfWidth,
                screenY - controllers.canvasHalfHeight,
            );
        },
        false,
    );

    // This listener is working
    window.addEventListener(
        'keypress',
        (e) => {
            controllers.onKeyPressed(e);
        },
        false,
    );
};

export default Listeners;
