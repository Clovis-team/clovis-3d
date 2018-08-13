function walking(scene, camera, controls) {
    // if not enabled doesnt move
    this.enabled = true;

    this.movementSpeed = 10; // units per second
    this.xzMovements = true; // can be removed, not necessary for now
    this.yMovements = true;
    this.up = new THREE.Vector3(0, 1, 0);
    // rename
    this.walkControls = false;

    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;

    let t0 = 0;
    let delta = 0;

    const camVector = new THREE.Vector3();
    const verticalSpeedVector = new THREE.Vector3();
    const leftRigthVector = new THREE.Vector3();

    const distanceToTarget = new THREE.Vector3();

    function keyDown(event) {
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
    }

    function keyUp(event) {
        switch (event.keyCode) {
        case 69: /* E */ moveForward = false; break;
        case 83: /* S */ moveLeft = false; break;
        case 68: /* D */ moveBackward = false; break;
        case 70: /* F */ moveRight = false; break;
        case 84: /* T */ moveUp = false; break;
        case 71: /* G */ moveDown = false; break;
        default: break;
        }
    }

    const move = (actualMoveSpeed) => {
        camera.getWorldDirection(camVector);

        leftRigthVector.crossVectors(this.up, camVector).normalize();
        leftRigthVector.multiplyScalar(actualMoveSpeed);

        if (!this.yMovements) {
            camVector.y = 0;
        }

        camVector.normalize();
        camVector.multiplyScalar(actualMoveSpeed);

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

    this.update = (elapsed) => {
        if (this.enabled === false) {
            console.log('movements not enabled');
            return;
        }
        delta = elapsed - t0;
        t0 = elapsed;

        const actualMoveSpeed = delta * this.movementSpeed;

        if (this.xzMovements) {
            move(actualMoveSpeed);
        }
    };

    const populateGui = (gui) => {
        const walkingUI = gui.addFolder('walking UI');

        walkingUI.add(this, 'movementSpeed', 0, 20);
        walkingUI.add(this, 'enabled');
        walkingUI.add(this, 'yMovements');
        const walkControls = walkingUI.add(this, 'walkControls');

        walkControls.onChange((bool) => {
            walkSwitch(bool);
        });
        return walkingUI;
    };

    this.addListener = (Dom) => {
        Dom.addEventListener('keydown', keyDown, false);
        Dom.addEventListener('keyup', keyUp, false);
    };

    const removeGuiFolder = (gui, folder) => {
        gui.removeFolder(folder);
    };

    this.destroy = (Dom) => {
        Dom.removeEventListener('keydown', keyDown, false);
        Dom.addEventListener('keyup', keyUp, false);
        removeGuiFolder(window.gui, walkingUI);
    };

    const walkSwitch = (isWalk) => {
        const newTargetPosition = new THREE.Vector3();
        camera.getWorldDirection(newTargetPosition);
        console.log(newTargetPosition);
        newTargetPosition.normalize();
        if (isWalk) {
            newTargetPosition.multiplyScalar(0.1);
        } else {
            newTargetPosition.multiplyScalar(100);
        }

        controls.target.copy(newTargetPosition.add(camera.position));
    };


    this.addListener(window);
    const walkingUI = populateGui(window.gui);
}

export default walking;
