

function Select(scene, camera, buildingDatas, canvas, addTask) {
    const mouse = {};

    const objSel = {
        ifc_tag: 'none',
        ifc_name: 'none',
        obj: null,
        old_material: null,
        sphere: null,
        div: null,
    };


    const raycaster = new THREE.Raycaster();


    function onDocumentMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hitPoint = getHitPoint(raycaster, buildingDatas);

        if (hitPoint) {
            if (!objSel.div) {
                objSel.div = createSelectionMenu(addTask, hitPoint);
            }
            colorElement(hitPoint, objSel);
            if (objSel.sphere) {
                scene.remove(objSel.sphere);
            }
            objSel.sphere = addSphereOnHitPoint(hitPoint, scene);
            const pos = getScreenTranslation(objSel.sphere, camera, canvas);
            console.log(pos);
        } else {
            // Remove all the stuff is the user doesn't select an element
            scene.remove(objSel.sphere);
            removeSelectionMenu(objSel);
            colorElement(null, objSel);
        }
    }

    function onDocumentTouchEnd(event) {
        mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hitPoint = getHitPoint(raycaster, buildingDatas);

        closeSelectionMenuButton();

        if (hitPoint) {
            if (!objSel.div) {
                objSel.div = createSelectionMenu(addTask, hitPoint);
            }
            colorElement(hitPoint, objSel);
            if (objSel.sphere) {
                scene.remove(objSel.sphere);
            }
            objSel.sphere = addSphereOnHitPoint(hitPoint, scene);
        } else {
            // Remove all the stuff is the user doesn't select an element
            scene.remove(objSel.sphere);
            removeSelectionMenu(objSel);
            colorElement(null, objSel);
        }
    }

    // Don't trigger the Select if the user rotates the camera with mouse
    let mouseMoved = false;
    document.addEventListener('mousedown', () => {
        mouseMoved = false;
    }, false);
    document.addEventListener('mousemove', () => {
        mouseMoved = true;
    }, false);
    document.addEventListener('mouseup', (event) => {
        if (mouseMoved === false) {
            onDocumentMouseClick(event);
        }
    }, false);
    // Don't trigger the Select if the user rotates the camera with touch
    // Hack for touch because `mousemove` isn't triggered on the canvas because
    // of THREE.OrbitControls which include event.preventDefault(); and
    // event.stopPropagation(); for `mousemove`.
    let select_timeout_id = 0;
    const select_hold_time = 200;
    let select_timeOutPassed = false;
    document.addEventListener('touchstart', () => {
        select_timeOutPassed = false;
        select_timeout_id = setTimeout(() => {
            select_timeOutPassed = true;
        }, select_hold_time);
    }, false);
    document.addEventListener('touchend', (event) => {
        clearTimeout(select_timeout_id);
        if (select_timeOutPassed === false) {
            onDocumentTouchEnd(event);
        }
    }, false);
    // ///////////////////////////////////////////////

    this.destroy = () => {
        // scene.remove(objSel.sphere);
    };

    this.update = () => {
        if (objSel.sphere && objSel.div) {
            const pos = getScreenTranslation(objSel.sphere, camera, canvas);
            objSel.div.style.left = `${pos.x + 16}px`;
            objSel.div.style.top = `${pos.y - 48}px`;
            console.log();
        }
    };
}

const toggleSelectionMenuButton = () => {
    const SelectionMenu = document.getElementById('three-selection-menu');

    if (SelectionMenu) {
        if (SelectionMenu.classList.contains('selection-menu-open')) {
            SelectionMenu.classList.remove('selection-menu-open');
        } else {
            SelectionMenu.classList.add('selection-menu-open');
        }
    }
};

const closeSelectionMenuButton = () => {
    const SelectionMenu = document.getElementById('three-selection-menu');

    if (SelectionMenu) {
        if (SelectionMenu.classList.contains('selection-menu-open')) {
            SelectionMenu.classList.remove('selection-menu-open');
        }
    }
};

function removeSelectionMenu(objSel) {
    const SelectionMenu = document.getElementById('three-selection-menu');
    if (SelectionMenu) {
        SelectionMenu.parentElement.removeChild(SelectionMenu);
    }

    objSel.div = null;
}

function createSelectionMenu(addTask, hitPoint) {
    const SelectionMenu = document.createElement('div');
    SelectionMenu.id = 'three-selection-menu';
    SelectionMenu.className = 'three-selection-menu';
    SelectionMenu.style.position = 'absolute';
    SelectionMenu.addEventListener('mousedown', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
    }, false);
    SelectionMenu.addEventListener('touchstart', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
    }, false);

    const SelectionMenuButton = document.createElement('div');
    SelectionMenuButton.classList.add('three-selection-menu-button');
    SelectionMenuButton.innerHTML = '···';
    SelectionMenuButton.addEventListener('click', () => {
        toggleSelectionMenuButton();
    }, false);

    const SelectionMenuElement0 = document.createElement('div');
    SelectionMenuElement0.className = 'three-selection-menu-element three-type-bim';
    SelectionMenuElement0.innerHTML = '<span>☷</span> Détails BIM';


    const SelectionMenuElement1 = document.createElement('div');
    SelectionMenuElement1.className = 'three-selection-menu-element three-type-action';
    SelectionMenuElement1.innerHTML = '<span>⊛</span> Se rapprocher';
    const SelectionMenuElement2 = document.createElement('div');
    SelectionMenuElement2.className = 'three-selection-menu-element three-type-creation';
    SelectionMenuElement2.innerHTML = '<span>+</span> Ajouter une tâche ici';
    SelectionMenuElement2.addEventListener('click', () => {
        toggleSelectionMenuButton();
        addTask(hitPoint);
    }, false);

    const CloseSelectionMenu = document.createElement('div');
    CloseSelectionMenu.className = 'three-selection-menu-element three-selection-menu-close';
    CloseSelectionMenu.innerHTML = '✕';
    CloseSelectionMenu.addEventListener('mousedown', () => {
        toggleSelectionMenuButton();
    }, false);
    CloseSelectionMenu.addEventListener('touchstart', () => {
        toggleSelectionMenuButton();
    }, false);

    SelectionMenu.appendChild(SelectionMenuButton);
    SelectionMenu.appendChild(CloseSelectionMenu);
    SelectionMenu.appendChild(SelectionMenuElement2);
    SelectionMenu.appendChild(SelectionMenuElement0);
    SelectionMenu.appendChild(SelectionMenuElement1);


    document.getElementById('popup-viewer').appendChild(SelectionMenu);
    return SelectionMenu;
}

function getScreenTranslation(object, camera, canvas) {
    const { width, height } = canvas;
    const widthHalf = width / 2;
    const heightHalf = height / 2;

    const pos = object.position.clone();
    pos.project(camera);
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = -(pos.y * heightHalf) + heightHalf;

    return pos;
}

function colorElement(hitPoint, objSel) {
    if (objSel.obj && objSel.old_material) {
        objSel.obj.material = objSel.old_material;
    }
    if (hitPoint) {
        objSel.ifc_tag = hitPoint.object.ifc_tag;
        objSel.ifc_name = hitPoint.object.ifc_name;

        const event_color = new THREE.Color(0x55dda7);

        const event_material = new THREE.MeshBasicMaterial({ color: event_color });
        objSel.obj = hitPoint.object;
        objSel.old_material = hitPoint.object.material;
        hitPoint.object.material = event_material;
    } else {
        // If no element is selected, remove the color on the previous
        // selected Object
        objSel.obj.material = objSel.old_material;
    }
}

function getHitPoint(raycaster, buildingDatas) {
    const intersects = raycaster.intersectObjects(buildingDatas.mesh_all);
    if (intersects.length > 0) {
        return intersects[0];
    }
    return null;
}

function addSphereOnHitPoint(intersected, scene) {
    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00b16a });
    const sphere = new THREE.Mesh(geometry, material);
    const position = intersected.point;

    sphere.position.copy(position);
    scene.add(sphere);
    return sphere;
}

export default Select;
