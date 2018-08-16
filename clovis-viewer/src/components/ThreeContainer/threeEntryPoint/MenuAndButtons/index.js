/**
 * Buttons and Controls directly on the viewer
 */

import {
    // UTILITARY BUTTONS
    createToggleMenuButton,
    createToggleExplosionButton,
    // createCrossSectionButton,
    createHelpButton,
    createHorizontalSectionButton,
} from './utils';

const MenuAndButtons = (getBuildingDatas) => {
    const ButtonsContainer = document.getElementById('three-clovis-buttons-container');

    // Create the Menu button
    createToggleMenuButton(ButtonsContainer, getBuildingDatas);
    // Create other action buttons
    createToggleExplosionButton(ButtonsContainer, getBuildingDatas);
    createHorizontalSectionButton(ButtonsContainer);
    createHelpButton(ButtonsContainer);
    // createCrossSectionButton(ButtonsContainer);
};

export default MenuAndButtons;