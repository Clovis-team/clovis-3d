/**
 * Buttons and Controls directly on the viewer
 */

// import { MenuToggle } from './utils';


const ViewerButtons = (ButtonsContainer) => {
    // Create the Menu button
    const MenuButton = document.createElement('div');
    MenuButton.style = {
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'red',
        height: '2rem',
        width: '2rem',
        // WIP
    };

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
