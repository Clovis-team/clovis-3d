import dat from 'dat.gui/build/dat.gui.module';
import Stats from 'stats.js/src/Stats';


/** GUI is the black top left menu with many controls */
export function loadGui() {
    window.gui = new dat.GUI();

    // Place the GUI inside the right html container
    const customContainer = document.getElementById('gui-container');
    customContainer.appendChild(window.gui.domElement);

    return window.gui;
}

/** Stats is the Three.js Stats panel on bottom left */
export function loadStats() {
    window.stats = new Stats();
    window.stats.setMode(1);
    window.stats.showPanel(0);
    window.stats.dom.style = {
        position: 'absolute',
        bottom: 0,
        left: 0,
    };
    document.getElementById('stats-container').appendChild(window.stats.dom);
    return window.stats;
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
