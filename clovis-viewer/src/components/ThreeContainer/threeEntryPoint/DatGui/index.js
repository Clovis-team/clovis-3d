/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */
import { loadGui, loadStats } from './utils';

function populate_gui_camera(
    gui,
    camera,
    controls,
    cameraTypes,
    camera_number,
    renderer,
    setup_camera,
) {
    const gui_camera = gui.addFolder('Camera options');
    const new_camera = { type: cameraTypes[camera_number] };
    const controller = gui_camera.add(new_camera, 'type', cameraTypes);
    controller.onChange((value) => {
        setup_camera(cameraTypes, value, camera, controls, renderer);
    });
}

function populate_height_gui(gui, camera) {
    const height = gui.add(camera, 'height').listen();
}


const DatGui = (canvas, InitializedScene, sceneManager) => {
    const {
        scene, camera, renderer, controls, cameraTypes, starting_camera_number,
    } = InitializedScene;
    const { change_camera } = sceneManager.cameras;

    // Initialize gui
    const gui = loadGui({ autoPlace: false });


    // Initialize the Three.js Stats panel on top left
    const stats = loadStats();

    // Populate Gui cameras menu
    populate_gui_camera(
        gui,
        camera,
        controls,
        cameraTypes,
        starting_camera_number,
        renderer,
        change_camera,
    );
    // TODO: explain this part
    populate_height_gui(gui, camera);
};


export default DatGui;
