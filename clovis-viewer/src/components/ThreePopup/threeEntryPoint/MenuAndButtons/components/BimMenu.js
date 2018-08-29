import { addEventListeners } from '../utils';

const createToggleMenuButton = (ButtonsContainer, getBuildingDatas) => {
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
            toggleViewerMenu();
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

function toggleViewerMenu(MenuContainer) {
    const PopupViewer = document.getElementById('popup-viewer');

    if (PopupViewer.classList.contains('popup-viewer_menu-open')) {
        PopupViewer.classList.remove('popup-viewer_menu-open');
        MenuContainer.innerHTML = '';
    } else {
        PopupViewer.classList.add('popup-viewer_menu-open');
    }
}

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
            toggleViewerMenu(MenuContainer);
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

    // Toggle the removed tags
    const toggleTag = (TagElement, the_category, type) => {
        const tag_uuid = the_category.uuid;

        // Update the arrays of selected and removed tags
        const removedTags = getRemovedTags();
        const selectedTags = getSelectedTags();

        // Update the arrays of selected and removed tags
        // Update the css class of selected tag
        switch (type) {
        case 'select': {
            if (!selectedTags.includes(the_category.uuid)) {
                // Select
                const new_selectedTags = selectedTags;
                new_selectedTags[new_selectedTags.length] = tag_uuid;
                changeSelectedTags(new_selectedTags);
                TagElement.classList.add('tag-element-selected');

                // Remove the "removed" mode if the user selects the element
                if (removedTags.includes(the_category.uuid)) {
                    // Show
                    const new_removedTags = removedTags.filter(tag => tag !== tag_uuid);
                    changeRemovedTags(new_removedTags);
                    TagElement.classList.remove('tag-element-removed');
                }
            } else {
                // Unselect
                const new_selectedTags = selectedTags.filter(tag => tag !== tag_uuid);
                changeSelectedTags(new_selectedTags);
                TagElement.classList.remove('tag-element-selected');
            }
            break;
        }
        case 'remove':
            if (!removedTags.includes(the_category.uuid)) {
                // Remove
                const new_removedTags = removedTags;
                new_removedTags[new_removedTags.length] = tag_uuid;
                changeRemovedTags(new_removedTags);
                TagElement.classList.add('tag-element-removed');

                // Remove the "selected" mode if the user removes the element
                if (selectedTags.includes(the_category.uuid)) {
                    // Show
                    const new_selectedTags = selectedTags.filter(tag => tag !== tag_uuid);
                    changeSelectedTags(new_selectedTags);
                    TagElement.classList.remove('tag-element-selected');
                }
            } else {
                // Show
                const new_removedTags = removedTags.filter(tag => tag !== tag_uuid);
                changeRemovedTags(new_removedTags);
                TagElement.classList.remove('tag-element-removed');
            }
            break;
        default:
            break;
        }

        const updateRemovedTags = () => {
            building_ifc_categories.forEach((category) => {
                if (removedTagsUpdated.includes(category.uuid)) {
                    // Remove all tags children
                    category.visible = false;
                    category.children.forEach((obj) => {
                        obj.visible = false;
                    });
                } else {
                    // Else hide of the element inside (because it's not selected)
                    category.visible = true;
                    category.children.forEach((obj) => {
                        obj.visible = true;
                    });
                }
            });
        };


        const updateSelectedTags = () => {
            const arrayOfUnselectedObjects = [];

            const modificationKey = Math.floor(Math.random() * 1000000);

            building_ifc_categories.forEach((category) => {
                if (selectedTagsUpdated.includes(category.uuid)) {
                    // If the current category tag is selected
                    // show all the elements inside it
                    category.visible = true;

                    const makeDeepChildrenVisible = (categoryChildren) => {
                        categoryChildren.forEach((obj) => {
                            obj.visible = true;
                            obj.modificationKey = modificationKey;
                            arrayOfUnselectedObjects.push(obj);

                            if (obj.children.length > 0) {
                                makeDeepChildrenVisible(obj.children);
                            }
                        });
                    };

                    makeDeepChildrenVisible(category.children);
                } else {
                    // Else hide all the elements inside (because it's not selected)
                    category.visible = false;

                    const makeDeepChildrenInvisible = (categoryChildren) => {
                        categoryChildren.forEach((obj) => {
                            if (_.intersection(selectedTagsUpdated, obj.categories).length === 0 && obj.modificationKey !== modificationKey) {
                                obj.visible = false;
                                obj.modificationKey = modificationKey;
                            }

                            if (obj.children.length > 0) {
                                makeDeepChildrenInvisible(obj.children);
                            }
                        });
                    };
                    makeDeepChildrenInvisible(category.children);
                }
            });
        };

        const showAllTags = () => {
            building_ifc_categories.forEach((category) => {
                category.visible = true;
                category.children.forEach((obj) => {
                    obj.visible = true;
                });
            });
        };

        // Update the Array of 3D Objects
        // If at least one element is selected, avoid Removing Mode
        const selectedTagsUpdated = getSelectedTags();
        const removedTagsUpdated = getRemovedTags();

        if (selectedTagsUpdated.length > 0) {
            updateSelectedTags();
        } else if (removedTagsUpdated.length > 0) {
            updateRemovedTags();
        } else {
            showAllTags();
        }
    };

    // JUST Create the html elements of the if categories
    if (typeof building_ifc_categories !== 'undefined') {
        for (let i = sortedIfcCategories.length - 1; i >= 0; i -= 1) {
            const category = sortedIfcCategories[i];
            const ifc_tag = category.name;

            const TagControls = document.createElement('div');
            TagControls.className = 'tag-controls';

            const TagControlSelect = document.createElement('div');
            TagControlSelect.className = 'tag-control select-control';
            TagControlSelect.innerHTML = '·';
            const TagControlRemove = document.createElement('div');
            TagControlRemove.className = 'tag-control remove-control';
            TagControlRemove.innerHTML = '-';

            TagControls.appendChild(TagControlSelect);
            TagControls.appendChild(TagControlRemove);

            const TagName = document.createElement('div');
            TagName.className = 'tag-name';
            TagName.innerHTML = ifc_tag.substring(3);

            const TagElement = document.createElement('div');
            TagElement.className = 'three-menu_section-element tag-element';
            if (getRemovedTags().length > 0 && sortedIfcCategories[i].visible === false) {
                TagElement.classList.add('tag-element-removed');
            }
            if (getSelectedTags().length > 0 && sortedIfcCategories[i].visible === true) {
                TagElement.classList.add('tag-element-selected');
            }


            TagElement.appendChild(TagControls);
            TagElement.appendChild(TagName);

            // Don't trigger the action if the user is scrolling with touch
            let mouseMoved = false;
            addEventListeners(document, 'mousedown touchstart', () => { mouseMoved = false; });
            addEventListeners(document, 'mousemove touchmove', () => { mouseMoved = true; });
            addEventListeners(
                TagControlRemove,
                'mouseup touchend',
                (event) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    if (mouseMoved === false) {
                        toggleTag(TagElement, category, 'remove');
                    }
                },
            );
            addEventListeners(
                TagControlSelect,
                'mouseup touchend',
                (event) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    if (mouseMoved === false) {
                        toggleTag(TagElement, category, 'select');
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


export default createToggleMenuButton;