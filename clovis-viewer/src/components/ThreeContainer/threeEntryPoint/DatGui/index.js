/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */
import { loadGui, loadStats } from './utils';

function populate_gui_camera(
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

function populate_height_gui(gui, getSceneCamera) {
    const camera = getSceneCamera();

    const height = gui.add(camera, 'height').listen();
}


const DatGui = (canvas, InitializedScene, sceneManager) => {
    const {
        scene,
        getSceneCamera,
        renderer,
        getSceneControls,
        modifySceneCamera,
        modifySceneControls,
        cameraTypes,
        starting_camera_type,
    } = InitializedScene;
    const { change_camera_and_controls } = sceneManager.cameras;

    // Initialize gui
    const gui = loadGui({ autoPlace: false });

    // Initialize the Three.js Stats panel on top left
    const stats = loadStats();

    // Populate Gui cameras menu
    populate_gui_camera(
        gui,
        getSceneCamera,
        getSceneControls,
        cameraTypes,
        starting_camera_type,
        renderer,
        change_camera_and_controls,
        modifySceneCamera,
        modifySceneControls,
    );
    // TODO: explain this part
    populate_height_gui(gui, getSceneCamera);
};


export default DatGui;
