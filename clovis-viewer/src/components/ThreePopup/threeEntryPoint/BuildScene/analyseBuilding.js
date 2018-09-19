import { get_building_ifc_elements } from './utils';

const fillBuildingDatas = (building, gltf, buidlingDatas) => {
    buidlingDatas.floors = building.children;
    const floors = building.children;
    const {
        building_ifc_elements,
        mesh_all,
    } = get_building_ifc_elements(building);
    buidlingDatas.building = building;
    buidlingDatas.floors = building.children;
    buidlingDatas.ifc_elements = building_ifc_elements;
    buidlingDatas.mesh_all = mesh_all;
    buidlingDatas.size = getObjectSize(gltf);
    buidlingDatas.center = getObjectCenter(gltf);


    return {
        floors,
        building_ifc_elements,
        mesh_all,
    };
};

const flipXzyToXyz = (vector) => {
    const axis = new THREE.Vector3(1, 0, 0);
    vector.applyAxisAngle(axis, -Math.PI / 2);
};

/**
 * given a object3d returns a vector from origin to the object's BOX center
 *
 * @param {*} object THREEJS object3d
 * @returns THREE.Vector3
 */
const getObjectCenter = (object, flip) => {
    const box = new THREE.Box3().setFromObject(object);
    const centerVector = new THREE.Vector3();
    box.getCenter(centerVector);
    if (flip) {
        flipXzyToXyz(centerVector);
    }
    return centerVector;
};

/**
 * given a object3d returns a vector of the object's BOX size
 *
 * @param {*} object THREEJS object3d
 * @returns THREE.Vector3
 */
const getObjectSize = (object, flip) => {
    const box = new THREE.Box3().setFromObject(object);
    const sizeVector = new THREE.Vector3();
    box.getSize(sizeVector);
    if (flip) {
        flipXzyToXyz(sizeVector);
    }
    return sizeVector;
};

const getObjectmax = (object, flip) => {
    const box = new THREE.Box3().setFromObject(object);
    const maxVector = box.max;
    if (flip) {
        flipXzyToXyz(maxVector);
    }
    return maxVector;
};


/**
 * returns the position the camera based on the center and size of the Object given
 *
 * @param {*} object THREEJS object3d
 * @returns THREE.Vector3
 */
const getCameraPositionBasedOnObject = (object, flip) => {
    const cameraPosition = getObjectCenter(object).add(getObjectSize(object).divideScalar(2));
    if (flip) {
        flipXzyToXyz(cameraPosition);
    }
    return cameraPosition;
};


/**
 * it centers the camera in the right position based on the center and size of the building
*/
function positionCameraToBuilding(object, controls, camera) {
    camera.position.copy(getCameraPositionBasedOnObject(object));
    controls.target.copy(getObjectCenter(object));
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
