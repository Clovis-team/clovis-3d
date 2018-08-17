function Select(scene, camera, buildingDatas) {
    const mouse = {};

    const obj_selection = {
        ifc_tag: 'none',
        ifc_name: 'none',
        obj_old: undefined,
        obj_old_material: undefined,
    };

    const raycaster = new THREE.Raycaster();

    function onDocumentMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (obj_selection.obj_old && obj_selection.obj_old_material) {
            obj_selection.obj_old.material = obj_selection.obj_old_material;
        }

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(buildingDatas.mesh_all);

        if (intersects.length > 0) {
            add_sphere_on_click(intersects[0], scene);
            const intersected_obj = intersects[0].object;


            obj_selection.ifc_tag = intersected_obj.ifc_tag;
            obj_selection.ifc_name = intersected_obj.ifc_name;

            const event_color = new THREE.Color(0x51f787);

            const event_material = new THREE.MeshBasicMaterial({ color: event_color });
            obj_selection.obj_old = intersected_obj;
            obj_selection.obj_old_material = intersected_obj.material;
            intersected_obj.material = event_material;
        }
    }

    // Manage rotation of camera with mouse events.
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
}


function add_sphere_on_click(intersected, scene) {
    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00b16a });
    const sphere = new THREE.Mesh(geometry, material);
    const position = intersected.point;

    sphere.position.copy(position);
    scene.add(sphere);
}

export default Select;
