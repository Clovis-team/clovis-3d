/**
 * Buttons and Controls directly on the viewer
 */

import {
    createToggleMenuButton,
    createToggleExplosionButton,
    createCrossSectionButton,
    createHorizontalSectionButton,
} from './utils';


const ViewerButtons = (ButtonsContainer) => {
    // Create the Menu button
    createToggleMenuButton(ButtonsContainer);
    // Create other action buttons
    createToggleExplosionButton(ButtonsContainer);
    createHorizontalSectionButton(ButtonsContainer);
    createCrossSectionButton(ButtonsContainer);
};

// const Menu = () => {

// };

const MenuAndButtons = () => {
    // const MenuContainer = document.getElementById('three-clovis-menu-container');
    const ButtonsContainer = document.getElementById('three-clovis-buttons-container');

    // Display viewer buttons
    ViewerButtons(ButtonsContainer);
};

export default MenuAndButtons;
