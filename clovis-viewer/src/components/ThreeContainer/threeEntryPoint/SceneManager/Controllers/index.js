
import { selectionHandler } from './utils';
import { asynchronous_gltf_loader_gui_populate } from '../../DevTools/utils';

// TODO: put this variables in an other "stable" place
let canvasHalfWidth;
let canvasHalfHeight;

// EVENTS CONTROLLERS

function onMouseMove({ screenX, screenY }) {
    const x = screenX - canvasHalfWidth;
    const y = screenY - canvasHalfHeight;

    // console.log('mouse moved');
}

function onKeyPressed(event) {
    // TODO: implement a submodule of walking around;
    const walking_keys = [
        // Forward
        'e',
        // Step Left
        's',
        // Backward
        'd',
        // Step Right
        'f',
        // Go up
        't',
        // Go down
        'g',
    ];
    // if (walking_keys.indexOf(event.key) > -1) {
    //     console.log(event);
    // }

    // Utilitary to show hide the stats as gui does on H shortcut
    if (event.key === 'i'
        && typeof document.getElementById('stats-container') !== 'undefined'
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

function onClose() {
    // gui and stats are removed inside OnViewerClose of App.jsx file
    // why ? avoid to Trigger this function from REact

    // TODO: remove eventual listeners;
}

function resizeCanvas(canvas, getSceneCamera, renderer) {
    const camera = getSceneCamera();

    // Change canvas
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // TODO: unused but could be usefull
    canvasHalfWidth = Math.round(canvas.offsetWidth / 2);
    canvasHalfHeight = Math.round(canvas.offsetHeight / 2);

    // TODO: check if all of that works
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

function LoaderEnded(canvas, InitializedScene, object_selected) {
    const buildingDatas = InitializedScene.getBuildingDatas();

    asynchronous_gltf_loader_gui_populate(buildingDatas);
}

function onDocumentMouseClick(
    event, mouse, object_selected, getSceneCamera, raycaster, getBuildingDatas, scene,
) {
    event.preventDefault();

    const new_mouse = mouse;

    // Correct the mouse position
    new_mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    new_mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    selectionHandler(
        new_mouse,
        object_selected,
        getSceneCamera,
        raycaster,
        getBuildingDatas,
        scene,
    );
}

function onDocumentTouchEnd(
    event, mouse, object_selected, getSceneCamera, raycaster, getBuildingDatas, scene,
) {
    event.preventDefault();

    const new_mouse = mouse;

    new_mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    new_mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    selectionHandler(
        new_mouse,
        object_selected,
        getSceneCamera,
        raycaster,
        getBuildingDatas,
        scene,
    );
}


function ToggleWalking() {
    console.log('>>> Toggling walking >>>');
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


export default {
    canvasHalfWidth,
    resizeCanvas,
    onMouseMove,
    onKeyPressed,
    onClose,
    LoaderEnded,
    onDocumentMouseClick,
    onDocumentTouchEnd,
    ToggleWalking,
    toggleBuildingExplosion,
};
