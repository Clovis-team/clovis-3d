var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xaaaabb );
window.scene = scene

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var mouse = new THREE.Vector2();
var INTERSECTED

var controls = new THREE.OrbitControls( camera );
controls.enableDamping = true;
controls.screenSpacePanning = true;
controls.panSpeed = 0.3;
controls.rotateSpeed = 0.2;
controls.target.set(80, 0, 20);

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
scene.add( directionalLight );

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

var gui = new dat.GUI();
let gui_floor_folder = gui.addFolder('Floors');
var explosion = {
    z_old:0,
    z_new:0,
    z_delta:0
};
gui.add(explosion,"z_new",0,100).name("z_explosion");
let gui_ifc_tags_folder = gui.addFolder('Ifc Tags');

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
        ifc_building_elements = get_building_elements(scene);
        populate_gui_ifc_tags(ifc_building_elements);
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
    ifc_building_elements.exist = true;
    scene.traverse( function( node ) {
        if ( (node instanceof THREE.Mesh || node instanceof THREE.Object3D) && node.name != "") {
            mesh_all.push(node);
            let ifc_tag = node.name.split('_')[0];
            node.ifc_tag = ifc_tag;
            let ifc_name = node.name.split('_')[1];
            node.ifc_name = ifc_name;
            if ( ifc_tag != "" && ifc_tag.charAt(0) != "$" && ifc_tag != "mesh")
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
    for (i = floors.length - 1; i>=0; i--){
        let floor_name = floors[i].name.split('_')[1];
        gui_floor_folder.add(floors[i], "visible").name(floor_name);
    }
}

function populate_gui_ifc_tags(elements){
    elements.forEach(element => {
        let ifc_tag = element.name;
        gui_ifc_tags_folder.add(element, "visible_order").name(ifc_tag);

    })
    // for (i = elements.length - 1; i>=0; i--){
    //     let ifc_tag = elements[i].name;
    //     gui_ifc_tags_folder.add(elements[i], "visible_order").name(ifc_tag);
    // }
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

function animate() {
    requestAnimationFrame( animate );

    stats.begin();

    controls.update();
    render()

	stats.end();
};

function render(){
    if (floors.length){
        explode_floors(floors)
    };

    if (mouse.updated){
        console.log("click")
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( mesh_all );
        if ( intersects.length > 0 ) {
            INTERSECTED = intersects[0].object;
            console.log("OBJ", INTERSECTED)
            console.log("PAR 1", INTERSECTED.parent)
            console.log("PAR 2", INTERSECTED.parent.parent)
            console.log("PAR 3", INTERSECTED.parent.parent.parent)
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            INTERSECTED.material = material;
        }
        mouse.updated = false;
    };

    if (ifc_building_elements.exist){
        ifc_building_elements.forEach(element => {
            if (element.visible_order != element.visible ){
                element.children.forEach(obj =>{
                    obj.visible = element.visible_order;
                })
                element.visible = element.visible_order;
            }
        })
    }

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
}

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

function flatten(items) {
    const flat = [];
  
    items.forEach(item => {
      if (Array.isArray(item.children)) {
        flat.push(...item.children);
      };
    });
  
    return flat;
  }

// controls.update();

animate();