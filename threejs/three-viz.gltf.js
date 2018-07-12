function getCenterPoint(mesh) {
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();   
    center = geometry.boundingBox.getCenter();
    mesh.localToWorld( center );
    return center;
}

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xaaaabb );

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );




var controls = new THREE.OrbitControls( camera );

controls.enableDamping = true;
controls.screenSpacePanning = true;
controls.panSpeed = 0.3;
controls.rotateSpeed = 0.2;
controls.target.set(50,0,10);


var loader = new THREE.GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
// THREE.DRACOLoader.setDecoderPath( '/examples/js/libs/draco' );
// loader.setDRACOLoader( new THREE.DRACOLoader() );

// Load a glTF resource
loader.load(
    // resource URL
    'gltfs/15-assimp.gltf',
    // called when the resource is loaded
    function ( gltf ) {

        scene.add( gltf.scene );

        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Scene
        // gltf.scenes; // Array<THREE.Scene>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object
        console.log (gltf);
        console.log (scene);

    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);


controls.update();




console.log("controls",controls);

var animate = function () {
    requestAnimationFrame( animate );

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    controls.update();

    renderer.render( scene, camera );
};

animate();