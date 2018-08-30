import { getScreenTranslation } from './utils';
import Listeners from './listeners';


function Select({
    scene, camera, buildingDatas, canvas, ViewerOptions, renderer, modulesObject,
}) {
    const mouse = {};

    // This are stored datas of selected Object, and previously selected Object
    const objSel = {
        ifc_tag: 'none',
        ifc_name: 'none',
        obj: null,
        old_material: null,
        sphere: null,
        div: null,
    };

    // Fetch the right Viewer Options
    const SelectOptions = ViewerOptions.Modules.Select;

    const raycaster = new THREE.Raycaster();

    // Initialize event listeners
    Listeners({
        scene,
        camera,
        buildingDatas,
        canvas,
        mouse,
        ViewerOptions,
        raycaster,
        objSel,
        SelectOptions,
        renderer,
        modulesObject,
    });

    // LIFECYCLE OF MODULE

    this.destroy = () => {
        // scene.remove(objSel.sphere);
    };

    this.update = () => {
        if (objSel.sphere && objSel.div) {
            const pos = getScreenTranslation(objSel.sphere, camera, canvas);
            // ObjSel.div is 'three-selection-menu'
            objSel.div.style.left = `${pos.x + 16}px`;
            objSel.div.style.top = `${pos.y - 48}px`;
        }
    };
}

export default Select;
