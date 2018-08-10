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
    const gui = loadGui();
};

export default DatGui;
