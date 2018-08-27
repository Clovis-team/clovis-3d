import Walk from './Walk';
import Select from './Select';
import HorizontalSection from './Cut';
import Explosion from './Explosion';
import Label from './Label';

const Modules = (InitializedScene, canvas) => {
    const {
        scene,
        renderer,
        camera,
        controls,
        buildingDatas,
        ViewerOptions,
    } = InitializedScene;

    InitializedScene.canvas = canvas;

    const bindingModules = {
        Walk,
        Select,
        HorizontalSection,
        Explosion,
        Label,
    };

    const modulesObject = {};
    const modulesArray = [];

    Object.keys(ViewerOptions.Modules).forEach((element) => {
        if (ViewerOptions.Modules[element].active === true) {
            const object = new bindingModules[element](InitializedScene);
            modulesObject[element] = object;
            if (object.update) {
                modulesArray.push(object);
            }
        }
    });


    return { modulesObject, modulesArray };
};

export default Modules;
