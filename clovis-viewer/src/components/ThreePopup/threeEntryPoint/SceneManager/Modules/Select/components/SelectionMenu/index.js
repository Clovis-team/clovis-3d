import { toggleSelectionMenuButton } from '../../utils';

import createCustomButtons from './customButtons';
import createStandardButtons from './standardButtons';
// HTML Components

export default function createSelectionMenu({
    SelectOptions, hitPoint, camera, renderer,
}) {
    const Selection = {
        position: hitPoint.point,
        camera: {
            position: camera.position,
        },
        object: hitPoint.object,
    };

    const { CustomButtons } = SelectOptions.options;

    const SelectionMenu = document.createElement('div');
    SelectionMenu.id = 'three-selection-menu';
    SelectionMenu.className = 'three-selection-menu';
    SelectionMenu.style.position = 'absolute';
    SelectionMenu.addEventListener('mousedown', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
    }, false);
    SelectionMenu.addEventListener('touchstart', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
    }, false);

    const SelectionMenuButton = document.createElement('div');
    SelectionMenuButton.classList.add('three-selection-menu-button');
    SelectionMenuButton.innerHTML = '···';
    SelectionMenuButton.addEventListener('click', () => {
        toggleSelectionMenuButton();
    }, false);
    SelectionMenuButton.addEventListener('touchend', () => {
        toggleSelectionMenuButton();
    }, false);

    const CloseSelectionMenu = document.createElement('div');
    CloseSelectionMenu.className = 'three-selection-menu-element three-selection-menu-close';
    CloseSelectionMenu.innerHTML = '✕';
    CloseSelectionMenu.addEventListener('mousedown', () => {
        toggleSelectionMenuButton();
    }, false);
    CloseSelectionMenu.addEventListener('touchend', () => {
        toggleSelectionMenuButton();
    }, false);

    SelectionMenu.appendChild(SelectionMenuButton);
    SelectionMenu.appendChild(CloseSelectionMenu);

    // Add the custom buttons
    createCustomButtons({
        SelectionMenu, CustomButtons, toggleSelectionMenuButton, Selection,
    });

    createStandardButtons({
        SelectionMenu, toggleSelectionMenuButton, renderer, Selection,
    });


    document.getElementById('popup-viewer').appendChild(SelectionMenu);
    return SelectionMenu;
}
