import createSelectionMenu from './components/SelectionMenu/index';
import addSphereOnHitPoint from './components/Sphere';
import {
    getScreenTranslation,
    getHitPoint,
    closeSelectionMenuButton,
    removeSelectionMenu,
    colorElement,
} from './utils';

function UserSelection({
    hitPoint, objSel, canvas, scene, camera, SelectOptions, renderer,
}) {
    closeSelectionMenuButton();

    if (hitPoint) {
        // Color the element
        colorElement(hitPoint, objSel);
        // Remove sphere is existed
        if (objSel.sphere) {
            scene.remove(objSel.sphere);
        }
        objSel.sphere = addSphereOnHitPoint(hitPoint, scene);
        // If the menu doesn't exist, create it
        if (!objSel.div) {
            objSel.div = createSelectionMenu({
                SelectOptions, hitPoint, camera, canvas, renderer,
            });
        }

        const pos = getScreenTranslation(objSel.sphere, camera, canvas);
        objSel.div.style.left = `${pos.x + 16}px`;
        objSel.div.style.top = `${pos.y - 48}px`;
    } else {
        // Remove all the stuff is the user doesn't select an element
        scene.remove(objSel.sphere);
        removeSelectionMenu(objSel);
        colorElement(null, objSel);
    }
}

// Click controller
export function onDocumentMouseClick({
    event, mouse, canvas, camera, scene, buildingDatas, raycaster, objSel, SelectOptions, renderer, modulesObject
}) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hitPoint = getHitPoint(raycaster, buildingDatas, modulesObject);

    UserSelection({
        hitPoint, objSel, canvas, scene, camera, SelectOptions, renderer,
    });
}

// Touch controller
export function onDocumentTouchEnd({
    event, mouse, canvas, camera, scene, buildingDatas, raycaster, objSel, SelectOptions, renderer, modulesObject
}) {
    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hitPoint = getHitPoint(raycaster, buildingDatas, modulesObject);

    console.log("TOUCH!")

    UserSelection({
        hitPoint, objSel, canvas, scene, camera, SelectOptions, renderer,
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
