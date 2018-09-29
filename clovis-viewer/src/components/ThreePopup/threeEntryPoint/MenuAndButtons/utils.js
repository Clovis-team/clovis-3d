/**
 * To find ASCII symbols
 * https://azuliadesigns.com/html-character-codes-ascii-entity-unicode-symbols/
 */

// Dices : ⚀ ⚁ ⚂ ⚃ ⚄ ⚅


import _ from 'lodash';
import Controllers from '../Controllers';

export const addEventListeners = (targetElement, eventsString, triggeredFunction) => {
    eventsString.split(' ').forEach(event => targetElement.addEventListener(event, triggeredFunction, false));
};

export const createToggleExplosionButton = (ButtonsContainer, { HorizontalSection, Explosion }) => {
    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = '✧';

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Magic Gravity';

    const ToggleExplosionButton = document.createElement('div');
    ToggleExplosionButton.className = 'three-clovis-buttons_explosion';
    ToggleExplosionButton.id = 'three-clovis-buttons_explosion';
    ToggleExplosionButton.appendChild(InnerButton);

    const horizontalSectionMessage = document.createElement('div');
    horizontalSectionMessage.className = 'horizontal-section-message';
    horizontalSectionMessage.innerHTML = 'Déplacer le plan pour positionner la coupe';

    const toggleExplosionButton = () => {
        if (ButtonsContainer.classList.contains('explosion-is-on')) {
            Explosion.destroy();
        } else {
            Explosion.start();
            if (ButtonsContainer.classList.contains('horizontal-section-is-on')) {
                HorizontalSection.destroy();
            }
        }
    };

    addEventListeners(
        ToggleExplosionButton,
        'click touchend',
        (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            toggleExplosionButton();
        },
    );


    ButtonsContainer
        .appendChild(ToggleExplosionButton)
        .appendChild(InfoBar);

    ButtonsContainer
        .appendChild(horizontalSectionMessage);
};

export const createHorizontalSectionButton = (ButtonsContainer, { HorizontalSection, Explosion }) => {
    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = '⇔';

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Coupe Horizontale';

    const HorizontalSectionButton = document.createElement('div');
    HorizontalSectionButton.className = 'three-clovis-buttons_horizontal-section';
    HorizontalSectionButton.id = 'three-clovis-buttons_horizontal-section';
    HorizontalSectionButton.appendChild(InnerButton);


    const toggleHorizontalCutButton = () => {
        if (ButtonsContainer.classList.contains('horizontal-section-is-on')) {
            HorizontalSection.destroy();
        } else {
            HorizontalSection.start();
            if (ButtonsContainer.classList.contains('explosion-is-on')) {
                Explosion.destroy();
            }
        }
    };

    // This includes and Easter Egg / Let the devtools appear holding the CrossSectionButton
    // let timeout_id = 0;
    // const hold_time = 1500;
    // addEventListeners(
    //     HorizontalSectionButton,
    //     'touchstart mousedown',
    //     () => {
    //         timeout_id = setTimeout(Controllers.toggleDevTools, hold_time);
    //     },
    // );
    addEventListeners(
        HorizontalSectionButton,
        'click touchend',
        (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            toggleHorizontalCutButton();
        },
    );


    ButtonsContainer
        .appendChild(HorizontalSectionButton)
        .appendChild(InfoBar);
};

export const createCrossSectionButton = (ButtonsContainer) => {
    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = '⇕';

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Coupe Verticale';

    const CrossSectionButton = document.createElement('div');
    CrossSectionButton.className = 'three-clovis-buttons_cross-section';
    CrossSectionButton.appendChild(InnerButton);

    ButtonsContainer
        .appendChild(CrossSectionButton)
        .appendChild(InfoBar);
};


export const createHelpButton = (ButtonsContainer) => {
    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = '✰';

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Tips';

    const HelpButton = document.createElement('div');
    HelpButton.className = 'three-clovis-buttons_help';
    HelpButton.appendChild(InnerButton);
    addEventListeners(
        HelpButton,
        'click touchend',
        (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            createHelpPopup();
        },
    );

    ButtonsContainer
        .appendChild(HelpButton)
        .appendChild(InfoBar);
};

const HelpPopupContent = (HelpPopupContentContainer) => {
    const HelpTitle = document.createElement('div');
    HelpTitle.className = 'three-clovis-buttons_help-title';
    HelpTitle.innerHTML = '✰ Tips & Tricks ✰';

    const Help1Element = document.createElement('div');
    Help1Element.className = 'three-clovis-buttons_help-element';
    Help1Element.innerHTML = '<p>1<br/><br/>Zoomer sur le bâtiment pour activer le mode "première personne"</p>';

    const Help2Element = document.createElement('div');
    Help2Element.className = 'three-clovis-buttons_help-element';
    Help2Element.innerHTML = '<p>2<br/><br/>Utilisez E ⇧ - D ⇩ - S ⇦ - F ⇨ - T ⇑ - G ⇓ pour vous diriger</p>';


    HelpPopupContentContainer.appendChild(HelpTitle);
    HelpPopupContentContainer.appendChild(Help1Element);
    HelpPopupContentContainer.appendChild(Help2Element);
};

const createHelpPopup = () => {
    const HelpPopupContainer = document.getElementById('three-popup-container');
    HelpPopupContainer.classList.add('three-help-popup-container');
    HelpPopupContainer.classList.add('three-show-popup');

    const closeHelpPopup = () => {
        HelpPopupContainer.innerHTML = '';
        HelpPopupContainer.classList.remove('three-show-popup');
    };

    const ClosePopupButton = document.createElement('div');
    ClosePopupButton.className = 'three-clovis-popup_close-button';
    ClosePopupButton.innerHTML = '✕';
    addEventListeners(
        ClosePopupButton,
        'click touchend',
        (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            closeHelpPopup();
        },
    );

    const HelpPopupContentContainer = document.createElement('div');
    HelpPopupContentContainer.className = 'three-clovis-popup_content-container';

    HelpPopupContent(HelpPopupContentContainer);

    const HelpPopup = document.createElement('div');
    HelpPopup.className = 'three-clovis_popup';

    const HelpOverlay = document.createElement('div');
    HelpOverlay.className = 'three-clovis-popup_overlay';
    addEventListeners(
        HelpOverlay,
        'mousedown touchend',
        (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            closeHelpPopup();
        },
    );

    HelpPopup.appendChild(ClosePopupButton);
    HelpPopup.appendChild(HelpPopupContentContainer);

    HelpPopupContainer.appendChild(HelpOverlay);
    HelpPopupContainer.appendChild(HelpPopup);
};
