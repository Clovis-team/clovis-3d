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

    // Global know if we are on mouse or touch screen
    document.addEventListener('touchstart', () => {
        const ClovisViewerContainer = document.getElementById('clovis-viewer-container');
        ClovisViewerContainer.classList.add('touch-device');
        ClovisViewerContainer.classList.remove('non-touch-device');
    }, false);
    document.addEventListener('mousemove', () => {
        const ClovisViewerContainer = document.getElementById('clovis-viewer-container');
        ClovisViewerContainer.classList.add('non-touch-device');
        ClovisViewerContainer.classList.remove('touch-device');
    }, false);
};

export default Listeners;
