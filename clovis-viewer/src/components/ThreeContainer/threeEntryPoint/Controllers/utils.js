
// Add sphere on click or touch on the model
export function add_sphere_on_click(intersected, scene) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00b16a });
    const sphere = new THREE.Mesh(geometry, material);
    const position = intersected.point;

    sphere.position.copy(position);
    scene.add(sphere);
}

// TODO: rename it better to match the logic inside
// This function is used when an element is cliked or touched
export function selectionHandler(
    new_mouse,
    object_selected,
    getSceneCamera,
    raycaster,
    getBuildingDatas,
    scene,
) {
    const camera = getSceneCamera();
    const { mesh_all } = getBuildingDatas();

    // TODO: right now it works, but coorect later to avoid param reassign
    if (object_selected.obj_old && object_selected.obj_old_material) {
        object_selected.obj_old.material = object_selected.obj_old_material;
    }

    raycaster.setFromCamera(new_mouse, camera);
    const intersects = raycaster.intersectObjects(mesh_all);

    if (intersects.length > 0) {
        add_sphere_on_click(intersects[0], scene);
        const intersected_obj = intersects[0].object;

        object_selected.ifc_tag = intersected_obj.ifc_tag;
        object_selected.ifc_name = intersected_obj.ifc_name;

        const event_color = new THREE.Color(0xf4b350);

        const event_material = new THREE.MeshBasicMaterial({ color: event_color });
        object_selected.obj_old = intersected_obj;
        object_selected.obj_old_material = intersected_obj.material;
        intersected_obj.material = event_material;
    }
}
