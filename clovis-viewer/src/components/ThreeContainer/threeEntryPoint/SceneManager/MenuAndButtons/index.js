/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */
import {
    loadGui,
    populate_gui_camera,
    populate_height_gui,
    populate_gui_floors,
} from './utils';


const MenuAndButtons = (canvas, InitializedScene, Cameras) => {
    const {
        scene,
        getSceneCamera,
        renderer,
        getSceneControls,
        modifySceneCamera,
        modifySceneControls,
        cameraTypes,
        starting_camera_type,
        getBuildingDatas,
    } = InitializedScene;

    console.log('>>> InitializedScene :', InitializedScene);


    const { change_camera_and_controls } = Cameras;
    const buildingDatas = getBuildingDatas();

    console.log('>>>>>> buildingDatas :', buildingDatas);

    // Initialize dat.gui menu
    const gui = loadGui({ autoPlace: false });

    // Populate Gui cameras menu
    populate_gui_camera(
        gui,
        getSceneCamera,
        getSceneControls,
        cameraTypes,
        starting_camera_type,
        renderer,
        change_camera_and_controls,
        modifySceneCamera,
        modifySceneControls,
    );
    // TODO: explain this part
    populate_height_gui(gui, getSceneCamera);
    // Gui floors selection
    populate_gui_floors(gui, buildingDatas.floors);

    return {
        gui,
    };
};


export default MenuAndButtons;
