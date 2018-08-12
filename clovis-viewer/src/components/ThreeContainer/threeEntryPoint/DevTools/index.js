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
    } = InitializedScene;

    // Initialize the Three.js Stats panel on top left
    const stats = loadStats();
    // Initalize rendererStats, an other Three.js tool to monitor performances
    const rendererStats = loadRendererStats(renderer);

    return {
        stats,
        rendererStats,
    };
};


export default DevTools;
