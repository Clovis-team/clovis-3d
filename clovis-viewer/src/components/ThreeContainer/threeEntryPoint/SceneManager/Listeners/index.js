const Listeners = (
    canvas,
    InitializedScene,
    Cameras,
    Controllers,
) => {
    const {
        scene, getSceneCamera, getSceneControls, renderer,
    } = InitializedScene;


    // window.onkeypress = keyPressed;

    // Manage Window Resize
    window.addEventListener(
        'resize', // this one is fo
        () => {
            Controllers.resizeCanvas(
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
            Controllers.onMouseMove(e);
        },
        false,
    );

    // This listener is working
    window.addEventListener(
        'keypress',
        (e) => {
            Controllers.onKeyPressed(e);
        },
        false,
    );

    // We have to wait the end of Gltf treatment to display the Menus and Tools
    // because they need the resulting datas
    window.addEventListener(
        'endOfLoaderCallback',
        () => {
            Controllers.onEndOfLoaderCallback(
                canvas,
                InitializedScene,
                Cameras,
            );
        },
        false,
    );
};

export default Listeners;
