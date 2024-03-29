import get from 'lodash/get';

// eslint-disable-next-line import/prefer-default-export
export const get_building = (scene) => {
    const building = get(scene, 'children[0].children[0].children[0].children[0]');
    if (building === undefined) {
        throw new Error('cannot reach building');
    }
    return building;
};


export const get_building_ifc_elements = (building) => {
    // TODO: look into using recursive raytracing for click event and walking
    // so we can maybe generate a shorter list of all objects.
    // mesh all, or maybe not even generate it at all.

    const building_ifc_elements = [];
    const mesh_all = [];

    building.traverse((node) => {
        if ((node instanceof THREE.Mesh || node instanceof THREE.Object3D) && node.name !== '') {
            mesh_all.push(node);

            const ifc_tag = node.name.split('_')[0];
            node.ifc_tag = ifc_tag;
            const ifc_name = node.name.split('_')[1];
            node.ifc_name = ifc_name;

            if (ifc_tag !== '' && ifc_tag.charAt(0) !== '$' && ifc_tag !== 'mesh' && ifc_tag !== 'IfcBuildingStorey') {
                if (!building_ifc_elements.some(obj => obj.ifc_tag === ifc_tag)) {
                    const ifc_building_element = new THREE.Object3D();

                    ifc_building_element.ifc_tag = ifc_tag;
                    ifc_building_element.name = ifc_tag;
                    ifc_building_element.ifc_name = ifc_name;
                    ifc_building_element.visible_order = true;
                    ifc_building_element.children.push(node);
                    addCategoryUuid(node, ifc_building_element);

                    building_ifc_elements.push(ifc_building_element);
                } else {
                    const ifc_building_element = building_ifc_elements.find(
                        obj => obj.ifc_tag === ifc_tag,
                    );
                    addCategoryUuid(node, ifc_building_element);
                    ifc_building_element.children.push(node);
                }
            }
        }
    });


    return {
        building_ifc_elements,
        mesh_all,
    };
};

function addCategoryUuid(node, { uuid }) {
    if (!node.categories) {
        node.categories = [uuid];
        if (node.parent.categories) {
            node.categories.push(...node.parent.categories);
        }
    } else {
        node.categories.push(uuid);
    }
}

export function initializeViewerHtmlContainers() {
    // Create main html containers
    const ClovisViewerContainer = document.getElementById('clovis-viewer-container');

    const ProgressContainer = document.createElement('div');
    ProgressContainer.id = 'three-progress-container';
    ProgressContainer.className = 'three-progress-container loading';
    const ProgressLoader = document.createElement('div');
    ProgressLoader.id = 'three-loader';
    ProgressLoader.className = 'three-loader loading';
    const LoaderSpinner = document.createElement('div');
    LoaderSpinner.className = 'three-loader-spinner';
    ProgressLoader.appendChild(LoaderSpinner);
    ProgressContainer.appendChild(ProgressLoader);
    const ProgressText = document.createElement('div');
    ProgressText.id = 'three-progress-text';
    ProgressText.className = 'three-progress-text';
    ProgressText.innerHTML = 'Chargement';
    ProgressContainer.appendChild(ProgressText);
    ClovisViewerContainer.appendChild(ProgressContainer);

    const ButtonsContainer = document.createElement('div');
    ButtonsContainer.id = 'three-clovis-buttons-container';
    ButtonsContainer.className = 'three-clovis-buttons-container';
    ClovisViewerContainer.appendChild(ButtonsContainer);

    const MenuContainer = document.createElement('div');
    MenuContainer.id = 'three-clovis-menu-container';
    MenuContainer.className = 'three-clovis-menu-container';
    ClovisViewerContainer.appendChild(MenuContainer);

    const HelpPopupContainer = document.createElement('div');
    HelpPopupContainer.id = 'three-popup-container';
    HelpPopupContainer.className = 'three-popup-container';
    ClovisViewerContainer.appendChild(HelpPopupContainer);
}
