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


var loader = new THREE.GLTFLoader();

var building_main = {}
var floors = {}
var objects_flat = [];

var explosion = {
    z_old:0,
    z_new:0,
    z_delta:0
};

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
        building_main = (gltf.scene.children[0])
        scene.add(building_main);
        floors = scene.children[2].children[0].children[0].children[0].children
        populate_gui_floors(floors);
        objects_flat = flatten(floors);
        // console.log(objects_flat);
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

var gui = new dat.GUI();
let gui_floor_folder = gui.addFolder('Floors');

function populate_gui_floors(floors){
    for (i = floors.length - 1; i>=0; i--){
        let floor_name = floors[i].name.split('_')[1];
        gui_floor_folder.add(floors[i], "visible").name(floor_name);
    }
}

// let gui_floor_folder = gui.addFolder('Explode');

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
    // console.log ("exploded :", explosion.z)
}

gui.add(explosion,"z_new",0,100).name("z_explosion");

raycaster = new THREE.Raycaster();

// stats = new Stats();
// container.appendChild( stats.dom );
document.addEventListener( 'mouseup', onDocumentMouseMove, false );
window.addEventListener( 'resize', onWindowResize, false );

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render()
};

function render(){
    if (floors.length){
        explode_floors(floors)
    };

    if (mouse.updated){
        console.log("click")
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( objects_flat );
        if ( intersects.length > 0 ) {
            INTERSECTED = intersects[0].object;
            console.log(intersects);

            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            INTERSECTED.material = material;
        }
        mouse.updated = false;
    };

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

controls.update();

animate();