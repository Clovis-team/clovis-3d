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

function toggleBuildingExplosion(floorsExploded, getBuildingDatas, getRemovedTags, changeRemovedTags) {
    const buildingDatas = getBuildingDatas();
    const { floors, building_ifc_elements } = buildingDatas;
    const z_delta = 20;

    // Manage the removing of the coverings
    // const CoveringCategory = _.find(building_ifc_elements, { name: 'IfcCovering' });
    // const new_removedTags = getRemovedTags();

    // console.log('CoveringCategory :', CoveringCategory);

    const main_floor = get_main_floor(floors);

    switch (floorsExploded.exploded) {
    case true: {
        // new_removedTags.push(CoveringCategory.uuid);
        // changeRemovedTags(new_removedTags);
        // building_ifc_elements.forEach(category => {
        //     if(category.uuid)

        // })
        floors.forEach((floor_no, index) => {
            const floor = floor_no;
            floor.position.z -= (z_delta * (index - main_floor));
        });
        floorsExploded.exploded = false;
        break;
    }
    case false: {
        // new_removedTags.filter(category => (category.uuid !== CoveringCategory.uuid));
        // changeRemovedTags(new_removedTags);
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
