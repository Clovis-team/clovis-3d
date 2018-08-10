/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */

import dat from 'dat.gui/build/dat.gui.module';
import Stats from 'stats.js/src/Stats';

/** GUI is the black top left menu with many controls */
function loadGui() {
    window.gui = new dat.GUI();
    return window.gui;
}
/** Stats is the Three.js Stats panel on bottom left */
function loadStats() {
    window.stats = new Stats();
    window.stats.showPanel(0);
    window.stats.dom.style = {
        position: 'absolute',
        bottom: 0,
        left: 0,
    };
    document.getElementById('stats-container').appendChild(window.stats.dom);
    return window.stats;
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
