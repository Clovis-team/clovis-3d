import dat from 'dat.gui/build/dat.gui.module';
import Stats from 'stats.js/src/Stats';
// import RendererStats from '@xailabs/three-renderer-stats';


/** Stats is the Three.js Stats panel on bottom left */
export function loadStats() {
    window.stats = new Stats();
    window.stats.setMode(1);
    window.stats.showPanel(0);
    window.stats.dom.style = {
        position: 'absolute',
        bottom: 0,
        right: 0,
    };
    document.getElementById('stats-container').appendChild(window.stats.dom);
    return window.stats;
}

// export function loadRendererStats() {
//     window.rendererStats = new RendererStats();
//     window.rendererStats.domElement.className = 'renderer-stats';

//     document.getElementById('stats-container').appendChild(window.rendererStats.domElement);

//     return window.rendererStats;
// }

/** GUI is the black top left menu with many controls */
export function loadGui() {
    if (typeof window.gui !== 'undefined') window.gui.destroy();

    window.gui = new dat.GUI();

    // Place the GUI inside the right html container
    const customContainer = document.getElementById('gui-container');
    customContainer.appendChild(window.gui.domElement);

    return window.gui;
}

export function populate_gui_floors(gui, floors) {
    const gui_floor_folder = gui.addFolder('Floors');

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

export function populate_gui_selected_object_ifc_tags(gui, object_selected) {
    const gui_object_selected_folder = gui.addFolder('Selected Object Infos');

    gui_object_selected_folder.add(object_selected, 'ifc_tag').listen();
    gui_object_selected_folder.add(object_selected, 'ifc_name').listen();
}

export function asynchronous_gltf_loader_gui_populate(buildingDatas) {
    const { gui } = window;

    populate_gui_floors(gui, buildingDatas.floors);
    // Gui ifc tags selection
    populate_gui_ifc_tags(gui, buildingDatas.building_ifc_elements);
    // Show the ifc infos of the selected Element
    // populate_gui_selected_object_ifc_tags(gui, object_selected);
    // Little explosion interraction with gui
    populate_gui_explosion(gui, buildingDatas.floors);
}
