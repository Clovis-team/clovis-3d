const Listeners = (
    canvas,
    InitializedScene,
    Cameras,
    Controllers,
    mouse,
    object_selected,
    raycaster,
) => {
    const {
        scene,
        getSceneCamera,
        getSceneControls,
        renderer,
        getBuildingDatas,
    } = InitializedScene;

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
            Controllers.displayMenuAndButtons(
                canvas,
                InitializedScene,
                Cameras,
                object_selected,
            );
        },
        false,
    );

    window.addEventListener(
        'mouseup',
        (e) => {
            Controllers.onDocumentMouseClick(
                e,
                mouse,
                object_selected,
                getSceneCamera,
                raycaster,
                getBuildingDatas,
            );
        },
        false,
    );
};

export default Listeners;
