import Controllers from '../Controllers';

export const MenuToggle = () => {
    console.log('MenuToggle');

    if (typeof document.getElementById('three-clovis-menu') !== 'undefined') {
        if (document.getElementById('three-clovis-menu').style.display === 'absolute'
            || document.getElementById('stats-container').style.display === ''
        ) {
            document.getElementById('stats-container').style.display = 'none';
        } else {
            document.getElementById('stats-container').style.display = 'absolute';
        }
    }
};

export const createToggleMenuButton = (ButtonsContainer) => {
    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = 'Ξ';

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Menu';

    const ToggleMenuButton = document.createElement('div');
    ToggleMenuButton.className = 'three-clovis-buttons_menu';
    ToggleMenuButton.appendChild(InnerButton);
    ToggleMenuButton.onclick = () => {
        Controllers.toggleViewerMenu();
    };
    ToggleMenuButton.addEventListener('touchstart', () => {
        Controllers.toggleViewerMenu();
    }, false);

    ButtonsContainer
        .appendChild(ToggleMenuButton)
        .appendChild(InfoBar);
};

export const createToggleExplosionButton = (ButtonsContainer, getBuildingDatas) => {
    const floorsExploded = {
        exploded: false,
    };

    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = '✧';

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Explosion';

    const ToggleExplosionButton = document.createElement('div');
    ToggleExplosionButton.className = 'three-clovis-buttons_explosion';
    ToggleExplosionButton.appendChild(InnerButton);
    ToggleExplosionButton.onclick = () => {
        Controllers.toggleBuildingExplosion(floorsExploded, getBuildingDatas);
    };
    ToggleExplosionButton.addEventListener('touchstart', () => {
        Controllers.toggleBuildingExplosion(floorsExploded, getBuildingDatas);
    }, false);

    ButtonsContainer
        .appendChild(ToggleExplosionButton)
        .appendChild(InfoBar);
};

export const createHorizontalSectionButton = (ButtonsContainer) => {
    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = '⇔';

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Coupe Horizontale';

    const HorizontalSectionButton = document.createElement('div');
    HorizontalSectionButton.className = 'three-clovis-buttons_horizontal-section';
    HorizontalSectionButton.appendChild(InnerButton);

    // Easter Egg / Let the devtools appear holding the CrossSectionButton
    let timeout_id = 0;
    const hold_time = 2000;
    HorizontalSectionButton.ontouchstart = () => {
        timeout_id = setTimeout(Controllers.toggleDevTools, hold_time);
    };
    HorizontalSectionButton.ontouchend = () => {
        clearTimeout(timeout_id);
    };

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


// MENU CONTENT STUFF

export const createCloseButton = (MenuContainer) => {
    const closeButton = document.createElement('div');
    closeButton.className = 'three-menu_close-button';
    closeButton.innerHTML = '↤';
    closeButton.onclick = () => {
        Controllers.toggleViewerMenu();
    };
    closeButton.addEventListener('touchstart', () => {
        Controllers.toggleViewerMenu();
    }, false);

    MenuContainer
        .appendChild(closeButton);
};
