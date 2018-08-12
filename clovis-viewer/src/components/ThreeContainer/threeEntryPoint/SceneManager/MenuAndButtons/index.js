/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */
import {
    loadGui,
    populate_gui_cameras,
    populate_height_gui,
    populate_gui_floors,
    populate_gui_ifc_tags,
    populate_gui_explosion,
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

    // Initialize dat.gui menu
    const gui = loadGui({ autoPlace: false });

    // Populate Gui cameras menu
    populate_gui_cameras(
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
    // Gui ifc tags selection
    populate_gui_ifc_tags(gui, buildingDatas.building_ifc_elements);
    // Little explosion interraction with gui
    populate_gui_explosion(gui, buildingDatas.floors);

    return {
        gui,
    };
};


export default MenuAndButtons;
