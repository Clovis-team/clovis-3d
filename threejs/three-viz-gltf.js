/**
 * @author nmanzini / https://www.nicolamanzini.com/
 */

var scene, camera, control, renderer
var gui, stats

var gui_intersected
var loader = new THREE.GLTFLoader();

gui = new dat.GUI();
// creating gui folders

scene = new THREE.Scene();
scene.background = new THREE.Color( 0xaaaabb );
window.scene = scene

var camera_types = ["Perspective","Ortographic","Walking"]

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
scene.add( directionalLight );

stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

var mouse = new THREE.Vector2();
var INTERSECTED = {}

setup_camera(camera_types[0],camera);

function setup_camera(type,old_camera){
    let new_camera;
    if (type == camera_types[0]){
        new_camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        if (typeof old_camera != "undefined") {
            new_camera.position.copy(old_camera.position);
            new_camera.rotation.copy(old_camera.rotation);
        }
    } else if (type == camera_types[1]){
        let ratio = window.innerWidth/window.innerHeight;
        let height = 100
        let width = height * ratio;
        new_camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, -1000, 1000 );
        if (typeof old_camera != "undefined") {
            new_camera.position.copy(old_camera.position);
            new_camera.rotation.copy(old_camera.rotation);
        }
    } else{
        console.log("camera not recognized")
    };
    camera = new_camera;
    let new_controls = new THREE.OrbitControls(camera,renderer.domElement);
    if (typeof controls != "undefined") {
        new_controls.target.copy(controls.target);
    }else{
        new_controls.target.set(80, 0, 20);
    }
    new_controls.enableDamping = true;
    new_controls.screenSpacePanning = true;
    new_controls.panSpeed = 0.3;
    new_controls.rotateSpeed = 0.2;
    new_controls.screenSpacePanning = true;

    controls = new_controls;
}

var building_main = {}
var floors = {}
let ifc_building_elements = [];
// ifc_building_elements is an array of objects3d
// each object has as child all the meshes and objs
//  of a certain building element (wall, slab...)
var mesh_all = [];

var t0 = performance.now();



populate_gui_camera();
// load_gltf_file('gltfs/Project1-assimp.gltf')

var gltf_files = [
    "gltfs/15-assimp.gltf",
    "gltfs/Project1-assimp.gltf",
    "gltfs/14-06-VIL_CHANTIER_150916_RVT2017_fdr_1.gltf",
    "gltfs/14-06-VIL_CHANTIER_150916_RVT2017_fdr.gltf",
    "gltfs/20160125WestRiverSide_Hospital_-_IFC4-Autodesk_Hospital_Metric_Structural.gltf",
    "gltfs/20160414office_model_CV2_fordesign.gltf",
    "gltfs/architect_copie_2.gltf",
    "gltfs/architect_copie.gltf",
    "gltfs/architect.gltf",
    "gltfs/duplex.gltf",
    "gltfs/Munkerud_hus6_BE.gltf",
]

load_gltf_file(gltf_files[0])

// 4 fails

// load_gltf_file(gltf_files[0])
function load_gltf_file(URL){
    // Load a glTF resource
    loader.load(
        // resource URL
        URL,
    
        // called when the resource is loaded
        function ( gltf ) {
            // scene.add( gltf.scene );
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Scene   
            // gltf.scenes; // Array<THREE.Scene>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object
            var t1 = performance.now();
            console.log("load gltf took " + Math.round(t1 - t0) + " milliseconds.")
            
            scene.add(gltf.scene);
            center_and_position_camera(scene,camera,controls)
            
            building = (gltf.scene.children[0].children[0].children[0].children[0]);
            floors = building.children;
            
            populate_gui_floors(floors);
            ifc_building_elements = get_building_elements(building);
            populate_gui_ifc_tags(ifc_building_elements);
            populate_gui_explosion(floors);
            populate_ifc_tag_gui();
            var t2 = performance.now();
            console.log("load and name all groups " + Math.round(t2 - t1) + " milliseconds.")
        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        // function ( error ) {
        //     console.log( 'An error happened' );
        // }
    );
}

function center_and_position_camera(object, camera, controls){
    object.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(object);
    var size = new THREE.Vector3
    box.getSize(size)
    var center = new THREE.Vector3
    box.getCenter(center);
    controls.target.copy(center);
    camera.position.copy(center.add(size))
}

function get_main_floor(floors){
    let max_value = 0;
    let max_id = 0;
    floors.forEach((floor,index) =>{
        if (floor.children.length > max_value){
            max_value = floor.children.length;
            max_id = index;
        }
    });
    return max_id
}

function find_center(object3D){
    let centers = []
    let length = object3D.children.length
    object3D.children.forEach(obj => {
        centers.push( obj.position)
    })
    let x = 0
    let y = 0
    let z = 0
    centers.forEach(vector =>{
        x+=vector.x
        y+=vector.y
        z+=vector.z
    })
    x /= length;
    y /= length;
    z /= length;
    center = new THREE.Vector3(x,y,z);
    return center
}

function get_building_elements(scene){
    let ifc_building_elements = []
    scene.traverse( function( node ) {
        if ( (node instanceof THREE.Mesh || node instanceof THREE.Object3D) && node.name != "") {
            mesh_all.push(node);
            let ifc_tag = node.name.split('_')[0];
            node.ifc_tag = ifc_tag;
            let ifc_name = node.name.split('_')[1];
            node.ifc_name = ifc_name;
            if ( ifc_tag != "" && ifc_tag.charAt(0) != "$" && ifc_tag != "mesh" && ifc_tag != "IfcBuildingStorey")
            {
                if ( !ifc_building_elements.some(obj => obj.ifc_tag === ifc_tag
                    )){
                    let ifc_building_element = new THREE.Object3D();
                    ifc_building_element.ifc_tag = ifc_tag;
                    ifc_building_element.name = ifc_tag;
                    ifc_building_element.ifc_name = ifc_name;
                    ifc_building_element.visible_order = true;
                    ifc_building_element.children.push(node);
                    ifc_building_elements.push(ifc_building_element);
                }
                else{
                    let ifc_building_element = ifc_building_elements.find(obj => obj.ifc_tag === ifc_tag );
                    ifc_building_element.children.push(node);
                };
            };
        }
    });
    return ifc_building_elements;
}

function populate_gui_floors(floors){
    let gui_floor_folder = gui.addFolder('Floors');
    for (i = floors.length - 1; i>=0; i--){
        let floor_name = floors[i].name.split('_')[1];
        gui_floor_folder.add(floors[i], "visible").name(floor_name);
    }
}

function populate_gui_ifc_tags(elements){
    let gui_ifc_tags_folder = gui.addFolder('Ifc Tags');
    elements.forEach(element => {
        let ifc_tag = element.name
        let controller =  gui_ifc_tags_folder.add(element, "visible_order").name(ifc_tag);

        controller.onChange(function(value) {
            if (element.visible_order != element.visible ){
                element.children.forEach(obj =>{
                    obj.visible = element.visible_order;
                })
                element.visible = element.visible_order;
            }
        });
    })
}

function populate_gui_explosion(floors){
    var explosion = {
        z_old:0,
        z_new:0,
        z_delta:0
    };

    let controller =  gui.add(explosion,"z_new",0,100).name("z_explosion");

    controller.onChange( value => {
        explosion.z_delta = explosion.z_new -explosion.z_old;
        floors.forEach((floor,index) => {
            floor.position.z += (explosion.z_delta * index);
        });
        explosion.z_old = explosion.z_new;
        explosion.z_delta=0;
    })
}

function populate_gui_camera(){
    let gui_camera = gui.addFolder('Camera options');
    let new_camera= {type : camera_types[0]}
    let controller = gui_camera.add(new_camera, 'type', camera_types);
    controller.onChange(function(value){
        setup_camera(value,camera);
    });
};

function populate_ifc_tag_gui(){
    gui_intersected =  {ifc_tag:"none",ifc_name:"none"}
    gui.add(gui_intersected,"ifc_tag").listen();
    gui.add(gui_intersected,"ifc_name").listen();
}

function explode_floors(floors){
    explosion.z_delta = explosion.z_new -explosion.z_old
    // TODO: find the floor with most stuff and center the explosion
    // TODO: scale the explosion based on the heiaght of the model
    floors.forEach((floor,index) => {
        floor.position.z += (explosion.z_delta * index);
        // floor.children.forEach((obj,index) =>{
        //     obj.position.x = 0;
        //     obj.position.y = 0;
        // });
    });
    explosion.z_old = explosion.z_new;
    explosion.z_delta=0;
}

raycaster = new THREE.Raycaster();

document.addEventListener( 'click', onDocumentMouseMove, false );
window.addEventListener( 'resize', onWindowResize, false );


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    mouse.updated = true;
}

// const clock = new THREE.Clock( true );

function animate() {
    requestAnimationFrame( animate );

    stats.begin();

    // required if controls.enableDamping or controls.autoRotate are set to true
    // controls.update( clock.getDelta() );
    controls.update();

    render()

	stats.end();
};

function render(){

    if (mouse.updated){
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( mesh_all );
        if ( intersects.length > 0 ) {
            INTERSECTED = intersects[0].object;
            gui_intersected.ifc_tag = INTERSECTED.ifc_tag
            gui_intersected.ifc_name = INTERSECTED.ifc_name
            console.log("OBJ", INTERSECTED)
            console.log("intersects[0]",intersects[0])
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            INTERSECTED.material = material;
            // controls.target.copy(intersects[0].point);
            // :TODO TWEEN the old target to the new (in 0.3 seconds)
        }
        mouse.updated = false;
    };

    renderer.render( scene, camera );
}


animate();