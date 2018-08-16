/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */
import {
    loadStats,
    loadRendererStats,
    loadGui,
} from './utils';


const DevTools = (InitializedScene) => {
    const {
        renderer,
        scene,
        getSceneCamera,
    } = InitializedScene;

    // Initialize the Three.js Stats panel on top left
    const stats = loadStats();
    // Initalize rendererStats, an other Three.js tool to monitor performances
    const rendererStats = loadRendererStats(renderer);
    // Initialize dat.gui menu
    const gui = loadGui({
        autoPlace: false,
        closed: true,
    });

    // Usefull to use Three.js Chrome inspector
    window.scene = scene;
    window.THREE = THREE;

    // Populate Gui cameras menu
    // populate_gui_cameras(
    //     gui,
    //     getSceneCamera,
    //     getSceneControls,
    //     cameraTypes,
    //     starting_camera_type,
    //     renderer,
    //     change_camera_and_controls,
    //     modifySceneCamera,
    //     modifySceneControls,
    // );

    return {
        stats,
        rendererStats,
    };
};


export default DevTools;
