

function Select(scene, camera, buildingDatas, canvas) {
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
                objSel.div = createSelectionMenu();
            }
            colorElement(hitPoint, objSel);
            if (objSel.sphere) {
                scene.remove(objSel.sphere);
            }
            objSel.sphere = addSphereOnHitPoint(hitPoint, scene);
            const pos = getScreenTranslation(objSel.sphere, camera, canvas);
            console.log(pos);
        }
    }

    function onDocumentTouchEnd(event) {
        mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hitPoint = getHitPoint(raycaster, buildingDatas);

        if (hitPoint) {
            colorElement(hitPoint, objSel);
            if (objSel.sphere) {
                scene.remove(objSel.sphere);
            }
            objSel.sphere = addSphereOnHitPoint(hitPoint, scene);
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


    this.update = () => {
        if (objSel.sphere && objSel.div) {
            const pos = getScreenTranslation(objSel.sphere, camera, canvas);
            objSel.div.style.left = `${pos.x + 10}px`;
            objSel.div.style.top = `${pos.y - 40}px`;
            console.log();
        }
    };
}

function createSelectionMenu() {
    const SelectionMenu = document.createElement('div');
    SelectionMenu.id = 'three-selection-menu';
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

    const toggleSelectionMenuButton = () => {
        if (SelectionMenu.classList.contains('selection-menu-open')) {
            SelectionMenu.classList.remove('selection-menu-open');
        } else {
            SelectionMenu.classList.add('selection-menu-open');
        }
    };

    const SelectionMenuButton = document.createElement('div');
    SelectionMenuButton.classList.add('three-selection-menu-button');
    SelectionMenuButton.innerHTML = '···';
    SelectionMenuButton.addEventListener('mousedown', () => {
        toggleSelectionMenuButton();
    }, false);
    SelectionMenuButton.addEventListener('touchstart', () => {
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
    SelectionMenu.appendChild(SelectionMenuElement0);
    SelectionMenu.appendChild(SelectionMenuElement1);
    SelectionMenu.appendChild(SelectionMenuElement2);
    SelectionMenu.appendChild(CloseSelectionMenu);


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

function colorElement({ object }, objSel) {
    if (objSel.obj && objSel.old_material) {
        objSel.obj.material = objSel.old_material;
    }
    objSel.ifc_tag = object.ifc_tag;
    objSel.ifc_name = object.ifc_name;

    const event_color = new THREE.Color(0x9ed0eb);

    const event_material = new THREE.MeshBasicMaterial({ color: event_color });
    objSel.obj = object;
    objSel.old_material = object.material;
    object.material = event_material;
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
    const material = new THREE.MeshBasicMaterial({ color: 0x22a7f0 });
    const sphere = new THREE.Mesh(geometry, material);
    const position = intersected.point;

    sphere.position.copy(position);
    scene.add(sphere);
    return sphere;
}

export default Select;
