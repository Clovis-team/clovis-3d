/**
 * Buttons and Controls directly on the viewer
 */

import { MenuToggle } from './utils';


const ViewerButtons = (ButtonsContainer) => {


    // Create the Menu button
    const MenuButton = document.createElement('div');
    MenuButton.style = {
        position: 'absolute';
        color: 'red';
        height: '2rem';
        width: '2rem';
        // WIP 
    }

};

const Menu = () => {

};

const MenuAndButtons = () => {

    const MenuContainer = document.getElementById('three-clovis-menu');
    const ButtonsContainer = document.getElementById('three-clovis-buttons');

    // Display viewer buttons 
    ViewerButtons(ButtonsContainer);

};
