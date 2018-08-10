/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */

import dat from 'dat.gui/build/dat.gui.module';
import Stats from 'stats.js/src/Stats';

/** GUI is the black top left menu with many controls */
function loadGui() {
    const new_gui = new dat.GUI();
    return new_gui;
}
/** Stats is the Three.js Stats panel on bottom left */
function loadStats() {
    const new_stats = new Stats();
    new_stats.showPanel(0);
    new_stats.dom.style = {
        position: 'absolute',
        bottom: 0,
        left: 0,
    };
    document.getElementById('stats-container').appendChild(new_stats.dom);
    return new_stats;
}

const DatGui = (canvas, InitializedScene, sceneManager) => {
    // Initialize gui
    const gui = loadGui({
        autoPlace: false,
    });

    // Place the GUI inside the dom container
    const customContainer = document.getElementById('gui-container');
    customContainer.appendChild(gui.domElement);

    const text = {
        message: 'dat.gui',
        speed: 0.8,
        displayOutline: false,
    };

    const menu = gui.addFolder('folder');
    menu.add(text, 'message');
    menu.add(text, 'speed', -5, 5);
    menu.add(text, 'displayOutline');


    /**
     * Show the Three.js Stats panel on top left
     */
    loadStats();
};


export default DatGui;
