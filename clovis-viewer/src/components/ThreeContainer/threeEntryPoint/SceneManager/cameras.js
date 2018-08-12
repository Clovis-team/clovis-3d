import './utils/FirstPersonControlsClovis';


// UTILS

function copy_camera_old_pos_rot(new_camera, camera) {
    if (typeof camera !== 'undefined') {
        new_camera.position.copy(camera.position);
        new_camera.rotation.copy(camera.rotation);
    }
}

function copy_controls_old_phi_theta(new_controls, controls) {
    if (typeof controls !== 'undefined' && typeof controls.phi !== 'undefined') {
        new_controls.phi = controls.phi;
        new_controls.theta = controls.theta;
    }
}


// CAMERA SETUP

function new_perspective_camera(camera) {
    const new_camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    copy_camera_old_pos_rot(new_camera, camera);

    return new_camera;
}

function new_ortographic_camera(camera) {
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
    copy_camera_old_pos_rot(new_camera, camera);

    return new_camera;
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
    // TODO: change it back to 0.2, 0.3 is a test with base camera
    new_controls.rotateSpeed = 0.3;
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
function change_camera_and_controls(cameraTypes, type, camera, controls, renderer) {
    let new_camera;
    let new_controls;

    console.log('camera to change :', camera);
    console.log('controls to change :', controls);

    // TODO: explain the role of this part, doesn't seem to really clean
    // the controls
    if (typeof controls !== 'undefined') {
        controls.dispose();
    }

    switch (type) {
    case 'Perspective':
        camera = new_perspective_camera(camera);
        controls = setup_orbit_control(camera, renderer, controls);
        break;

    case 'Ortographic': {
        camera = new_ortographic_camera(camera);
        controls = setup_orbit_control(camera, renderer, controls);
        break;
    }

    case 'Flying drag Fps': {
        camera = new_perspective_camera(camera);
        controls = setup_flying_drag_fps(camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        break;
    }

    case 'Flying drag': {
        camera = new_perspective_camera(camera);
        controls = setup_flying_drag(camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        break;
    }

    case 'walking drag fps': {
        camera = new_perspective_camera(camera);
        controls = setup_walking_drag_fps(camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        break;
    }

    case 'walking drag': {
        camera = new_perspective_camera(camera);
        controls = setup_walking_drag(camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        break;
    }

    default: {
        console.log(`camera "${type}" not recognized`);
    }
    }

    console.log('changed camera :', camera);
    console.log('changed controls :', controls);
    // TODO: explain why we re-set the height at each camera update
    camera.height = 'INIT';
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
