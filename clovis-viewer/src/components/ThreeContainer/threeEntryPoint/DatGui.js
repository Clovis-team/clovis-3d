/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */

import dat from 'dat.gui/build/dat.gui.module';

function loadGui() {
    const new_gui = new dat.GUI();
    return new_gui;
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
};

export default DatGui;
