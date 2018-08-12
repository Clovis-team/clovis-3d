/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */
import {
    loadGui,
    loadStats,
    loadRendererStats,
    populate_gui_camera,
    populate_height_gui,
} from './utils';


const MenuAndTools = (canvas, InitializedScene, sceneManager) => {
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

    // Initialize dat.gui menu
    const gui = loadGui({ autoPlace: false });

    // Initialize the Three.js Stats panel on top left
    const stats = loadStats();
    // Initalize rendererStats, an other Three.js tool to monitor performances
    const rendererStats = loadRendererStats(renderer);

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


    return {
        gui,
        stats,
        rendererStats,
    };
};


export default MenuAndTools;
