import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/loaders/GLTFLoader';

import controllers from './controllers';
import cameras from './cameras';

const SceneManager = (canvas, InitializedScene) => {
    const {
        scene, renderer,
    } = InitializedScene;

    // used for getting time between frames for calculating updates
    const clock = new THREE.Clock();


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
     * updates the stuff that has to be updated every frame cycle
     * (This function is launched many times per second)
     */
    function update(stats, getSceneCamera, getSceneControls) {
        const camera = getSceneCamera();
        const controls = getSceneControls();

        // For the Stats Frame/s Tool
        stats.begin();

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update(clock.getDelta());

        // update sceneSubjects every cycle
        const elapsedTime = clock.getElapsedTime();
        for (let i = 0; i < sceneSubjects.length; i++) { sceneSubjects[i].update(elapsedTime); }

        // required if controls.enableDamping or controls.autoRotate are set to true
        // controls.update();
        renderer.render(scene, camera);

        stats.end();
    }


    const sceneSubjects = createSceneSubjects(scene);

    return {
        update,
        controllers,
        cameras,
    };
};

export default SceneManager;
