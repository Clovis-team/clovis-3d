/**
 * Buttons and Controls directly on the viewer
 */

import {
    // UTILITARY BUTTONS
    createToggleMenuButton,
    createToggleExplosionButton,
    // createCrossSectionButton,
    createHorizontalSectionButton,
} from './utils';


const ViewerButtons = (ButtonsContainer, getBuildingDatas) => {
    // Create the Menu button
    createToggleMenuButton(ButtonsContainer, getBuildingDatas);
    // Create other action buttons
    createToggleExplosionButton(ButtonsContainer, getBuildingDatas);
    createHorizontalSectionButton(ButtonsContainer);
    // createCrossSectionButton(ButtonsContainer);
};


const MenuAndButtons = (getBuildingDatas) => {
    const ButtonsContainer = document.getElementById('three-clovis-buttons-container');

    // Display viewer buttons
    ViewerButtons(ButtonsContainer, getBuildingDatas);
};

export default MenuAndButtons;
