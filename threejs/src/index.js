/**
 * @author nmanzini / https://www.nicolamanzini.com/
 */

// THREE IMPORTED BY WEBPACK
import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/controls/FirstPersonControls';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/controls/TrackballControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';
import 'three/examples/js/loaders/GLTFLoader';
// dat gui
import dat from 'dat.gui/build/dat.gui.module';
// stats
import Stats from 'stats.js/src/Stats';

const scene = new THREE.Scene();
let camera;
let controls;
const renderer = new THREE.WebGLRenderer({ antialias: true });
const gui = new dat.GUI();
const stats = new Stats();
const loader = new THREE.GLTFLoader();
const raycaster = new THREE.Raycaster();
const ambient_light = new THREE.AmbientLight(0x404040); // soft white light
const directional_light = new THREE.DirectionalLight(0xffffff, 0.5);
const camera_types = ['Perspective', 'Ortographic', 'Walking'];
const mouse = new THREE.Vector2();
const gltf_files = [
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
let gui_ifc_info;
let intersected_obj = {};

let building;
let floors;
let ifc_building_elements = [];
// ifc_building_elements is an array of objects3d
// each object has as child all the meshes and objs
//  of a certain building element (wall, slab...)
const mesh_all = [];

function setup_camera(type, old_camera) {
    let new_camera;
    if (type === camera_types[0]) {
        new_camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000,
        );
        if (typeof old_camera !== 'undefined') {
            new_camera.position.copy(old_camera.position);
            new_camera.rotation.copy(old_camera.rotation);
        }
    } else if (type === camera_types[1]) {
        const ratio = window.innerWidth / window.innerHeight;
        const height = 100;
        const width = height * ratio;
        new_camera = new THREE.OrthographicCamera(
            width / -2, width / 2, height / 2, height / -2, -1000, 1000,
        );
        if (typeof old_camera !== 'undefined') {
            new_camera.position.copy(old_camera.position);
            new_camera.rotation.copy(old_camera.rotation);
        }
    } else {
        console.log('camera not recognized');
    }
    camera = new_camera;
    const new_controls = new THREE.OrbitControls(camera, renderer.domElement);
    if (typeof controls !== 'undefined') {
        new_controls.target.copy(controls.target);
    } else {
        new_controls.target.set(80, 0, 20);
    }
    new_controls.enableDamping = true;
    new_controls.screenSpacePanning = true;
    new_controls.panSpeed = 0.3;
    new_controls.rotateSpeed = 0.2;
    new_controls.screenSpacePanning = true;

    controls = new_controls;
}

function populate_gui_camera() {
    const gui_camera = gui.addFolder('Camera options');
    const new_camera = { type: camera_types[0] };
    const controller = gui_camera.add(new_camera, 'type', camera_types);
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
    elements.forEach((element) => {
        const ifc_tag = element.name;
        const controller = gui_ifc_tags_folder.add(element, 'visible_order').name(ifc_tag);

        controller.onChange(() => {
            if (element.visible_order !== element.visible) {
                element.children.forEach((obj) => {
                    obj.visible = element.visible_order;
                });
                element.visible = element.visible_order;
            }
        });
    });
}

function populate_gui_explosion() {
    const explosion = {
        z_old: 0,
        z_new: 0,
        z_delta: 0,
    };

    const controller = gui.add(explosion, 'z_new', 0, 100).name('z_explosion');

    controller.onChange(() => {
        explosion.z_delta = explosion.z_new - explosion.z_old;
        floors.forEach((floor, index) => {
            floor.position.z += (explosion.z_delta * index);
        });
        explosion.z_old = explosion.z_new;
        explosion.z_delta = 0;
    });
}


function populate_ifc_tag_gui() {
    gui_ifc_info = { ifc_tag: 'none', ifc_name: 'none' };
    gui.add(gui_ifc_info, 'ifc_tag').listen();
    gui.add(gui_ifc_info, 'ifc_name').listen();
}

function get_building_elements(object) {
    const elements = [];
    object.traverse((node) => {
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

            building = (gltf.scene.children[0].children[0].children[0].children[0]);
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

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.updated = true;
}

function init_scene() {
    load_gltf_file(gltf_files[0]);
    document.addEventListener('click', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    scene.add(ambient_light);
    scene.add(directional_light);
    scene.background = new THREE.Color(0xaaaabb);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    setup_camera(camera_types[0], camera);
    populate_gui_camera();
}

init_scene();


// load_gltf_file('gltfs/Project1-assimp.gltf')


// 4 fails

// load_gltf_file(gltf_files[0])


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

function find_center(object3D) {
    const length = object3D.children.length;
    const centers = object3D.children.map(({ position: center }) => center);

    let x = 0;
    let y = 0;
    let z = 0;
    centers.forEach((vector) => {
        x += vector.x;
        y += vector.y;
        z += vector.z;
    });
    x /= length;
    y /= length;
    z /= length;
    const center = new THREE.Vector3(x, y, z);
    return center;
}


// const clock = new THREE.Clock( true );

function render() {
    if (mouse.updated) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(mesh_all);
        if (intersects.length > 0) {
            intersected_obj = intersects[0].object;
            gui_ifc_info.ifc_tag = intersected_obj.ifc_tag;
            gui_ifc_info.ifc_name = intersected_obj.ifc_name;
            console.log('OBJ', intersected_obj);
            console.log('intersects[0]', intersects[0]);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            intersected_obj.material = material;
            // controls.target.copy(intersects[0].point);
            // :TODO TWEEN the old target to the new (in 0.3 seconds)
        }
        mouse.updated = false;
    }

    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    // required if controls.enableDamping or controls.autoRotate are set to true
    // controls.update( clock.getDelta() );
    controls.update();

    render();

    stats.end();
}


animate();
