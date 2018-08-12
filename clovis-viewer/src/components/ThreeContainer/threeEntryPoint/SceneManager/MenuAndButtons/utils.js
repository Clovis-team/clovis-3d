import dat from 'dat.gui/build/dat.gui.module';
import Stats from 'stats.js/src/Stats';
import RendererStats from '@xailabs/three-renderer-stats';
import { type } from 'os';


/** GUI is the black top left menu with many controls */
export function loadGui() {
    window.gui = new dat.GUI();

    // Place the GUI inside the right html container
    const customContainer = document.getElementById('gui-container');
    customContainer.appendChild(window.gui.domElement);

    return window.gui;
}

export function populate_gui_cameras(
    gui,
    getSceneCamera,
    getSceneControls,
    cameraTypes,
    camera_type,
    renderer,
    change_camera_and_controls,
    modifySceneCamera,
    modifySceneControls,
) {
    const gui_camera = gui.addFolder('Camera options');
    const new_camera = { type: camera_type };
    const controller = gui_camera.add(new_camera, 'type', cameraTypes);

    controller.onChange((value) => {
        change_camera_and_controls(
            cameraTypes,
            value,
            getSceneCamera,
            getSceneControls,
            renderer,
            modifySceneCamera,
            modifySceneControls,
        );
    });
}

export function populate_height_gui(gui, getSceneCamera) {
    const camera = getSceneCamera();

    const height = gui.add(camera, 'height').listen();
}

export function populate_gui_floors(gui, floors) {
    const gui_floor_folder = gui.addFolder('Floors');

    console.log('>>> floors :', floors);

    if (typeof floors !== 'undefined') {
        for (let i = floors.length - 1; i >= 0; i -= 1) {
            const floor_name = floors[i].name.split('_')[1];
            gui_floor_folder.add(floors[i], 'visible').name(floor_name);
        }
    } else {
        gui_floor_folder.add({ state: 'No floors yet' }, 'state');
    }
}

export function populate_gui_ifc_tags(gui, elements) {
    const gui_ifc_tags_folder = gui.addFolder('Ifc Tags');
    elements.forEach((element_no) => {
        const element = element_no;
        const ifc_tag = element.name;
        const controller = gui_ifc_tags_folder.add(element, 'visible_order').name(ifc_tag);

        controller.onChange(() => {
            if (element.visible_order !== element.visible) {
                element.children.forEach((obj_no) => {
                    const obj = obj_no;
                    obj.visible = element.visible_order;
                });
                element.visible = element.visible_order;
            }
        });
    });
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
export function populate_gui_explosion(gui, floors) {
    const explosion = {
        z_old: 0,
        z_new: 0,
        z_delta: 0,
    };

    const main_floor = get_main_floor(floors);

    const controller = gui.add(explosion, 'z_new', 0, 100).name('z_explosion');

    controller.onChange(() => {
        explosion.z_delta = explosion.z_new - explosion.z_old;
        floors.forEach((floor_no, index) => {
            const floor = floor_no;
            floor.position.z += (explosion.z_delta * (index - main_floor));
        });

        explosion.z_old = explosion.z_new;
        explosion.z_delta = 0;
    });
}
