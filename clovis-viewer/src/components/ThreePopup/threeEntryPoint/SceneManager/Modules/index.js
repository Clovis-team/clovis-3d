import Walk from './Walk';
import Select from './Select';
import Cut from './Cut';
import Explosion from './Explosion';

const Modules = (InitializedScene, canvas) => {
    const {
        scene,
        renderer,
        camera,
        controls,
        buildingDatas,
        ViewerOptions,
    } = InitializedScene;

    const walkModule = new Walk(scene, camera, controls);
    const selectModule = new Select({
        scene, camera, buildingDatas, canvas, ViewerOptions,
    });
    const cutModule = new Cut({
        renderer, controls, canvas, buildingDatas, scene,
    });
    const explosionModule = new Explosion({ buildingDatas });

    const modules = {
        walk: walkModule,
        select: selectModule,
        cut: cutModule,
        explosion: explosionModule,
    };

    /**
     * creates the modulesArray. modular elements meant for plug and play
     * @returns an array of scenes
     */
    function createModules() {
        const modulesArray = [
            walkModule,
            selectModule,
        ];
        return modulesArray;
    }
    const modulesArray = createModules();

    return { modules, modulesArray };
};

export default Modules;
