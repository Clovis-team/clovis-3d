/**
 * @author nmanzini / https://www.nicolamanzini.com/
 */


var scene, camera, control, renderer

scene = new THREE.Scene();
scene.background = new THREE.Color( 0xaaaabb );
window.scene = scene

// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// console.log(camera);

// camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// var ratio = window.innerWidth/window.innerHeight;
// var height = 20
// var width = 20 * ratio;
// var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

var camera_types = ["Perspective","Ortographic","Walking"]

// scene.add( camera );

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var mouse = new THREE.Vector2();
var INTERSECTED = {}

// var controls = new THREE.OrbitControls(camera,renderer.domElement);
// controls.enableDamping = true;
// controls.screenSpacePanning = true;
// controls.panSpeed = 0.3;
// controls.rotateSpeed = 0.2;
// controls.target.set(80, 0, 20);


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

    let new_controls = new THREE.OrbitControls(new_camera,renderer.domElement);
    if (typeof controls != "undefined") {
        new_controls.target.copy(controls.target);
    }else{
        new_controls.target.set(80, 0, 20);
    }
    new_controls.enableDamping = true;
    new_controls.screenSpacePanning = true;
    new_controls.panSpeed = 0.3;
    new_controls.rotateSpeed = 0.2;
    
    controls = new_controls;
    console.log(controls);
    console.log(camera)
    
}

// camera.position.set(80, 0, 20);
// var controls = new THREE.FirstPersonControls(camera);
// camera.constrainVertical = true;
// controls.lookSpeed = 0.5;
// controls.movementSpeed = 10;



var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
scene.add( directionalLight );

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );



var gui = new dat.GUI();
// creating gui folders


let gui_camera = gui.addFolder('Camera options');
let new_camera= {type : camera_types[0]}
let controller = gui_camera.add(new_camera, 'type', camera_types);
controller.onChange(function(value) {
    setup_camera(value,camera);
    }
);





let gui_intersected =  {ifc_tag:"none",ifc_name:"none"}
gui.add(gui_intersected,"ifc_tag").listen();
gui.add(gui_intersected,"ifc_name").listen();

console.log(gui);


var building_main = {}
var floors = {}
let ifc_building_elements = [];
// ifc_building_elements is an array of objects3d
// each object has as child all the meshes and objs
//  of a certain building element (wall, slab...)
var mesh_all = [];

var loader = new THREE.GLTFLoader();

var t0 = performance.now();
// Load a glTF resource
loader.load(
    // resource URL
    'gltfs/15-assimp.gltf',
    // 'gltfs/Project1-assimp.gltf',
    // called when the resource is loaded
    function ( gltf ) {
        // scene.add( gltf.scene );
        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Scene   
        // gltf.scenes; // Array<THREE.Scene>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object
        // var t0 = performance.now();
        var t1 = performance.now();
        console.log("load gltf took " + Math.round(t1 - t0) + " milliseconds.")
        scene.add(gltf.scene);
        building = (gltf.scene.children[0].children[0].children[0].children[0]);
        floors = building.children;
        populate_gui_floors(floors);
        
        ifc_building_elements = get_building_elements(building);
        populate_gui_ifc_tags(ifc_building_elements);
        populate_gui_explosion(floors);
        var t2 = performance.now();
        console.log("load and name all groups " + Math.round(t2 - t1) + " milliseconds.")
        console.log(ifc_building_elements)
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

function explode_floors(floors){
    explosion.z_delta = explosion.z_new -explosion.z_old

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

document.addEventListener( 'mouseup', onDocumentMouseMove, false );
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
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            INTERSECTED.material = material;
        }
        mouse.updated = false;
    };

    renderer.render( scene, camera );
}


animate();