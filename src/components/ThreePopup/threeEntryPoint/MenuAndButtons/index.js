/**
 * Buttons and Controls directly on the viewer
 */

import {
    // UTILITARY BUTTONS
    createToggleExplosionButton,
    // createCrossSectionButton,
    createHelpButton,
    createHorizontalSectionButton,
} from './utils';

import createToggleMenuButton from './components/BimMenu';


const MenuAndButtons = (getBuildingDatas, { modulesObject }) => {
    const ButtonsContainer = document.getElementById('three-clovis-buttons-container');

    // Create the Menu and the Menu button
    createToggleMenuButton(ButtonsContainer, getBuildingDatas);
    // Create other action buttons
    createToggleExplosionButton(ButtonsContainer, modulesObject);
    createHorizontalSectionButton(ButtonsContainer, modulesObject);
    createHelpButton(ButtonsContainer);
    // createCrossSectionButton(ButtonsContainer);
};

export default MenuAndButtons;
