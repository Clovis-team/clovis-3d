/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */
import {
    loadStats,
    loadRendererStats,
} from './utils';


const DevTools = (InitializedScene) => {
    const {
        renderer,
        // scene,
    } = InitializedScene;

    // Initialize the Three.js Stats panel on top left
    const stats = loadStats();
    // Initalize rendererStats, an other Three.js tool to monitor performances
    const rendererStats = loadRendererStats(renderer);

    // Usefull to use Three.js Chrome inspector
    // window.scene = scene;
    // window.THREE = THREE;

    return {
        stats,
        rendererStats,
    };
};


export default DevTools;
