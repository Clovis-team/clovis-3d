/**
 * Buttons and Controls directly on the viewer
 */

import {
    createToggleMenuButton,
    createToggleExplosionButton,
    createCrossSectionButton,
    createHorizontalSectionButton,
} from './utils';


const ViewerButtons = (ButtonsContainer, getBuildingDatas) => {
    // Create the Menu button
    createToggleMenuButton(ButtonsContainer);
    // Create other action buttons
    createToggleExplosionButton(ButtonsContainer, getBuildingDatas);
    createHorizontalSectionButton(ButtonsContainer);
    createCrossSectionButton(ButtonsContainer);
};

// const Menu = () => {

// };

const MenuAndButtons = (getBuildingDatas) => {
    // const MenuContainer = document.getElementById('three-clovis-menu-container');
    const ButtonsContainer = document.getElementById('three-clovis-buttons-container');

    // Display viewer buttons
    ViewerButtons(ButtonsContainer, getBuildingDatas);
};

export default MenuAndButtons;
