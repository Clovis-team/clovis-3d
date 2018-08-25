import { createSelectionMenu, addSphereOnHitPoint } from './components';
import {
    getScreenTranslation,
    getHitPoint,
    closeSelectionMenuButton,
    removeSelectionMenu,
    colorElement,
} from './utils';

function UserSelection({
    hitPoint, objSel, canvas, scene, camera, SelectOptions,
}) {
    closeSelectionMenuButton();

    if (hitPoint) {
        if (!objSel.div) {
            objSel.div = createSelectionMenu({ SelectOptions, hitPoint });
        }
        colorElement(hitPoint, objSel);
        if (objSel.sphere) {
            scene.remove(objSel.sphere);
        }
        objSel.sphere = addSphereOnHitPoint(hitPoint, scene);
        const pos = getScreenTranslation(objSel.sphere, camera, canvas);
    } else {
        // Remove all the stuff is the user doesn't select an element
        scene.remove(objSel.sphere);
        removeSelectionMenu(objSel);
        colorElement(null, objSel);
    }
}

// Click controller
export function onDocumentMouseClick({
    event, mouse, canvas, camera, scene, buildingDatas, raycaster, objSel, SelectOptions,
}) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hitPoint = getHitPoint(raycaster, buildingDatas);

    UserSelection({
        hitPoint, objSel, canvas, scene, camera, SelectOptions,
    });
}

// Touch controller
export function onDocumentTouchEnd({
    event, mouse, canvas, camera, scene, buildingDatas, raycaster, objSel, SelectOptions,
}) {
    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hitPoint = getHitPoint(raycaster, buildingDatas);

    UserSelection({
        hitPoint, objSel, canvas, scene, camera, SelectOptions,
    });
}

// Manage the cursor change when the user hovers an object
export function ChangeCursorOnHover({
    event, mouse, raycaster, buildingDatas, camera,
}) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hitPoint = getHitPoint(raycaster, buildingDatas);
    if (hitPoint) {
        document.body.style.cursor = 'cell';
        // Uncomment if we want to color element on hover
        // TODO: make a fading effect on hover like this viewer : https://viewer-rocks.autodesk.io/
        // colorElement(hitPoint, objSel);
    } else {
        document.body.style.cursor = 'default';
    }
}
