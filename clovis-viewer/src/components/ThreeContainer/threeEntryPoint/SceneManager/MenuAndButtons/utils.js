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

export function populate_gui_camera(
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
