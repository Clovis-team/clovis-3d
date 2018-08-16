import MenuAndButtons from './MenuAndButtons';


import Modules from './Modules';

// import 'three/examples/js/loaders/GLTFLoader';
// import 'three/examples/js/controls/OrbitControls';


const SceneManager = (canvas, InitializedScene) => {
    const {
        scene,
        renderer,
        camera,
        controls,
        buildingDatas,
    } = InitializedScene;

    // used to handle time beween updates
    const clock = new THREE.Clock();

    // sceneSubjects, now called modulesArray
    const modulesArray = Modules(InitializedScene);

    /**
     * updates the stuff that has to be updated every frame cycle
     * (This function is launched many times per second)
     */
    function update(rendererStats) {
        // For the RendereStats Frame/s tool
        rendererStats.update(renderer);

        // update sceneSubjects every cycle
        const elapsedTime = clock.getElapsedTime();
        for (let i = 0; i < modulesArray.length; i += 1) {
            modulesArray[i].update(elapsedTime);
        }
        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();
        // controls.update(clock.getDelta());
        renderer.render(scene, camera);
    }

    /**
     * when a resize event happens, the controlle triggerrs also this,
     * why? so it can change the threejs variable camera and renderer
     */
    function resizeCanvas() {
        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.width, canvas.height);
    }

    function getCamera() {
        return camera;
    }

    function getScene() {
        return scene;
    }

    function getRenderer() {
        return renderer;
    }

    MenuAndButtons();

    return {
        update,
        modulesArray,
        resizeCanvas,
        getCamera,
        getScene,
        getRenderer,
    };
};

export default SceneManager;
