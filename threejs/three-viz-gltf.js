var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xaaaabb );

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera );

controls.enableDamping = true;
controls.screenSpacePanning = true;
controls.panSpeed = 0.3;
controls.rotateSpeed = 0.2;
controls.target.set(80, 0, 20);

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
console.log(directionalLight);
directionalLight.position= THREE.Vector3(0,-10,10);
scene.add( directionalLight );



var loader = new THREE.GLTFLoader();

var building_main = {}
var floors = {}

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
        console.log(floors);
        populate_gui_floors(floors);

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
        console.log(i,floors[i]);
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

controls.update();

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render()
};

function render(){
    if (floors.length){
        explode_floors(floors)
    };
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
}
animate();