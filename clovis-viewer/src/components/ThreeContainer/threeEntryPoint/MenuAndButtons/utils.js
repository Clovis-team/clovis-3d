/**
 * To find ASCII symbols
 * https://azuliadesigns.com/html-character-codes-ascii-entity-unicode-symbols/
 */

// Dices : ⚀ ⚁ ⚂ ⚃ ⚄ ⚅


import _ from 'lodash';
import Controllers from '../Controllers';

const addEventListeners = (targetElement, eventsString, triggeredFunction) => {
    eventsString.split(' ').forEach(event => targetElement.addEventListener(event, triggeredFunction, false));
};

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


export const createToggleMenuButton = (ButtonsContainer, getBuildingDatas) => {
    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = '☰';
    let selectedFloors = [];
    let selectedTags = [];
    let removedTags = [];

    const getSelectedFloors = () => selectedFloors;
    const changeSelectedFloors = (new_selectedFloors) => {
        selectedFloors = new_selectedFloors;
    };
    const getSelectedTags = () => selectedTags;
    const changeSelectedTags = (new_selectedtags) => {
        selectedTags = new_selectedtags;
    };
    const getRemovedTags = () => removedTags;
    const changeRemovedTags = (new_removedTags) => {
        removedTags = new_removedTags;
    };

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Menu BIM';

    const ToggleMenuButton = document.createElement('div');
    ToggleMenuButton.className = 'three-clovis-buttons_menu';
    ToggleMenuButton.appendChild(InnerButton);
    addEventListeners(
        ToggleMenuButton,
        'click touchend',
        () => {
            Controllers.toggleViewerMenu();
            createMenu(
                getBuildingDatas,
                getSelectedFloors,
                changeSelectedFloors,
                getSelectedTags,
                changeSelectedTags,
                getRemovedTags,
                changeRemovedTags,
            );
        },
    );

    ButtonsContainer
        .appendChild(ToggleMenuButton)
        .appendChild(InfoBar);
};

export const createToggleExplosionButton = (ButtonsContainer, { cut, explosion }) => {
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
            explosion.destroy();
        } else {
            explosion.start();
            if (ButtonsContainer.classList.contains('horizontal-section-is-on')) {
                cut.destroy();
            }
        }
    };

    ToggleExplosionButton.addEventListener('click', () => {
        toggleExplosionButton();
    });

    ButtonsContainer
        .appendChild(ToggleExplosionButton)
        .appendChild(InfoBar);

    ButtonsContainer
        .appendChild(horizontalSectionMessage);
};

export const createHorizontalSectionButton = (ButtonsContainer, { cut, explosion }) => {
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
            cut.destroy();
        } else {
            cut.start();
            if (ButtonsContainer.classList.contains('explosion-is-on')) {
                explosion.destroy();
            }
        }
    };

    // This includes and Easter Egg / Let the devtools appear holding the CrossSectionButton
    let timeout_id = 0;
    const hold_time = 1500;
    addEventListeners(
        HorizontalSectionButton,
        'touchstart mousedown',
        () => {
            timeout_id = setTimeout(Controllers.toggleDevTools, hold_time);
        },
    );
    addEventListeners(
        HorizontalSectionButton,
        'mouseup touchend',
        () => {
            toggleHorizontalCutButton();
            clearTimeout(timeout_id);
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
        () => {
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
    const HelpPopupContainer = document.getElementById('three-help-popup-container');

    const closeHelpPopup = () => {
        HelpPopupContainer.innerHTML = '';
    };

    const ClosePopupButton = document.createElement('div');
    ClosePopupButton.className = 'three-clovis-help_close-button';
    ClosePopupButton.innerHTML = '✕';
    addEventListeners(
        ClosePopupButton,
        'click touchend',
        () => {
            closeHelpPopup();
        },
    );

    const HelpPopupContentContainer = document.createElement('div');
    HelpPopupContentContainer.className = 'three-clovis-help_content-container';

    HelpPopupContent(HelpPopupContentContainer);

    const HelpPopup = document.createElement('div');
    HelpPopup.className = 'three-clovis-help_popup';

    const HelpOverlay = document.createElement('div');
    HelpOverlay.className = 'three-clovis-help_overlay';
    addEventListeners(
        HelpOverlay,
        'mousedown touchend',
        () => {
            closeHelpPopup();
        },
    );

    HelpPopup.appendChild(ClosePopupButton);
    HelpPopup.appendChild(HelpPopupContentContainer);

    HelpPopupContainer.appendChild(HelpOverlay);
    HelpPopupContainer.appendChild(HelpPopup);
};


// MENU CONTENT STUFF

const createMenu = (
    getBuildingDatas,
    getSelectedFloors,
    changeSelectedFloors,
    getSelectedTags,
    changeSelectedTags,
    getRemovedTags,
    changeRemovedTags,
) => {
    const MenuContainer = document.getElementById('three-clovis-menu-container');

    createCloseButton(MenuContainer);

    const MenuContent = document.createElement('div');
    MenuContent.className = 'three-menu_menu-content';

    createFloorsSelectionSection(
        MenuContent,
        getBuildingDatas,
        getSelectedFloors,
        changeSelectedFloors,
    );

    createTagsSelectionSection(
        MenuContent,
        getBuildingDatas,
        getSelectedTags,
        changeSelectedTags,
        getRemovedTags,
        changeRemovedTags,
    );

    MenuContainer
        .appendChild(MenuContent);
};

export const createCloseButton = (MenuContainer) => {
    const closeButton = document.createElement('div');
    closeButton.className = 'three-menu_close-button';
    closeButton.innerHTML = '↤';
    closeButton.addEventListener('mousedown', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
    });
    addEventListeners(
        closeButton,
        'mouseup touchend',
        (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            Controllers.toggleViewerMenu(MenuContainer);
        },
    );

    MenuContainer
        .appendChild(closeButton);
};


const createFloorsSelectionSection = (
    MenuContent,
    getBuildingDatas,
    getSelectedFloors,
    changeSelectedFloors,
) => {
    const buildingDatas = getBuildingDatas();

    const { floors } = buildingDatas;

    const SectionContent = document.createElement('div');
    SectionContent.className = 'three-menu_section-content floors-section';
    SectionContent.id = 'floors-section';


    const SectionTitle = document.createElement('div');
    SectionTitle.className = 'three-menu_section-title';
    SectionTitle.innerHTML = 'Sélectionner des étages';

    const SectionElements = document.createElement('div');
    SectionElements.className = 'three-menu_section-elements';

    const toggleFloorElement = (FloorElement, floor_uuid) => {
        const floorElementText = FloorElement.innerHTML;

        const updateFloors = () => {
            const selectedFloors = getSelectedFloors();

            floors.forEach((floor) => {
                if (selectedFloors.length > 0) {
                    if (selectedFloors.includes(floor.uuid)) {
                        floor.visible = true;
                    } else {
                        floor.visible = false;
                    }
                } else {
                    floor.visible = true;
                }
            });
        };

        if (FloorElement.classList.contains('floor-element-selected')) {
            // Unselect
            const selectedFloors = getSelectedFloors();
            const new_selectedFloors = selectedFloors.filter(floor => floor !== floor_uuid);
            changeSelectedFloors(new_selectedFloors);

            updateFloors();
            FloorElement.classList.remove('floor-element-selected');
            FloorElement.innerHTML = floorElementText.replace('◉', '◎');
        } else {
            // Select
            const selectedFloors = getSelectedFloors();
            const new_selectedFloors = selectedFloors;
            new_selectedFloors[new_selectedFloors.length] = floor_uuid;
            changeSelectedFloors(new_selectedFloors);

            updateFloors();

            FloorElement.classList.add('floor-element-selected');
            FloorElement.innerHTML = floorElementText.replace('◎', '◉');
        }
    };

    if (typeof floors !== 'undefined') {
        for (let i = floors.length - 1; i >= 0; i -= 1) {
            const floor_name = floors[i].name.split('_')[1];

            const FloorElement = document.createElement('div');
            FloorElement.className = 'three-menu_section-element floor-element';
            FloorElement.innerHTML = `◎  ${floor_name}`;

            if (getSelectedFloors().length > 0 && floors[i].visible === true) {
                FloorElement.classList.add('floor-element-selected');
            }


            // Don't trigger the action if the user is scrolling with touch
            let mouseMoved = false;
            addEventListeners(document, 'mousedown touchstart', () => { mouseMoved = false; });
            addEventListeners(document, 'mousemove touchmove', () => { mouseMoved = true; });
            addEventListeners(
                FloorElement,
                'mouseup touchend',
                (event) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    if (mouseMoved === false) {
                        toggleFloorElement(FloorElement, floors[i].uuid);
                    }
                },
            );

            SectionElements.appendChild(FloorElement);

            // gui_floor_folder.add(floors[i], 'visible').name(floor_name);
        }
    } else {
        SectionElements.innerHTML = `
            Nous ne pouvons pas récupérer les différents étages, vérifier que 
            votre fichier ifc intègre bien ces données.
        `;
    }

    SectionContent.appendChild(SectionTitle);
    SectionContent.appendChild(SectionElements);

    MenuContent
        .appendChild(SectionContent);
};


const createTagsSelectionSection = (
    MenuContent,
    getBuildingDatas,
    getSelectedTags,
    changeSelectedTags,
    getRemovedTags,
    changeRemovedTags,
) => {
    const buildingDatas = getBuildingDatas();

    const building_ifc_categories = buildingDatas.building_ifc_elements;

    const sortedIfcCategories = _.sortBy(building_ifc_categories, 'name').reverse();

    const SectionContent = document.createElement('div');
    SectionContent.className = 'three-menu_section-content tags-section';
    SectionContent.id = 'tags-section';


    const SectionTitle = document.createElement('div');
    SectionTitle.className = 'three-menu_section-title';
    SectionTitle.innerHTML = 'Gérer les catégories BIM';

    const SectionElements = document.createElement('div');
    SectionElements.className = 'three-menu_section-elements';

    // WIP, we will use this function later, when the data will be well
    // prepared
    const toggleSelectTag = (TagElement, the_category) => {
        const tag_uuid = the_category.uuid;

        const updateSelectedTags = () => {
            const selectedTags = getSelectedTags();


            building_ifc_categories.forEach((category) => {
                // If at least one tag is selected, go to hide all the other ones
                if (selectedTags.length > 0) {
                    // If the current category tag is the same as one of selected
                    // show all the elements inside it
                    if (selectedTags.includes(category.uuid)) {
                        category.visible = false;
                        category.children.forEach((obj) => {
                            obj.visible = true;
                        });
                        // Else hide of the element inside (because it's not selected)
                    } else {
                        category.visible = false;
                        category.children.forEach((obj) => {
                            // If the object categories don't match the selected ones, hide it
                            if (_.intersection(selectedTags, obj.uuid).length === 0) {
                                obj.visible = false;
                            }
                        });
                    }
                // Else if no tag is selected, show all the building so all
                // the elements of this category
                } else {
                    category.visible = true;
                    category.children.forEach((obj) => {
                        obj.visible = true;
                    });
                }
            });
        };

        if (TagElement.classList.contains('tag-element-selected')) {
            // Unselect
            const selectedTags = getSelectedTags();
            const new_selectedTags = selectedTags.filter(tag => tag !== tag_uuid);
            changeSelectedTags(new_selectedTags);

            updateSelectedTags();
            TagElement.classList.remove('tag-element-selected');
        } else {
            // Select
            const selectedTags = getSelectedTags();
            const new_selectedTags = selectedTags;
            new_selectedTags[new_selectedTags.length] = tag_uuid;
            changeSelectedTags(new_selectedTags);

            updateSelectedTags();

            TagElement.classList.add('tag-element-selected');
        }
    };


    // WIP, we will use this function later, when the data will be well
    // prepared
    const toggleRemovedTag = (TagElement, the_category) => {
        const tag_uuid = the_category.uuid;

        const updateRemovedTags = () => {
            const removedTags = getRemovedTags();

            building_ifc_categories.forEach((category) => {
                // Remove all tags children
                if (removedTags.includes(category.uuid)) {
                    category.visible = false;
                    category.children.forEach((obj) => {
                        obj.visible = false;
                    });
                // Else hide of the element inside (because it's not selected)
                } else {
                    category.visible = true;
                    category.children.forEach((obj) => {
                        obj.visible = true;
                    });
                }
            });
        };

        if (TagElement.classList.contains('tag-element-removed')) {
            // Unselect
            const removedTags = getRemovedTags();
            const new_removedTags = removedTags.filter(tag => tag !== tag_uuid);
            changeRemovedTags(new_removedTags);

            updateRemovedTags();
            TagElement.classList.remove('tag-element-removed');
        } else {
            // Select
            const removedTags = getRemovedTags();
            const new_removedTags = removedTags;
            new_removedTags[new_removedTags.length] = tag_uuid;
            changeRemovedTags(new_removedTags);

            updateRemovedTags();

            TagElement.classList.add('tag-element-removed');
        }
    };

    if (typeof building_ifc_categories !== 'undefined') {
        for (let i = sortedIfcCategories.length - 1; i >= 0; i -= 1) {
            const category = sortedIfcCategories[i];
            const ifc_tag = category.name;

            const TagControls = document.createElement('div');
            TagControls.className = 'tag-controls';

            const TagControlSelect = document.createElement('div');
            TagControlSelect.className = 'tag-control select-control';
            const TagControlRemove = document.createElement('div');
            TagControlRemove.className = 'tag-control remove-control';
            TagControlRemove.innerHTML = '-';

            // WIP : just wait for building data little change from Nicola
            // TagControls.appendChild(TagControlSelect);
            TagControls.appendChild(TagControlRemove);

            const TagName = document.createElement('div');
            TagName.className = 'tag-name';
            TagName.innerHTML = ifc_tag.substring(3);

            const TagElement = document.createElement('div');
            TagElement.className = 'three-menu_section-element tag-element';
            if (getRemovedTags().length > 0 && sortedIfcCategories[i].visible === false) {
                TagElement.classList.add('tag-element-removed');
            }


            TagElement.appendChild(TagControls);
            TagElement.appendChild(TagName);

            // Don't trigger the action if the user is scrolling with touch
            let mouseMoved = false;
            addEventListeners(document, 'mousedown touchstart', () => { mouseMoved = false; });
            addEventListeners(document, 'mousemove touchmove', () => { mouseMoved = true; });
            addEventListeners(
                TagElement,
                'mouseup touchend',
                (event) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    if (mouseMoved === false) {
                        toggleRemovedTag(TagElement, category);
                    }
                },
            );


            SectionElements.appendChild(TagElement);
        }
    } else {
        SectionElements.innerHTML = `
            Nous ne pouvons pas récupérer les différentes catégories IFC, 
            vérifier que votre fichier ifc intègre bien ces données.
        `;
    }

    SectionContent.appendChild(SectionTitle);
    SectionContent.appendChild(SectionElements);

    MenuContent
        .appendChild(SectionContent);
};
