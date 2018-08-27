import 'three/examples/js/objects/Sky';

export function initSky(scene, dev) {
    const sky = new THREE.Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x777788, 0.3);
    new_scene.add(hemisphereLight);


    const effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.25, // elevation / inclination
        azimuth: 0.25, // Facing front,
    };
    populateDevGui(effectController, guiChanged);
    const devSphere = getDevSphere(scene, dev);


    const dir = new THREE.Vector3();
    alignVectorToSun(dir, effectController);


    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.7);
    directionalLight.position.y = 0;
    scene.add(directionalLight);

    const target = new THREE.Object3D();
    target.position.copy(dir);
    scene.add(target);
    directionalLight.target = target;


    guiChanged();

    function guiChanged() {
        const uniforms = sky.material.uniforms;
        uniforms.turbidity.value = effectController.turbidity;
        uniforms.rayleigh.value = effectController.rayleigh;
        uniforms.luminance.value = effectController.luminance;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

        alignVectorToSun(dir, effectController);
        uniforms.sunPosition.value.copy(dir);

        if (dir.y > 0.5) {
            directionalLight.color.g = 1;
            directionalLight.color.b = 1;
        } else {
            directionalLight.color.g = 0.5 + dir.y;
            directionalLight.color.b = 0.5 + dir.y;
        }

        target.position.copy(dir.negate());
        if (dev) {
            devSphere.position.copy(dir.negate().multiplyScalar(3));
        }
    }
}

function getDevSphere(scene, dev) {
    if (dev) {
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        // moving
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // static
        const geometry2 = new THREE.SphereGeometry(0.5, 32, 32);
        const material2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sphereStatic = new THREE.Mesh(geometry2, material2);
        scene.add(sphereStatic);
        return sphere;
    }
    return null;
}

function alignVectorToSun(dir, effectController) {
    const length = 1;
    const theta = Math.PI * (effectController.inclination - 0.5);
    const phi = 2 * Math.PI * (effectController.azimuth - 0.5);

    dir.x = length * Math.cos(phi);
    dir.y = length * Math.sin(phi) * Math.sin(theta);
    dir.z = length * Math.sin(phi) * Math.cos(theta);
}

function populateDevGui(effectController, guiChanged) {
    const gui = window.gui.addFolder('sky');
    gui.add(effectController, 'turbidity', 1.0, 20.0, 0.1).onChange(guiChanged);
    gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
    gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
    gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
    gui.add(effectController, 'luminance', 0.0, 2).onChange(guiChanged);
    gui.add(effectController, 'inclination', -0.5, 0.5, 0.0001).onChange(guiChanged);
    gui.add(effectController, 'azimuth', 0, 0.5, 0.0001).onChange(guiChanged);
}

export function flamingo(scene, camera) {
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, 1, 5000);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    scene.add(hemiLightHelper);
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
    const dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
    scene.add(dirLightHeper);

    // GROUND;


    const groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });


    groundMat.color.setHex(0x9dce58);


    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -100;
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
