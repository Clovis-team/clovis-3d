/**
 * To find ASCII symbols
 * https://azuliadesigns.com/html-character-codes-ascii-entity-unicode-symbols/
 */

import _ from 'lodash';
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
    ToggleMenuButton.onclick = () => {
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
    };
    ToggleMenuButton.addEventListener('touchstart', () => {
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
    InfoBar.innerHTML = 'Magic Gravity';

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


export const createHelpButton = (ButtonsContainer) => {
    const InnerButton = document.createElement('div');
    InnerButton.innerHTML = '⚁';

    const InfoBar = document.createElement('div');
    InfoBar.className = 'three-clovis-buttons_info-bar';
    InfoBar.innerHTML = 'Tips';

    const HelpButton = document.createElement('div');
    HelpButton.className = 'three-clovis-buttons_help';
    HelpButton.appendChild(InnerButton);
    HelpButton.onclick = () => {
        createHelpPopup();
    };
    HelpButton.addEventListener('touchstart', () => {
        createHelpPopup();
    }, false);

    ButtonsContainer
        .appendChild(HelpButton)
        .appendChild(InfoBar);
};

const HelpPopupContent = (HelpPopupContentContainer) => {
    const HelpTitle = document.createElement('div');
    HelpTitle.className = 'three-clovis-buttons_help-title';
    HelpTitle.innerHTML = '✰ Tips & Tricks ✰';

    HelpPopupContentContainer.appendChild(HelpTitle);
};

const createHelpPopup = () => {
    const HelpPopupContainer = document.getElementById('three-help-popup-container');

    const closeHelpPopup = () => {
        HelpPopupContainer.innerHTML = '';
    };

    const ClosePopupButton = document.createElement('div');
    ClosePopupButton.className = 'three-clovis-help_close-button';
    ClosePopupButton.innerHTML = '✕';
    ClosePopupButton.onclick = () => {
        closeHelpPopup();
    };
    ClosePopupButton.addEventListener('touchstart', () => {
        closeHelpPopup();
    }, false);

    const HelpPopupContentContainer = document.createElement('div');
    HelpPopupContentContainer.className = 'three-clovis-help_content-container';

    HelpPopupContent(HelpPopupContentContainer);

    const HelpPopup = document.createElement('div');
    HelpPopup.className = 'three-clovis-help_popup';

    const HelpOverlay = document.createElement('div');
    HelpOverlay.className = 'three-clovis-help_overlay';
    HelpOverlay.onclick = () => {
        closeHelpPopup();
    };
    HelpOverlay.addEventListener('touchstart', () => {
        closeHelpPopup();
    }, false);

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
    closeButton.onclick = () => {
        Controllers.toggleViewerMenu(MenuContainer);
    };
    closeButton.addEventListener('touchstart', () => {
        Controllers.toggleViewerMenu(MenuContainer);
    }, false);

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
    SectionTitle.innerHTML = 'Étages';

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

            FloorElement.onclick = () => {
                toggleFloorElement(FloorElement, floors[i].uuid);
            };
            FloorElement.addEventListener('touchstart', () => {
                toggleFloorElement(FloorElement, floors[i].uuid);
            }, false);

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
    SectionTitle.innerHTML = 'Catégories BIM';

    const SectionElements = document.createElement('div');
    SectionElements.className = 'three-menu_section-elements';

    const toggleSelectTag = (TagElement, tag_uuid) => {
        //

        const updateTags = () => {
            const selectedTags = getSelectedTags();
            console.log('tag_uuid :', tag_uuid);
            console.log('selectedTags :', selectedTags);

            // if (category.visible_order !== category.visible) {
            //     category.children.forEach((obj_no) => {
            //         const obj = obj_no;
            //         obj.visible = category.visible_order;
            //     });
            //     category.visible = category.visible_order;
            // }

            building_ifc_categories.forEach((category) => {
                console.log('category :', category);

                if (selectedTags.length > 0) {
                    if (selectedTags.includes(category.uuid)) {
                        category.visible = true;
                        category.children.forEach((obj) => {
                            obj.visible = true;
                        });
                    } else {
                        category.visible = false;
                        category.children.forEach((obj) => {
                            obj.visible = false;
                        });
                    }
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

            updateTags();
            TagElement.classList.remove('tag-element-selected');
        } else {
            // Select
            const selectedTags = getSelectedTags();
            const new_selectedTags = selectedTags;
            new_selectedTags[new_selectedTags.length] = tag_uuid;
            changeSelectedTags(new_selectedTags);

            updateTags();

            TagElement.classList.add('tag-element-selected');
        }

        console.log('Final selected tags :', getSelectedTags());
        console.log('Final building datas :', getBuildingDatas());
    };


    console.log('building_ifc_categories :', building_ifc_categories);

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

            TagControls.appendChild(TagControlSelect);
            TagControls.appendChild(TagControlRemove);

            const TagName = document.createElement('div');
            TagName.className = 'tag-name';
            TagName.innerHTML = ifc_tag.substring(3);

            const TagElement = document.createElement('div');
            TagElement.className = 'three-menu_section-element tag-element';
            if (getSelectedTags().length > 0 && sortedIfcCategories[i].visible === true) {
                TagElement.classList.add('floor-element-selected');
            }


            TagElement.appendChild(TagControls);
            TagElement.appendChild(TagName);

            TagElement.onclick = () => {
                toggleSelectTag(TagElement, category.uuid);
            };
            TagElement.addEventListener('touchstart', () => {
                toggleSelectTag(TagElement, category.uuid);
            }, false);

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
