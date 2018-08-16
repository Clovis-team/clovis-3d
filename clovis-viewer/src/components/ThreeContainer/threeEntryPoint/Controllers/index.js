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

function get_main_floor(floor_array) {
    let max_value = 0;
    let max_id = 0;
    floor_array.forEach((floor, index) => {
        if (floor.children.length > max_value) {
            max_value = floor.children.length;
            max_id = index;
        }
    });
    return max_id;
}
function toggleBuildingExplosion(floorsExploded, getBuildingDatas) {
    const buildingDatas = getBuildingDatas();
    const { floors } = buildingDatas;
    const z_delta = 20;

    const main_floor = get_main_floor(floors);

    switch (floorsExploded.exploded) {
    case true: {
        floors.forEach((floor_no, index) => {
            const floor = floor_no;
            floor.position.z -= (z_delta * (index - main_floor));
        });
        floorsExploded.exploded = false;
        break;
    }
    case false: {
        floors.forEach((floor_no, index) => {
            const floor = floor_no;
            floor.position.z += (z_delta * (index - main_floor));
        });
        floorsExploded.exploded = true;
        break;
    }
    default:
        break;
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
    toggleBuildingExplosion,
    toggleDevTools,
    toggleViewerMenu,
};
