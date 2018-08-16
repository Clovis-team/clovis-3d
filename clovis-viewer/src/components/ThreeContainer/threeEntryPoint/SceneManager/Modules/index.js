import Walking from './Walking';
import Selecting from './Selecting';

const Modules = (scene, camera, controls, buildingDatas) => {
    const walkingModule = new Walking(scene, camera, controls);
    const selectingModule = new Selecting(scene, camera, buildingDatas);

    /**
     * creates the modulesArray. modular elements meant for plug and play
     * @returns an array of scenes
     */
    function createModules() {
        const modulesArray = [
            walkingModule,
            // selectingModule,
        ];
        return modulesArray;
    }

    return createModules();
};

export default Modules;
