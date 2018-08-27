import Modules from './Modules';

const SceneManager = (canvas, InitializedScene, ViewerOptions) => {
    const {
        scene,
        renderer,
        camera,
        controls,
    } = InitializedScene;

    // used to handle time beween updates
    const clock = new THREE.Clock();

    // sceneSubjects, now called modulesArray
    const { modulesObject, modulesArray } = Modules(InitializedScene, canvas, ViewerOptions);

    /**
     * updates the stuff that has to be updated every frame cycle
     * (This function is launched many times per second)
     */
    function update() {
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

    return {
        update,
        modulesArray,
        modulesObject,
        resizeCanvas,
        getCamera,
        getScene,
        getRenderer,
    };
};

export default SceneManager;
