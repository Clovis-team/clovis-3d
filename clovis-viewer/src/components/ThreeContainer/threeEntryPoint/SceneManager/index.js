import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/loaders/GLTFLoader';

import Listeners from './Listeners';
import Controllers from './Controllers';
import Cameras from './Cameras';

const SceneManager = (canvas, InitializedScene) => {
    const {
        scene,
        renderer,
    } = InitializedScene;

    // used for getting time between frames for calculating updates
    const clock = new THREE.Clock();
    // Tool to detect collisions with objects
    const raycaster = new THREE.Raycaster();
    // usef to click on object_selected
    const mouse = new THREE.Vector2();
    // The selected Object on Click
    const object_selected = {
        ifc_tag: 'none',
        ifc_name: 'none',
        obj_old: undefined,
        obj_old_material: undefined,
    };


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
    function update(stats, rendererStats, getSceneCamera, getSceneControls, renderer) {
        const camera = getSceneCamera();
        const controls = getSceneControls();

        // For the Stats Frame/s Tool
        stats.begin();
        // For the RendereStats Frame/s tool
        rendererStats.update(renderer);

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

    // Initialize the Window Event Listeners
    Listeners(
        canvas,
        InitializedScene,
        Cameras,
        Controllers,
        mouse,
        object_selected,
        raycaster,
    );


    return {
        update,
        Controllers,
        Cameras,
        mouse,
    };
};

export default SceneManager;
