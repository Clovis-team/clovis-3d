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

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

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

var building_mesh = null;

var mtlLoader = new THREE.MTLLoader();
mtlLoader.load( 'objs/15.mtl', function( materials ) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.load( 'objs/15.obj', function ( object ) {

        building_mesh = object;
        scene.add( building_mesh );
        console.log(building_mesh)
    } );
} );

controls.update();

var animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update();

    renderer.render( scene, camera );
};

animate();