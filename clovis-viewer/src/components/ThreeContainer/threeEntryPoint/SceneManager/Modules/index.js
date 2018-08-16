import Walk from './Walk';
import Select from './Select';
import Cut from './Cut';

const Modules = ({
    scene,
    renderer,
    camera,
    controls,
    buildingDatas,
}) => {
    const walkModule = new Walk(scene, camera, controls);
    const selectModule = new Select(scene, camera, buildingDatas);
    const cutModule = new Cut(renderer);

    /**
     * creates the modulesArray. modular elements meant for plug and play
     * @returns an array of scenes
     */
    function createModules() {
        const modulesArray = [
            walkModule,
            // selectingModule,
        ];
        return modulesArray;
    }

    return createModules();
};

export default Modules;
