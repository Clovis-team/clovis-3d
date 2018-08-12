const analyseInit = (buidling) => {
    // TODO: analyze the building here
    // organize info about the building, like main flloors, ifc parts and such

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

export default analyseInit;
export { getObjectCenter, getCameraPositionBasedOnObject };
