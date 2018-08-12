function walking(camera, controls) {
    this.enabled = true;

    this.movementSpeed = 10; // units per second
    this.xzMovements = true;
    this.yMovements = true;

    this.up = new THREE.Vector3(0, 1, 0);


    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;

    let t0 = 0;
    let delta = 0;

    const camVector = new THREE.Vector3();
    const verticalVector = new THREE.Vector3();
    const leftRigthVector = new THREE.Vector3();

    const distanceToTarget = new THREE.Vector3();

    function keyDown(event) {
        switch (event.keyCode) {
        case 87: /* W */ moveForward = true; break;
        case 65: /* A */ moveLeft = true; break;
        case 83: /* S */ moveBackward = true; break;
        case 68: /* D */ moveRight = true; break;
        case 82: /* R */ moveUp = true; break;
        case 70: /* F */ moveDown = true; break;
        default: break;
        }
        // this.update(0.1);
    }

    function keyUp(event) {
        switch (event.keyCode) {
        case 87: /* W */ moveForward = false; break;
        case 65: /* A */ moveLeft = false; break;
        case 83: /* S */ moveBackward = false; break;
        case 68: /* D */ moveRight = false; break;
        case 82: /* R */ moveUp = false; break;
        case 70: /* F */ moveDown = false; break;
        default: break;
        }
    }

    this.destroy = (Dom) => {
        Dom.removeEventListener('keydown', keyDown, false);
        Dom.addEventListener('keyup', keyUp, false);
    };

    this.bind = (Dom) => {
        Dom.addEventListener('keydown', keyDown, false);
        Dom.addEventListener('keyup', keyUp, false);
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

        verticalVector.copy(this.up);

        verticalVector.multiplyScalar(actualMoveSpeed);


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
            camera.position.add(verticalVector);
            controls.target.add(verticalVector);
        }
        if (moveDown) {
            camera.position.sub(verticalVector);
            controls.target.sub(verticalVector);
        }
    };

    this.update = (elapsed) => {
        if (this.enabled === false) {
            return;
        }
        delta = elapsed - t0;
        t0 = elapsed;

        const actualMoveSpeed = delta * this.movementSpeed;

        if (this.xzMovements) {
            move(actualMoveSpeed);
        }
    };

    this.bind(window);
}

export default walking;
