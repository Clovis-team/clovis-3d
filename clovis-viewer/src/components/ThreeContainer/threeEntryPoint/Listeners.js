const Listeners = (canvas, InitializedScene, SceneManager) => {
    const {
        scene,
        camera,
        renderer,
        controls,
    } = InitializedScene;

    const {
        update,
        controllers,
    } = SceneManager;

    // window.onkeypress = keyPressed;
    window.addEventListener(
        'resize',
        controllers.resizeCanvas(
            canvas,
            camera,
            renderer,
        ),
        false,
    );

    window.addEventListener(
        'mousemove',
        ({ screenX, screenY }) => {
            controllers.onMouseMove(screenX - controllers.canvasHalfWidth, screenY - controllers.canvasHalfHeight);
        },
        false,
    );

    window.addEventListener(
        'keypress',
        (e) => {
            controllers.onKeyPressed(e);
        },
        false,
    );
};

export default Listeners;
