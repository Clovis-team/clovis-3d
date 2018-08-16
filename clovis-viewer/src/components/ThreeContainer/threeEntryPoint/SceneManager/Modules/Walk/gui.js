
const populateGuiWalking = (self, datgui, camera, controls) => {
    const walkingUI = datgui.addFolder('walking UI');

    walkingUI.add(self, 'enabled');
    walkingUI.add(self, 'movementSpeed', 0, 20);
    walkingUI.add(self, 'yMovements');
    const walkControls = walkingUI.add(self, 'walkingSwitch');

    walkControls.onChange((bool) => {
        const newTargetPosition = new THREE.Vector3();
        camera.getWorldDirection(newTargetPosition);
        newTargetPosition.normalize();
        walkSwitch(bool, newTargetPosition);
    });

    const walkSwitch = (isWalk, newTargetPosition) => {
        console.log();
        if (isWalk) {
            newTargetPosition.multiplyScalar(0.1);
        } else {
            newTargetPosition.multiplyScalar(100);
        }
        controls.target.copy(newTargetPosition.add(camera.position));
    };

    return walkingUI;
};

// const removeGuiFolder = (gui, folder) => {
//     gui.removeFolder(folder);
// };

export default populateGuiWalking;
