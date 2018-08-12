const Listeners = (canvas, InitializedScene, SceneManager) => {
    const {
        scene, getSceneCamera, getSceneControls, renderer,
    } = InitializedScene;


    const {
        update,
        controllers,
    } = SceneManager;

    // window.onkeypress = keyPressed;

    // Manage Window Resize. Both functions are needed
    window.onresize = () => {
        // this one is when window is actually loaded
        controllers.resizeCanvas(
            canvas,
            getSceneCamera,
            renderer,
        );
    };
    window.addEventListener(
        // this one is for when the popup is opened
        'resize', // this one is fo
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
