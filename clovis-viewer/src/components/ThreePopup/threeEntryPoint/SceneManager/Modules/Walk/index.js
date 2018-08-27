import virtualJoystick from './VirtualJoystick';
import populateGuiWalking from './gui';

function walk({ scene, camera, controls }) {
    // if not enabled doesnt move
    this.enabled = true;
    this.movementSpeed = 10; // units per second
    this.yMovements = true;
    this.up = new THREE.Vector3(0, 1, 0);
    this.walkingSwitch = false;
    // key true or false movements
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;
    // time stuff
    let t0 = 0;
    let delta = 0;

    // vector for
    const camVector = new THREE.Vector3();
    const leftRigthVector = new THREE.Vector3();
    const joystickMovementVector = new THREE.Vector3();
    const distanceToTarget = new THREE.Vector3();

    const keyDown = (event) => {
        switch (event.keyCode) {
        case 69: /* E */ moveForward = true; break;
        case 83: /* S */ moveLeft = true; break;
        case 68: /* D */ moveBackward = true; break;
        case 70: /* F */ moveRight = true; break;
        case 84: /* T */ moveUp = true; break;
        case 71: /* G */ moveDown = true; break;
        default: break;
        }
        // move(1);
    };

    const keyUp = (event) => {
        switch (event.keyCode) {
        case 69: /* E */ moveForward = false; break;
        case 83: /* S */ moveLeft = false; break;
        case 68: /* D */ moveBackward = false; break;
        case 70: /* F */ moveRight = false; break;
        case 84: /* T */ moveUp = false; break;
        case 71: /* G */ moveDown = false; break;
        default: break;
        }
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

        if (moveForward) {
            camera.position.add(camVector);
            controls.target.add(camVector);
        }
        if (moveBackward) {
            camera.position.sub(camVector);
            controls.target.sub(camVector);
        }
        if (moveLeft) {
            camera.position.add(leftRigthVector);
            controls.target.add(leftRigthVector);
        }
        if (moveRight) {
            camera.position.sub(leftRigthVector);
            controls.target.sub(leftRigthVector);
        }
        if (moveUp) {
            camera.position.add(verticalSpeedVector);
            controls.target.add(verticalSpeedVector);
        }
        if (moveDown) {
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

    const moveByJoystickVector = (actualMoveSpeed) => {
        const SpeedVector = new THREE.Vector3();
        SpeedVector.copy(joystickMovementVector);
        SpeedVector.multiplyScalar(actualMoveSpeed);
        camera.position.add(SpeedVector);
        controls.target.add(SpeedVector);
    };

    const addListener = (Dom) => {
        Dom.addEventListener('keydown', keyDown, false);
        Dom.addEventListener('keyup', keyUp, false);
    };

    const removeGuiFolder = (gui, folder) => {
        gui.removeFolder(folder);
    };

    // EXTERNAL METHODS

    this.destroy = (Dom) => {
        Dom.removeEventListener('keydown', keyDown, false);
        Dom.addEventListener('keyup', keyUp, false);
        removeGuiFolder(window.gui, walkingUI);
    };

    this.update = (elapsed) => {
        if (this.enabled === false) {
            console.log('movements not enabled');
            return;
        }
        delta = elapsed - t0;
        t0 = elapsed;

        const actualMoveSpeed = delta * this.movementSpeed;

        move(actualMoveSpeed);
        moveByJoystickVector(actualMoveSpeed);
    };

    addListener(window);
    const guiFolder = populateGuiWalking(this, window.gui, camera, controls);
    virtualJoystick(joystickMovement);
}

export default walk;
