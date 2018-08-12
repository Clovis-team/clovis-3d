import './utils/FirstPersonControlsClovis';

// UTILS

function copy_camera_old_pos_rot(new_camera, old_camera) {
    if (typeof old_camera !== 'undefined') {
        new_camera.position.copy(old_camera.position);
        new_camera.rotation.copy(old_camera.rotation);
    }

    return new_camera;
}

function copy_controls_old_phi_theta(new_controls, controls) {
    if (typeof controls !== 'undefined' && typeof controls.phi !== 'undefined') {
        new_controls.phi = controls.phi;
        new_controls.theta = controls.theta;
    }
}


// CAMERA SETUP

function new_perspective_camera(old_camera) {
    const new_camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    const new_camera_same_position = copy_camera_old_pos_rot(new_camera, old_camera);

    return new_camera_same_position;
}

function new_ortographic_camera(old_camera) {
    const ratio = window.innerWidth / window.innerHeight;
    const height = 100;
    const width = height * ratio;
    const new_camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        -1000,
        1000,
    );
    const new_camera_same_position = copy_camera_old_pos_rot(new_camera, old_camera);

    return new_camera_same_position;
}


// CONTROLS SETUP

function setup_orbit_control(new_camera, renderer, controls) {
    const new_controls = new THREE.OrbitControls(
        new_camera,
        renderer.domElement,
    );

    if (typeof controls !== 'undefined') {
        new_controls.target.copy(controls.target);
    } else {
        new_controls.target.set(0, 0, 0);
    }

    new_controls.enableDamping = true;
    new_controls.screenSpacePanning = true;
    new_controls.panSpeed = 0.3;
    new_controls.rotateSpeed = 0.2;
    new_controls.screenSpacePanning = true;

    return new_controls;
}


function setup_flying_drag_fps(new_camera, renderer) {
    const new_controls = new THREE.FirstPersonControlsClovis(
        // (required) The camera to be controlled.
        new_camera,
        // (optional) The HTML element used for event listeners.
        renderer.domElement,
    );
    new_controls.movementSpeed = 5;
    new_controls.lookSpeed = 5;
    new_controls.fps_style = true;

    return new_controls;
}

function setup_flying_drag(new_camera, renderer) {
    const new_controls = new THREE.FirstPersonControlsClovis(
        new_camera,
        renderer.domElement,
    );
    new_controls.movementSpeed = 5;
    new_controls.lookSpeed = 5;

    return new_controls;
}

function setup_walking_drag_fps(new_camera, renderer) {
    const new_controls = new THREE.FirstPersonControlsClovis(
        new_camera,
        renderer.domElement,
    );
    new_controls.movementSpeed = 5;
    new_controls.lookSpeed = 5;
    new_controls.fps_style = true;
    new_controls.plane_movements = true;
    if (typeof mesh_all !== 'undefined') {
        new_controls.collision_objects = mesh_all;
        new_controls.collision_floor = true;
    }

    return new_controls;
}

function setup_walking_drag(new_camera, renderer) {
    const new_controls = new THREE.FirstPersonControlsClovis(
        new_camera,
        renderer.domElement,
    );
    new_controls.movementSpeed = 5;
    new_controls.lookSpeed = 5;
    new_controls.plane_movements = true;
    if (typeof mesh_all !== 'undefined') {
        new_controls.collision_objects = mesh_all;
        new_controls.collision_floor = true;
    }

    return new_controls;
}

// CAMERAS SWITCH

/** Only for update, not build. It's too messy either */
function change_camera_and_controls(
    cameraTypes,
    type,
    getSceneCamera,
    getSceneControls,
    renderer,
    modifySceneCamera,
    modifySceneControls,
) {
    const old_camera = getSceneCamera();
    const old_controls = getSceneControls();
    const selected_camera = type;
    let new_camera;
    let new_controls;

    // Necessary to fully clean old controls
    if (typeof old_controls !== 'undefined') {
        old_controls.dispose();
    }

    switch (selected_camera) {
    case 'Perspective':
        new_camera = new_perspective_camera(old_camera);
        new_controls = setup_orbit_control(new_camera, renderer, old_controls);
        break;

    case 'Ortographic': {
        new_camera = new_ortographic_camera(old_camera);
        new_controls = setup_orbit_control(new_camera, renderer, old_controls);
        break;
    }

    case 'Flying drag Fps': {
        new_camera = new_perspective_camera(old_camera);
        new_controls = setup_flying_drag_fps(new_camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        break;
    }

    case 'Flying drag': {
        new_camera = new_perspective_camera(old_camera);
        new_controls = setup_flying_drag(new_camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        break;
    }

    case 'walking drag fps': {
        new_camera = new_perspective_camera(old_camera);
        new_controls = setup_walking_drag_fps(new_camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        break;
    }

    case 'walking drag': {
        new_camera = new_perspective_camera(old_camera);
        new_controls = setup_walking_drag(new_camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        break;
    }

    default: {
        console.log(`camera "${type}" not recognized`);
    }
    }

    // TODO: explain why we re-set the height at each camera update
    new_camera.height = 'INIT';

    if (typeof new_camera !== 'undefined') {
        modifySceneCamera(new_camera);
    }
    if (typeof new_controls !== 'undefined') {
        modifySceneControls(new_controls);
    }
}

export default {
    // SETUP NEW CAMERAS
    new_perspective_camera,
    new_ortographic_camera,
    // SETUP NEW CONTROLS
    setup_flying_drag_fps,
    setup_flying_drag,
    setup_walking_drag,
    setup_walking_drag_fps,
    setup_orbit_control,
    // GLOBAL FUNCTION
    change_camera_and_controls,
};
