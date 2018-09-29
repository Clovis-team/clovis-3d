import { takeScreenshot } from '../../utils';

export const addEventListeners = (targetElement, eventsString, triggeredFunction) => {
    eventsString.split(' ').forEach(event => targetElement.addEventListener(event, triggeredFunction, false));
};

export default function createStandardButtons({
    SelectionMenu, toggleSelectionMenuButton, renderer, Selection,
}) {
    // SHOW BIM Infos
    const SelectionMenuElement1 = document.createElement('a');
    SelectionMenuElement1.className = 'three-selection-menu-element three-type-bim';
    SelectionMenuElement1.innerHTML = '<span>☷</span> Voir les infos BIM';
    SelectionMenuElement1.addEventListener('click', () => {
        createBimInfoPopup(Selection, renderer);
        toggleSelectionMenuButton();
        // takeScreenshot(renderer);
    });
    SelectionMenuElement1.addEventListener('touchend', () => {
        createBimInfoPopup(Selection, renderer);
        toggleSelectionMenuButton();
        // takeScreenshot(renderer);
    });
    SelectionMenu.appendChild(SelectionMenuElement1);
}

const BimInfoContent = (BimInfoContentContainer, Selection, renderer) => {
    console.log('Selection :', Selection);

    const img = new Image();
    img.src = renderer.domElement.toDataURL();

    const CaptureHeader = document.createElement('div');
    CaptureHeader.className = 'three-clovis-popup_capture-header';
    CaptureHeader.appendChild(img);

    BimInfoContentContainer.appendChild(CaptureHeader);
};

const createBimInfoPopup = (Selection, renderer) => {
    const BimInfoPopupContainer = document.getElementById('three-popup-container');
    BimInfoPopupContainer.classList.add('three-bim-popup-container');
    BimInfoPopupContainer.classList.add('three-show-popup');

    const closeBimInfoPopup = () => {
        BimInfoPopupContainer.innerHTML = '';
        BimInfoPopupContainer.classList.remove('three-show-popup');
    };

    const ClosePopupButton = document.createElement('div');
    ClosePopupButton.className = 'three-clovis-popup_close-button';
    ClosePopupButton.innerHTML = '✕';
    addEventListeners(
        ClosePopupButton,
        'click touchend',
        () => {
            closeBimInfoPopup();
        },
    );

    const BimInfoContentContainer = document.createElement('div');
    BimInfoContentContainer.className = 'three-clovis-popup_content-container';

    BimInfoContent(BimInfoContentContainer, Selection, renderer);

    const BimInfoPopup = document.createElement('div');
    BimInfoPopup.className = 'three-clovis_popup';

    const BimInfoOverlay = document.createElement('div');
    BimInfoOverlay.className = 'three-clovis-popup_overlay';
    addEventListeners(
        BimInfoOverlay,
        'mousedown touchend',
        () => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            closeBimInfoPopup();
        },
    );

    BimInfoPopup.appendChild(ClosePopupButton);
    BimInfoPopup.appendChild(BimInfoContentContainer);

    BimInfoPopupContainer.appendChild(BimInfoOverlay);
    BimInfoPopupContainer.appendChild(BimInfoPopup);
};
