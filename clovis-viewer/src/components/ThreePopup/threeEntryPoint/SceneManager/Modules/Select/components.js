import { toggleSelectionMenuButton, hexToRgbA } from './utils';

// 3D Components

export function addSphereOnHitPoint(intersected, scene) {
    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00b16a });
    const sphere = new THREE.Mesh(geometry, material);
    const position = intersected.point;

    sphere.position.copy(position);
    scene.add(sphere);
    return sphere;
}

// HTML Components

export function createSelectionMenu({ SelectOptions, hitPoint, camera }) {
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

    const CloseSelectionMenu = document.createElement('div');
    CloseSelectionMenu.className = 'three-selection-menu-element three-selection-menu-close';
    CloseSelectionMenu.innerHTML = '✕';
    CloseSelectionMenu.addEventListener('mousedown', () => {
        toggleSelectionMenuButton();
    }, false);
    CloseSelectionMenu.addEventListener('touchstart', () => {
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
        ButtonElement.addEventListener('mouseover', () => {
            ButtonElement.style.backgroundColor = !Button.color ? hexToRgbA('#060d2d', 0.07) : hexToRgbA(Button.color, 0.12);
        }, false);
        ButtonElement.addEventListener('mouseleave', () => {
            ButtonElement.style.backgroundColor = 'transparent';
        }, false);

        SelectionMenu.appendChild(ButtonElement);
    });


    // GO CLOSER interaction
    const SelectionMenuElement1 = document.createElement('div');
    SelectionMenuElement1.className = 'three-selection-menu-element three-type-action';
    SelectionMenuElement1.innerHTML = '<span>⊛</span> Se rapprocher';
    SelectionMenu.appendChild(SelectionMenuElement1);


    document.getElementById('popup-viewer').appendChild(SelectionMenu);
    return SelectionMenu;
}
