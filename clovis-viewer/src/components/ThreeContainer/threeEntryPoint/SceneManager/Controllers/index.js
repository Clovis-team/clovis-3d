import MenuAndButtons from '../MenuAndButtons';

// TODO: put this variables in an other "stable" place
let canvasHalfWidth;
let canvasHalfHeight;

// EVENTS CONTROLLERS

function onMouseMove({ screenX, screenY }) {
    const x = screenX - canvasHalfWidth;
    const y = screenY - canvasHalfHeight;

    // console.log('mouse moved');
}

function onKeyPressed(event) {
    // TODO: implement a submodule of walking around;
    const walking_keys = ['w', 'a', 's', 'd'];
    if (walking_keys.indexOf(event.key) > -1) {
        console.log(event);
    }
}

function onClose() {
    // gui and stats are removed inside OnViewerClose of App.jsx file
    // why ? avoid to Trigger this function from REact

    // TODO: remove eventual listeners;
}

function resizeCanvas(canvas, getSceneCamera, renderer) {
    const camera = getSceneCamera();

    // Change canvas
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // TODO: unused but could be usefull
    canvasHalfWidth = Math.round(canvas.offsetWidth / 2);
    canvasHalfHeight = Math.round(canvas.offsetHeight / 2);

    // TODO: check if all of that works
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

function onEndOfLoaderCallback(canvas, InitializedScene, Cameras) {
    MenuAndButtons(
        canvas,
        InitializedScene,
        Cameras,
    );
}

function onDocumentMouseClick(event, mouse, obj_selection, camera, raycaster, mesh_all) {
    console.log('onDocumentMouseClick:', event);
    event.preventDefault();

    // const new_mouse = mouse;

    // new_mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // new_mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // if (obj_selection.obj_old && obj_selection.obj_old_material) {
    //     obj_selection.obj_old.material = obj_selection.obj_old_material;
    // }

    // raycaster.setFromCamera(new_mouse, camera);
    // const intersects = raycaster.intersectObjects(mesh_all);

    // if (intersects.length > 0) {
    //     // add_sphere_on_click(intersects[0]);
    //     const intersected_obj = intersects[0].object;

    //     obj_selection.ifc_tag = intersected_obj.ifc_tag;
    //     obj_selection.ifc_name = intersected_obj.ifc_name;

    //     const event_color = new THREE.Color(0x51f787);

    //     const event_material = new THREE.MeshBasicMaterial({ color: event_color });
    //     obj_selection.obj_old = intersected_obj;
    //     obj_selection.obj_old_material = intersected_obj.material;
    //     intersected_obj.material = event_material;
    // }
}


export default {
    canvasHalfWidth,
    resizeCanvas,
    onMouseMove,
    onKeyPressed,
    onClose,
    onEndOfLoaderCallback,
    onDocumentMouseClick,
};
