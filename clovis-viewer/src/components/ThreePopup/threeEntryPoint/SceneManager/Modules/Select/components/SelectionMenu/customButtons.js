import { hexToRgbA } from '../../utils';

export default function createCustomButtons({
    CustomButtons, SelectionMenu, toggleSelectionMenuButton, Selection,
}) {
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
}
