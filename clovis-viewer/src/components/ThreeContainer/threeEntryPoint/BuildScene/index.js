import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/objects/Sky';
import loadBuilding from './loadBuilding';


import { fillBuildingDatas, positionCameraToBuilding } from './analyseBuilding';
import { asynchronous_gltf_loader_gui_populate } from '../DevTools/utils';

function BuildScene(canvas, buildingGltfPath) {
    let buildingDatas = {};

    const getBuildingDatas = () => buildingDatas;
    /**
     * create a THREE scene, the database of all 3d objects and lights
     *
     * @returns new scene
     */
    function buildScene(renderer) {
        const new_scene = new THREE.Scene();
        // flamingo(new_scene);
        initSky(new_scene, renderer, camera);
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x777788, 1);
        new_scene.add(hemisphereLight);
        return new_scene;
    }

    /**
     * create the frame where THREE will render into
     * set sizes and ratio of pixels
     * gamma setting for balancing the birghtness
     * @param {*} { width, height } of the canvas that we render into
     * @returns new renderer
     */
    function buildRenderer({ width, height }) {
        const new_renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;

        new_renderer.setPixelRatio(DPR);
        new_renderer.setSize(width, height);

        new_renderer.gammaInput = true;
        new_renderer.gammaOutput = true;

        new_renderer.shadowMap.enabled = true;

        return new_renderer;
    }

    /*
    * creates a perspective camera in THREE
    *
    * @param {*} { width, height } to calculate its proportions
    * @returns new camera
    */
    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 75;
        const nearPlane = 0.2;
        const farPlane = 1000;
        const new_camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane,
        );
        new_camera.position.z = 40;
        return new_camera;
    }

    /*
    * loads Orbitcontrols and configure it for our visualizer
    *
    * @param {*} controls_camera the camera tha he is going to move
    * @param {*} controls_renderer the renderer frame he has to lsiten too
    * @returns the new controls
    */
    function buildControls(controls_camera, controls_renderer) {
        const new_controls = new THREE.OrbitControls(controls_camera, controls_renderer.domElement);
        new_controls.enableDamping = true;
        new_controls.screenSpacePanning = true;
        new_controls.panSpeed = 0.3;
        new_controls.rotateSpeed = 0.2;
        new_controls.update();
        return new_controls;
    }

    /**
     * callback from when the gltf file is loaded
     */
    function gltfLoadedCallback(building, gltf) {
        positionCameraToBuilding(gltf, controls, camera);
        // buildingDatas = fillBuildingDatas(building, buildingDatas);
        buildingDatas = fillBuildingDatas(building, gltf, buildingDatas);

        asynchronous_gltf_loader_gui_populate(buildingDatas);
    }

    // BUILD STUFF

    const renderer = buildRenderer(canvas);
    const camera = buildCamera(canvas);
    const scene = buildScene(renderer);
    const controls = buildControls(camera, renderer);

    // buildCameraAndControls();

    loadBuilding(
        scene,
        buildingGltfPath,
        gltfLoadedCallback,
    );

    return {
        scene,
        renderer,
        getBuildingDatas,
        camera,
        controls,
        buildingDatas,
    };
}

function shadow(object) {
    if (object.type === 'Mesh') {
        console.log(object);
        object.castShadow = true;
        object.receiveShadow = true;
    }
}

function initSky(scene, renderer, camera) {
    const sky = new THREE.Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    // Add Sun Helper
    const sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    sunSphere.position.y = -700000;
    sunSphere.visible = false;
    scene.add(sunSphere);

    const effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.25, // elevation / inclination
        azimuth: 0.25, // Facing front,
        sun: !true,
    };
    const distance = 400000;

    function guiChanged() {
        const uniforms = sky.material.uniforms;
        uniforms.turbidity.value = effectController.turbidity;
        uniforms.rayleigh.value = effectController.rayleigh;
        uniforms.luminance.value = effectController.luminance;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
        const theta = Math.PI * (effectController.inclination - 0.5);
        const phi = 2 * Math.PI * (effectController.azimuth - 0.5);
        sunSphere.position.x = distance * Math.cos(phi);
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
        sunSphere.visible = effectController.sun;
        uniforms.sunPosition.value.copy(sunSphere.position);
        renderer.render(scene, camera);
    }


    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const dir = new THREE.Vector3(1, 2, 0);

    // normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    const origin = new THREE.Vector3(0, 0, 0);
    const length = 1;
    const hex = 0xffff00;

    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    scene.add(arrowHelper);


    guiChanged();
}

function flamingo(scene, camera) {
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, 1, 5000);
    // LIGHTS
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    // const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    // scene.add(hemiLightHelper);
    //
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;
    // dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
    // scene.add(dirLightHeper);
    // GROUND
    const groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });
    groundMat.color.setHSL(0.095, 1, 0.75);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -33;
    scene.add(ground);
    ground.receiveShadow = true;
    // SKYDOME
    const vertexShader = 'varying vec3 vWorldPosition;\
        void main() {\
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\
        vWorldPosition = worldPosition.xyz;\
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
    }';
    const fragmentShader = 'uniform vec3 topColor;\
    uniform vec3 bottomColor;\
    uniform float offset;\
    uniform float exponent;\
    varying vec3 vWorldPosition;\
    void main() {\
        float h = normalize( vWorldPosition + offset ).y;\
        gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );\
    }';
    const uniforms = {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 33 },
        exponent: { value: 0.6 },
    };
    uniforms.topColor.value.copy(hemiLight.color);
    scene.fog.color.copy(uniforms.bottomColor.value);
    const skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        vertexShader, fragmentShader, uniforms, side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
}

function skySphere(scene) {
    const skyGeo = new THREE.SphereGeometry(500, 25, 25);

    const bkgr = {
        sky: 'background/sky.jpg',
        portal2: 'background/portal2.jpg',
    };

    const loader = new THREE.TextureLoader();
    const texture = loader.load(bkgr.portal2);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
    });

    const sky = new THREE.Mesh(skyGeo, material);
    sky.material.side = THREE.BackSide;
    scene.add(sky);
}

export default BuildScene;
