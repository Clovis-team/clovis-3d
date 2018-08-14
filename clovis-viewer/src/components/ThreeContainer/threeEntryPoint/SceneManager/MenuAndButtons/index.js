/**
 * Buttons and Controls directly on the viewer
 */

// import { MenuToggle } from './utils';


const ViewerButtons = (ButtonsContainer) => {
    // Create the Menu button
    const MenuButton = document.createElement('div');
    MenuButton.style.position = 'absolute';
    MenuButton.style.top = '0';
    MenuButton.style.left = '0';
    MenuButton.style.backgroundColor = 'red';
    MenuButton.style.height = '10rem';
    MenuButton.style.width = '10rem';
    MenuButton.className = 'three-clovis-buttons-container';

    ButtonsContainer.appendChild(MenuButton);
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
