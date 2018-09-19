import Walk from './Walk';
import Select from './Select';
import HorizontalSection from './Cut';
import Explosion from './Explosion';
import Label from './Label';

const Modules = (InitializedScene, canvas) => {
    const {
        // scene,
        // renderer,
        // camera,
        // controls,
        // buildingDatas,
        ViewerOptions,
    } = InitializedScene;
    const modulesObject = {};
    const modulesArray = [];

    InitializedScene.canvas = canvas;
    InitializedScene.modulesObject = modulesObject;

    const bindingModules = {
        Walk,
        Select,
        HorizontalSection,
        Explosion,
        Label,
    };

    Object.keys(ViewerOptions.Modules).forEach((element) => {
        if (ViewerOptions.Modules[element].active === true) {
            const object = new bindingModules[element](InitializedScene);
            modulesObject[element] = object;
            if (object.update) {
                modulesArray.push(object);
            }
        }
    });

    // TODO: add performance monitor of every module

    return { modulesObject, modulesArray };
};

export default Modules;
