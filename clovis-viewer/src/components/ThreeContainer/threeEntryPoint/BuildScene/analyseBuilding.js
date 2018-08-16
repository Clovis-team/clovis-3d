import { get_building_ifc_elements } from './utils';

const fillBuildingDatas = (building, buidlingDatas) => {
    buidlingDatas.floors = building.children;
    const floors = building.children;
    const {
        building_ifc_elements,
        mesh_all,
    } = get_building_ifc_elements(building);
    buidlingDatas.building = building;

    buidlingDatas.ifc_elements = building_ifc_elements;
    buidlingDatas.mesh_all = mesh_all;


    return {
        floors,
        building_ifc_elements,
        mesh_all,
    };
};

/**
 * given a object3d returns a vector from origin to the object's BOX center
 *
 * @param {*} object THREEJS object3d
 * @returns THREE.Vector3
 */
const getObjectCenter = (object) => {
    const box = new THREE.Box3().setFromObject(object);
    const centerVector = new THREE.Vector3();
    box.getCenter(centerVector);
    return centerVector;
};

/**
 * given a object3d returns a vector of the object's BOX size
 *
 * @param {*} object THREEJS object3d
 * @returns THREE.Vector3
 */
const getObjectSize = (object) => {
    const box = new THREE.Box3().setFromObject(object);
    const sizeVector = new THREE.Vector3();
    box.getSize(sizeVector);
    return sizeVector;
};

/**
 * returns the position the camera based on the center and size of the Object given
 *
 * @param {*} object THREEJS object3d
 * @returns THREE.Vector3
 */
const getCameraPositionBasedOnObject = (object) => {
    const cameraPosition = getObjectCenter(object).add(getObjectSize(object).divideScalar(2));
    return cameraPosition;
};


/**
 * it centers the camera in the right position based on the center and size of the building
*/
function positionCameraToBuilding(scene, controls, camera) {
    camera.position.copy(getCameraPositionBasedOnObject(scene));
    controls.target.copy(getObjectCenter(scene));
    // controls.update() must be called after any manual changes to the camera's transform
    controls.update();
}


export {
    fillBuildingDatas,
    getObjectCenter,
    getCameraPositionBasedOnObject,
    getObjectSize,
    positionCameraToBuilding,
};
