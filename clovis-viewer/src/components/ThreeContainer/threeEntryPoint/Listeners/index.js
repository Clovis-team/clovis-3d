const Listeners = (canvas, sceneManager, Controllers) => {
    // manage event keypress
    window.addEventListener(
        'keypress',
        (e) => {
            Controllers.onKeyPress(e);
        },
        false,
    );

    // manage event resize
    window.addEventListener(
        'resize',
        (e) => {
            Controllers.onResize(canvas, sceneManager);
        },
    );
};

export default Listeners;
