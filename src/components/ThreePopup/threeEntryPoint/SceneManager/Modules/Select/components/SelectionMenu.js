import { toggleSelectionMenuButton, hexToRgbA, takeScreenshot } from '../../utils';

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

    CustomButtons.forEach((Button) => {
        const ButtonElement = document.createElement('div');
        ButtonElement.className = 'three-selection-menu-element';
        ButtonElement.innerHTML = `<span>${Button.icon}</span> ${Button.text}`;
        ButtonElement.style.color = !Button.color ? '#060d2d' : Button.color;
        ButtonElement.addEventListener('click', () => {
            toggleSelectionMenuButton();
            Button.ClickFunction(Selection);
        }, false);
        ButtonElement.addEventListener('touchend', () => {
            toggleSelectionMenuButton();
            Button.ClickFunction(Selection);
        }, false);
        ButtonElement.addEventListener('mouseover', () => {
            ButtonElement.style.backgroundColor = !Button.color ? hexToRgbA('#060d2d', 0.07) : hexToRgbA(Button.color, 0.12);
        }, false);
        ButtonElement.addEventListener('mouseleave', () => {
            ButtonElement.style.backgroundColor = 'transparent';
        }, false);
        ButtonElement.addEventListener('touchstart', () => {
            ButtonElement.style.backgroundColor = !Button.color ? hexToRgbA('#060d2d', 0.07) : hexToRgbA(Button.color, 0.12);
        }, false);
        ButtonElement.addEventListener('touchend', () => {
            ButtonElement.style.backgroundColor = 'transparent';
        }, false);

        SelectionMenu.appendChild(ButtonElement);
    });


    // GO CLOSER interaction
    const SelectionMenuElement1 = document.createElement('a');
    SelectionMenuElement1.className = 'three-selection-menu-element three-type-action';
    SelectionMenuElement1.innerHTML = '<span>⊛</span> Prendre une capture';
    SelectionMenuElement1.addEventListener('click', () => {
        takeScreenshot(renderer);
    });
    SelectionMenuElement1.addEventListener('touchend', () => {
        takeScreenshot(renderer);
    });
    SelectionMenu.appendChild(SelectionMenuElement1);


    document.getElementById('popup-viewer').appendChild(SelectionMenu);
    return SelectionMenu;
}
