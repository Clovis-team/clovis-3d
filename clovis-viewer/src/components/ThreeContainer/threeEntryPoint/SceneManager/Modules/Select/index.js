function Select(scene, camera, buildingDatas) {
    const mouse = {};

    const objSel = {
        ifc_tag: 'none',
        ifc_name: 'none',
        obj: null,
        old_material: null,
        sphere: null,
    };


    const raycaster = new THREE.Raycaster();


    function onDocumentMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hitPoint = getHitPoint(raycaster, buildingDatas);

        if (hitPoint) {
            colorElement(hitPoint, objSel);
            if (objSel.sphere) {
                scene.remove(objSel.sphere);
            }
        }
        objSel.sphere = addSphereOnHitPoint(hitPoint, scene);
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
        }
        objSel.sphere = addSphereOnHitPoint(hitPoint, scene);
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
}

function colorElement({ object }, objSel) {
    if (objSel.obj && objSel.old_material) {
        objSel.obj.material = objSel.old_material;
    }
    objSel.ifc_tag = object.ifc_tag;
    objSel.ifc_name = object.ifc_name;

    const event_color = new THREE.Color(0x51f787);

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
    const material = new THREE.MeshBasicMaterial({ color: 0x00b16a });
    const sphere = new THREE.Mesh(geometry, material);
    const position = intersected.point;

    sphere.position.copy(position);
    scene.add(sphere);
    return sphere;
}

export default Select;
