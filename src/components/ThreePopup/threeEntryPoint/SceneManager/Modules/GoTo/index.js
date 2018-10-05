function GoTo({ camera, controls }) {
    this.movementSpeed = 5; // units per second

    this.running = false;

    // speed vector allocated once outside lop for efficency
    const speedVector = new THREE.Vector3();

    const cameraDir = new THREE.Vector3();
    const cameraDest = new THREE.Vector3();

    const controlsDir = new THREE.Vector3();
    const controlsDest = new THREE.Vector3();

    let camSpeed;
    let conSpeed;

    this.start = (caDest, coDest) => {
        cameraDest.copy(caDest);
        controlsDest.copy(coDest);

        cameraDir.subVectors(cameraDest, camera.position);
        controlsDir.subVectors(controlsDest, controls.target);

        cameraDir.normalize();
        controlsDir.normalize();

        this.running = true;
    };

    this.update = (delta) => {
        if (this.running) {
            cameraDir.subVectors(cameraDest, camera.position);
            controlsDir.subVectors(controlsDest, controls.target);
            if (cameraDir.length() > 0.1) {
                camSpeed = delta * this.movementSpeed * cameraDir.length();
                cameraDir.normalize();
                animate(camera.position, cameraDir, camSpeed, speedVector);
            }
            if (controlsDir.length() > 0.1) {
                conSpeed = delta * this.movementSpeed * controlsDir.length();
                controlsDir.normalize();
                animate(controls.target, controlsDir, conSpeed, speedVector);
            }
            if (cameraDir.length() < 0.1 && controlsDir.length() < 0.1) {
                this.running = false;
            }
        }
    };

    const cam = new THREE.Vector3(10, 10, 10);
    const ctrl = new THREE.Vector3();

    this.test = () => {
        this.start(cam, ctrl);
    };

    this.stop = () => {
        this.running = false;
    };

    const guiFolder = window.gui.addFolder('GoTo');
    guiFolder.add(this, 'test');
    guiFolder.add(this, 'stop');
}

function animate(point, direction, speed, speedVector) {
    speedVector.copy(direction);
    speedVector.multiplyScalar(speed);
    point.addVectors(point, speedVector);
}

export default GoTo;
