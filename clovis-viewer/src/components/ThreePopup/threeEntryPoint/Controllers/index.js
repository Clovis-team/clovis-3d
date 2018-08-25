import _ from 'lodash';

function onKeyPress(event) {
    if (event.key === 'i' && typeof document.getElementById('stats-container') !== 'undefined') {
        toggleDevTools();
    }
}

function onResize(canvas, SceneManager) {
    // Change canvas
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    SceneManager.resizeCanvas();
}

function toggleDevTools() {
    if (
        typeof document.getElementById('stats-container') !== 'undefined'
        && typeof document.getElementById('gui-container') !== 'undefined'
    ) {
        if (document.getElementById('stats-container').style.display === 'block') {
            document.getElementById('stats-container').style.display = 'none';
        } else {
            document.getElementById('stats-container').style.display = 'block';
        }

        if (document.getElementById('gui-container').style.display === 'block') {
            document.getElementById('gui-container').style.display = 'none';
        } else {
            document.getElementById('gui-container').style.display = 'block';
        }
    }
}

function toggleViewerMenu(MenuContainer) {
    const PopupViewer = document.getElementById('popup-viewer');

    if (PopupViewer.classList.contains('popup-viewer_menu-open')) {
        PopupViewer.classList.remove('popup-viewer_menu-open');
        MenuContainer.innerHTML = '';
    } else {
        PopupViewer.classList.add('popup-viewer_menu-open');
    }
}

export default {
    onResize,
    onKeyPress,
    toggleDevTools,
    toggleViewerMenu,
};