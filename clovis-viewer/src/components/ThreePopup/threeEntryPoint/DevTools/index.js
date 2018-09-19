/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */
import {
    loadStats,
    // loadRendererStats,
    loadGui,
} from './utils';


const DevTools = () => {
    // Initialize the Three.js Stats panel on top left
    const stats = loadStats();
    // Initialize dat.gui menu
    const gui = loadGui({
        autoPlace: false,
        closed: true,
    });

    // Usefull to use Three.js Chrome inspector
    window.gui = gui;
    // window.scene = scene;
    // window.THREE = THREE;

    function destroy() {
        gui.destroy();
    }

    return {
        stats,
        destroy,
        // rendererStats,
    };
};


export default DevTools;
