import virtualJoystick from './VirtualJoystick';
import populateGuiWalking from './gui';

function walk({
    scene, camera, controls, buildingDatas,
}) {
    // if not enabled doesnt move
    this.enabled = true;
    this.movementSpeed = 10; // units per second
    this.yMovements = false;
    this.up = new THREE.Vector3(0, 1, 0);
    this.walkingSwitch = false;
    this.nearObjectWalkingMode = false;
    this.nearObjectWalkingModeEnabled = true;
    // key true or false movements
    const movement = {
        Forward: false,
        Backward: false,
        Left: false,
        Right: false,
        Up: false,
        Down: false,
    };

    const raycaster = new THREE.Raycaster();


    // vector for
    const camVector = new THREE.Vector3();
    const leftRigthVector = new THREE.Vector3();
    const joystickMovementVector = new THREE.Vector3();
    const joystickRiseVector = new THREE.Vector3();

    const distanceToTarget = new THREE.Vector3();

    // for normal keyboards
    const matchWASD = {
        w: 'Forward',
        s: 'Backward',
        a: 'Left',
        d: 'Right',
        r: 'Up',
        f: 'Down',
    };
    // for french keyboards
    const matchESDF = {
        e: 'Forward',
        d: 'Backward',
        s: 'Left',
        f: 'Right',
        t: 'Up',
        g: 'Down',
    };

    const keyDown = (event) => {
        movement[matchWASD[event.key]] = true;
    };

    const keyUp = (event) => {
        movement[matchWASD[event.key]] = false;
    };

    const move = (actualMoveSpeed) => {
        camera.getWorldDirection(camVector);

        leftRigthVector.crossVectors(this.up, camVector).normalize();
        leftRigthVector.multiplyScalar(actualMoveSpeed);

        if (!this.yMovements) {
            camVector.y = 0;
        }

        camVector.normalize();
        camVector.multiplyScalar(actualMoveSpeed);

        const verticalSpeedVector = new THREE.Vector3();
        verticalSpeedVector.copy(this.up);
        verticalSpeedVector.multiplyScalar(actualMoveSpeed);

        if (movement.Forward) {
            camera.position.add(camVector);
            controls.target.add(camVector);
        }
        if (movement.Backward) {
            camera.position.sub(camVector);
            controls.target.sub(camVector);
        }
        if (movement.Left) {
            camera.position.add(leftRigthVector);
            controls.target.add(leftRigthVector);
        }
        if (movement.Right) {
            camera.position.sub(leftRigthVector);
            controls.target.sub(leftRigthVector);
        }
        if (movement.Up) {
            camera.position.add(verticalSpeedVector);
            controls.target.add(verticalSpeedVector);
        }
        if (movement.Down) {
            camera.position.sub(verticalSpeedVector);
            controls.target.sub(verticalSpeedVector);
        }
    };

    const joystickMovement = (movementVector) => {
        const quaternion = new THREE.Quaternion(); // create one and reuse it

        camera.getWorldDirection(camVector);
        camVector.y = 0;
        camVector.normalize();
        const normalizedVector = new THREE.Vector3(0, 0, 1);

        quaternion.setFromUnitVectors(normalizedVector, camVector);

        movementVector.applyQuaternion(quaternion);

        // console.log('camVector', camVector);
        // console.log('movementVector', movementVector);

        joystickMovementVector.copy(movementVector);
    };

    const joystickRising = (risingVector) => {
        joystickRiseVector.copy(risingVector);
    };

    const SpeedVector = new THREE.Vector3();

    const moveByJoystickVector = (actualMoveSpeed) => {
        SpeedVector.copy(joystickMovementVector);
        SpeedVector.multiplyScalar(actualMoveSpeed);
        camera.position.add(SpeedVector);
        controls.target.add(SpeedVector);
    };

    const riseByJoystickVector = (actualMoveSpeed) => {
        SpeedVector.copy(joystickRiseVector);
        SpeedVector.multiplyScalar(actualMoveSpeed);
        camera.position.add(SpeedVector);
        controls.target.add(SpeedVector);
    };


    // EXTERNAL METHODS

    this.destroy = (Dom) => {
        Dom.removeEventListener('keydown', keyDown, false);
        Dom.addEventListener('keyup', keyUp, false);
        removeGuiFolder(window.gui, walkingUI);
    };

    this.update = (delta) => {
        if (this.enabled === false) {
            console.log('movements not enabled');
            return;
        }

        const actualMoveSpeed = delta * this.movementSpeed;

        move(actualMoveSpeed);
        moveByJoystickVector(actualMoveSpeed);
        riseByJoystickVector(actualMoveSpeed);

        if (this.nearObjectWalkingModeEnabled) {
            nearObjectWalkingMode(raycaster, controls, camera, buildingDatas);
        }
    };

    addListener(window, keyDown, keyUp);
    const guiFolder = populateGuiWalking(this, window.gui, camera, controls);
    virtualJoystick(joystickMovement, joystickRising);
}

const nearObjectWalkingMode = (raycaster, controls, camera, buildingDatas) => {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(buildingDatas.mesh_all);
    if (intersects.length) {
        if (intersects[0].distance < 5 && !this.nearObjectWalkingMode) {
            controls.target.copy(camera.position.clone().add(raycaster.ray.direction.multiplyScalar(0.1)));
            this.nearObjectWalkingMode = true;
        }
    }
    if (this.nearObjectWalkingMode && camera.position.distanceTo(controls.target) > 0.11) {
        controls.target.copy(camera.position.clone().add(raycaster.ray.direction.multiplyScalar(20)));
        this.nearObjectWalkingMode = false;
    }
};

const addListener = (Dom, keyDown, keyUp) => {
    Dom.addEventListener('keydown', keyDown, false);
    Dom.addEventListener('keyup', keyUp, false);
};

const removeGuiFolder = (gui, folder) => {
    gui.removeFolder(folder);
};


export default walk;
