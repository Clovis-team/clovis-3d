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

    // Little UI enhancement
    let userIsDragging = false;
    document.addEventListener('mousedown', () => {
        userIsDragging = true;
        setTimeout(() => {
            if (userIsDragging === true) {
                document.body.style.cursor = 'grabbing';
            }
        }, 200);
    }, false);
    document.addEventListener('mousemove', () => {
        if (userIsDragging === true) {
            document.body.style.cursor = 'grabbing';
        }
    }, false);
    document.addEventListener('mouseup', () => {
        document.body.style.cursor = 'default';
        userIsDragging = false;
    }, false);
};

export default Listeners;
