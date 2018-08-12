const Listeners = (canvas, InitializedScene, SceneManager) => {
    const {
        scene, getSceneCamera, getSceneControls, renderer,
    } = InitializedScene;


    const {
        update,
        controllers,
    } = SceneManager;

    // window.onkeypress = keyPressed;

    // Manage Window Resize
    window.addEventListener(
        'resize', // this one is fo
        () => {
            controllers.resizeCanvas(
                canvas,
                getSceneCamera,
                renderer,
            );
        },
        false,
    );

    // This listener is working
    window.addEventListener(
        'mousemove',
        (e) => {
            controllers.onMouseMove(e);
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
