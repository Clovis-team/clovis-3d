/**
 * @author nmanzini / https://www.nicolamanzini.com/
 */

// THREE IMPORTED BY WEBPACK
import dat from 'dat.gui/build/dat.gui.module';
import Stats from 'stats.js/src/Stats';
import 'three/examples/js/controls/FirstPersonControls';
import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/controls/TrackballControls';
import 'three/examples/js/loaders/GLTFLoader';
import 'three/examples/js/loaders/MTLLoader';
import 'three/examples/js/loaders/OBJLoader';
import { get_building } from './utils/get_from_scene';
import './utils/FirstPersonControlsClovis';


const scene = new THREE.Scene();
let camera;
let controls;
const renderer = new THREE.WebGLRenderer({ antialias: true });
const gui = new dat.GUI();
const stats = new Stats();
const loader = new THREE.GLTFLoader();
const raycaster = new THREE.Raycaster();
// const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 1);

const cameraTypes = ['Perspective', 'Ortographic', 'Walking'];
const mouse = new THREE.Vector2();
const gltfFiles = [
    'gltfs/15-assimp.gltf',
    'gltfs/Project1-assimp.gltf',
    'gltfs/14-06-VIL_CHANTIER_150916_RVT2017_fdr_1.gltf',
    'gltfs/14-06-VIL_CHANTIER_150916_RVT2017_fdr.gltf',
    'gltfs/20160125WestRiverSide_Hospital_-_IFC4-Autodesk_Hospital_Metric_Structural.gltf',
    'gltfs/20160414office_model_CV2_fordesign.gltf',
    'gltfs/architect_copie_2.gltf',
    'gltfs/architect_copie.gltf',
    'gltfs/architect.gltf',
    'gltfs/duplex.gltf',
    'gltfs/Munkerud_hus6_BE.gltf',
];
// object to support the clikinng, infos and objc color change
const obj_selection = {
    ifc_tag: 'none',
    ifc_name: 'none',
    obj_old: undefined,
    obj_old_material: undefined,
};

// relink of the actual building object 3d
let building;

// relink of building.children
let floors;

// list of objects
let ifc_building_elements = [];

// list of all meshes for mouse cliking
const mesh_all = [];

// function setup_first_person_control() {
//     const new_controls = new THREE.FirstPersonControls(camera, renderer.domElement);
//     new_controls.movementSpeed = 20.0;
//     new_controls.lookSpeed = 0.5;
//     controls = new_controls;
// }

function setup_first_person_control_clovis() {
    const new_controls = new THREE.FirstPersonControlsClovis(camera, renderer.domElement);
    new_controls.movementSpeed = 20.0;
    new_controls.lookSpeed = 20;
    controls = new_controls;
    console.log(controls);
}


function setup_orbit_control() {
    const new_controls = new THREE.OrbitControls(camera, renderer.domElement);
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
}

function copy_old_pos_rot(new_camera, old_camera) {
    if (typeof old_camera !== 'undefined') {
        new_camera.position.copy(old_camera.position);
        new_camera.rotation.copy(old_camera.rotation);
    }
}

function apply_camera(new_camera) {
    // in  a future the process can be improved
    camera = new_camera;
}

function setup_camera(type, old_camera) {
    let new_camera;
    if (typeof controls !== 'undefined') {
        controls.dispose();
    }
    if (type === cameraTypes[0]) {
        new_camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000,
        );
        copy_old_pos_rot(new_camera, old_camera);
        apply_camera(new_camera);
        setup_orbit_control();
    } else if (type === cameraTypes[1]) {
        const ratio = window.innerWidth / window.innerHeight;
        const height = 100;
        const width = height * ratio;
        new_camera = new THREE.OrthographicCamera(
            width / -2, width / 2, height / 2, height / -2, -1000, 1000,
        );
        copy_old_pos_rot(new_camera, old_camera);
        apply_camera(new_camera);
        setup_orbit_control();
    } else if (type === cameraTypes[2]) {
        new_camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000,
        );
        // copy_old_pos_rot(new_camera, old_camera);
        apply_camera(new_camera);
        // setup_first_person_control();
        setup_first_person_control_clovis();
    } else {
        console.log(`camera "${type}" not recognized`);
    }
    // setup_orbit_control();
}

function populate_gui_camera(type_n) {
    const gui_camera = gui.addFolder('Camera options');
    const new_camera = { type: cameraTypes[type_n] };
    const controller = gui_camera.add(new_camera, 'type', cameraTypes);
    controller.onChange((value) => {
        setup_camera(value, camera);
    });
}

function center_and_position_camera(object) {
    object.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    controls.target.copy(center);
    camera.position.copy(center.add(size));
    console.log('target', controls.target);
    console.log('camera postion', camera.position);
}
function populate_gui_floors() {
    const gui_floor_folder = gui.addFolder('Floors');
    for (let i = floors.length - 1; i >= 0; i -= 1) {
        const floor_name = floors[i].name.split('_')[1];
        gui_floor_folder.add(floors[i], 'visible').name(floor_name);
    }
}

function populate_gui_ifc_tags(elements) {
    const gui_ifc_tags_folder = gui.addFolder('Ifc Tags');
    elements.forEach((element_no) => {
        const element = element_no;
        const ifc_tag = element.name;
        const controller = gui_ifc_tags_folder.add(element, 'visible_order').name(ifc_tag);

        controller.onChange(() => {
            if (element.visible_order !== element.visible) {
                element.children.forEach((obj_no) => {
                    const obj = obj_no;
                    obj.visible = element.visible_order;
                });
                element.visible = element.visible_order;
            }
        });
    });
}

function get_main_floor(floor_array) {
    let max_value = 0;
    let max_id = 0;
    floor_array.forEach((floor, index) => {
        if (floor.children.length > max_value) {
            max_value = floor.children.length;
            max_id = index;
        }
    });
    return max_id;
}

function populate_gui_explosion() {
    const explosion = {
        z_old: 0,
        z_new: 0,
        z_delta: 0,
    };

    const main_floor = get_main_floor(floors);

    const controller = gui.add(explosion, 'z_new', 0, 100).name('z_explosion');

    controller.onChange(() => {
        explosion.z_delta = explosion.z_new - explosion.z_old;
        floors.forEach((floor_no, index) => {
            const floor = floor_no;
            floor.position.z += (explosion.z_delta * (index - main_floor));
        });

        explosion.z_old = explosion.z_new;
        explosion.z_delta = 0;
    });
}


function populate_ifc_tag_gui() {
    gui.add(obj_selection, 'ifc_tag').listen();
    gui.add(obj_selection, 'ifc_name').listen();
}

function get_building_elements(object) {
    const elements = [];
    object.traverse((node_no) => {
        const node = node_no;
        if ((node instanceof THREE.Mesh || node instanceof THREE.Object3D) && node.name !== '') {
            mesh_all.push(node);
            const ifc_tag = node.name.split('_')[0];
            node.ifc_tag = ifc_tag;
            const ifc_name = node.name.split('_')[1];
            node.ifc_name = ifc_name;
            if (ifc_tag !== '' && ifc_tag.charAt(0) !== '$'
            && ifc_tag !== 'mesh' && ifc_tag !== 'IfcBuildingStorey') {
                if (!elements.some(obj => obj.ifc_tag === ifc_tag)) {
                    const ifc_building_element = new THREE.Object3D();
                    ifc_building_element.ifc_tag = ifc_tag;
                    ifc_building_element.name = ifc_tag;
                    ifc_building_element.ifc_name = ifc_name;
                    ifc_building_element.visible_order = true;
                    ifc_building_element.children.push(node);
                    elements.push(ifc_building_element);
                } else {
                    const ifc_building_element = elements.find(obj => obj.ifc_tag === ifc_tag);
                    ifc_building_element.children.push(node);
                }
            }
        }
    });
    return elements;
}


function load_gltf_file(URL) {
    const t0 = performance.now();
    // Load a glTF resource
    loader.load(
    // resource URL
        URL,

        // called when the resource is loaded
        (gltf) => {
            // scene.add( gltf.scene );
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Scene
            // gltf.scenes; // Array<THREE.Scene>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object
            const t1 = performance.now();
            console.log(`load gltf took ${Math.round(t1 - t0)} milliseconds.`);

            scene.add(gltf.scene);
            center_and_position_camera(scene);

            // building = gltf.scene.children[0].children[0].children[0].children[0];
            building = get_building(gltf.scene);
            floors = building.children;

            populate_gui_floors();
            ifc_building_elements = get_building_elements(building);
            populate_gui_ifc_tags(ifc_building_elements);
            populate_gui_explosion();
            populate_ifc_tag_gui();
            const t2 = performance.now();
            console.log(`load and name all groups ${Math.round(t2 - t1)} milliseconds.`);
        },
        // called while loading is progressing
        (xhr) => {
            console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
        },
    // called when loading has errors
    // function ( error ) {
    //     console.log( 'An error happened' );
    // }
    );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function add_sphere_on_click(intersected) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    const position = intersected.point;

    sphere.position.copy(position);
    scene.add(sphere);
}

function onDocumentMouseClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (obj_selection.obj_old && obj_selection.obj_old_material) {
        obj_selection.obj_old.material = obj_selection.obj_old_material;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(mesh_all);

    if (intersects.length > 0) {
        // add_sphere_on_click(intersects[0]);
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

function onDocumentTouchEnd(event) {
    event.preventDefault();

    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    if (obj_selection.obj_old && obj_selection.obj_old_material) {
        obj_selection.obj_old.material = obj_selection.obj_old_material;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(mesh_all);

    if (intersects.length > 0) {
        add_sphere_on_click(intersects[0]);
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

function init_scene() {
    // const axis = new THREE.AxesHelper(100);
    // scene.add(axis);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(stats.dom);
    load_gltf_file(gltfFiles[0]);
    document.addEventListener('mouseup', onDocumentMouseClick, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);
    window.addEventListener('resize', onWindowResize, false);
    // scene.add(directionalLight);
    scene.add(hemisphereLight);
    scene.background = new THREE.Color(0xaaaabb);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

    setup_camera(cameraTypes[0], camera);
    populate_gui_camera(0);
}

init_scene();

// just needed for certain kind of controls
const clock = new THREE.Clock(true);

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update(clock.getDelta());
    // controls.update();

    render();

    stats.end();
}

animate();
