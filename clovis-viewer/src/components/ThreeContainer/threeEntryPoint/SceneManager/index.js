import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/loaders/GLTFLoader';

const SceneManager = (canvas, sceneInit, buildingGltfPath) => {
    /**
     * creates the scene subjects. modular elements meant for plug and play
     * @param {*} scene the main scene as an input for the SUbjects
     * @returns an array of scenes
     */
    function createSceneSubjects(scene) {
        // not yet implemented
        const sceneSubjects = [
            // new GeneralLights(scene),
        ];
        return sceneSubjects;
    }

    /**
     * updates the stuff that has to be updated every cycle
     */
    function update() {
        // update sceneSubjects every cycle
        const elapsedTime = clock.getElapsedTime();
        for (let i = 0; i < sceneSubjects.length; i++) { sceneSubjects[i].update(elapsedTime); }
        // required if controls.enableDamping or controls.autoRotate are set to true
	    // controls.update();
        renderer.render(scene, camera);
    }

    // EVENTS CONTROLLERS

    function onWindowResize() {
        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.width, canvas.height);
    }

    function onMouseMove(x, y) {
        console.log('mouse moved');
    }

    function onKeyPressed(event) {
        // TODO: implement a submodule of walking around;
        const walking_keys = ['w', 'a', 's', 'd'];
        if (walking_keys.indexOf(event.key) > -1) {
            console.log(event);
        }
    }

    // function to be implemented
    function onClose() {
        // gui.destroy();
        // remove stats
        // remove eventual listeners;
    }

    // used for getting time between frames for calculating updates
    const clock = new THREE.Clock();

    const {
        scene,
        camera,
        renderer,
        controls,
    } = sceneInit;

    const sceneSubjects = createSceneSubjects(scene);


    return {
        update,
        onWindowResize,
        onMouseMove,
        onKeyPressed,
        onClose,
    };
};

export default SceneManager;
