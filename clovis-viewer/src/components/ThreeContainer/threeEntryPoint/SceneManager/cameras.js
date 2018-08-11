import './utils/FirstPersonControlsClovis';

function setup_flying_drag_fps(new_camera, renderer) {
    const new_controls = new THREE.FirstPersonControlsClovis(new_camera, renderer.domElement);
    new_controls.movementSpeed = 5;
    new_controls.lookSpeed = 5;
    new_controls.fps_style = true;
    return new_controls;
}

function setup_flying_drag(new_camera, renderer) {
    const new_controls = new THREE.FirstPersonControlsClovis(new_camera, renderer.domElement);
    new_controls.movementSpeed = 5;
    new_controls.lookSpeed = 5;

    return new_controls;
}

function setup_walking_drag(new_camera, renderer) {
    const new_controls = new THREE.FirstPersonControlsClovis(new_camera, renderer.domElement);
    new_controls.movementSpeed = 5;
    new_controls.lookSpeed = 5;
    new_controls.plane_movements = true;
    if (typeof mesh_all !== 'undefined') {
        new_controls.collision_objects = mesh_all;
        new_controls.collision_floor = true;
    }
    return new_controls;
}

function setup_walking_drag_fps(new_camera, renderer) {
    const new_controls = new THREE.FirstPersonControlsClovis(new_camera, renderer.domElement);
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

function setup_orbit_control(new_camera, renderer, controls) {
    console.log('Setup orbit controls :');
    console.log('controls to setup:', controls);
    const new_controls = new THREE.OrbitControls(new_camera, renderer.domElement);
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
    controls = new_controls;
    console.log('final controls :', controls);
}

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

function apply_camera(camera, new_camera) {
    // in  a future the process can be improved
    camera = new_camera;
}

function apply_controls(controls, new_controls) {
    controls = new_controls;
}

function new_perspective_camera() {
    return new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000,
    );
}


/** Only for update, not build. It's too messy either */
function change_camera(cameraTypes, type, camera, controls, renderer) {
    let new_camera;
    let new_controls;

    if (typeof controls !== 'undefined') {
        console.log('Dispose() controls :');
        controls.dispose();
    }

    switch (type) {
    case 'Perspective':
        console.log('Camera : Perspective');
        new_camera = new_perspective_camera();
        copy_camera_old_pos_rot(new_camera, camera);
        apply_camera(camera, new_camera);
        setup_orbit_control(new_camera, renderer, controls);
        break;

    case 'Ortographic': {
        console.log('Camera : Ortographic');
        const ratio = window.innerWidth / window.innerHeight;
        const height = 100;
        const width = height * ratio;
        new_camera = new THREE.OrthographicCamera(
            width / -2, width / 2, height / 2, height / -2, -1000, 1000,
        );
        copy_camera_old_pos_rot(new_camera, camera);
        apply_camera(new_camera);
        setup_orbit_control(new_camera, renderer, controls);
        break;
    }

    case 'Flying drag Fps': {
        console.log('Camera : Flying drag Fps');
        new_camera = new_perspective_camera();
        copy_camera_old_pos_rot(new_camera, camera);
        apply_camera(new_camera);

        new_controls = setup_flying_drag_fps(new_camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        apply_controls(controls, new_controls);
        break;
    }

    case 'Flying drag': {
        console.log('Camera : Flying drag');
        new_camera = new_perspective_camera();
        copy_camera_old_pos_rot(new_camera, camera);
        apply_camera(camera, new_camera);

        new_controls = setup_flying_drag(new_camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        apply_controls(controls, new_controls);
        break;
    }

    case 'walking drag fps': {
        console.log('Camera : walking drag fps');
        new_camera = new_perspective_camera();
        copy_camera_old_pos_rot(new_camera, camera);
        apply_camera(camera, new_camera);

        new_controls = setup_walking_drag_fps(new_camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        apply_controls(controls, new_controls);
        break;
    }

    case 'walking drag': {
        console.log('Camera : walking drag');
        new_camera = new_perspective_camera();
        copy_camera_old_pos_rot(new_camera, camera);
        apply_camera(camera, new_camera);
        console.log('camera 3 :', camera);
        console.log('new_camera 4 :', new_camera);
        new_controls = setup_walking_drag(new_camera, renderer);
        // copy_controls_old_phi_theta(new_controls, controls);
        apply_controls(controls, new_controls);
        break;
    }

    default: {
        console.log(`camera "${type}" not recognized`);
    }
    }

    // TODO: explain why we re-set the height at each camera update
    camera.height = 'INIT';
}

export default {
    // SETUP NEW CONTROLS
    setup_flying_drag_fps,
    setup_flying_drag,
    setup_walking_drag,
    setup_walking_drag_fps,
    setup_orbit_control,
    // UTILS
    copy_camera_old_pos_rot,
    copy_controls_old_phi_theta,
    //
    apply_camera,
    apply_controls,
    //
    new_perspective_camera,
    //
    change_camera,
};
