function GoTo({ camera, controls }) {
    this.movementSpeed = 10; // units per second

    this.running = false;

    // speed vector allocated once outside lop for efficency
    const speedVector = new THREE.Vector3();

    const cameraDir = new THREE.Vector3();
    const cameraDest = new THREE.Vector3();

    const controlsDir = new THREE.Vector3();
    const controlsDest = new THREE.Vector3();

    this.start = (caDest, coDest) => {
        cameraDest.copy(caDest);
        controlsDest.copy(coDest);

        cameraDir.subVectors(cameraDest, camera.position).normalize();
        controlsDir.subVectors(controlsDest, controls.target).normalize();
        this.running = true;
    };


    this.update = (delta) => {
        if (this.running) {
            const speed = delta * this.movementSpeed;
            animate(camera.position, cameraDir, speed, speedVector);
            animate(controls.target, controlsDir, speed, speedVector);
        }
    };

    const cam = new THREE.Vector3(10, 10, 10);
    const ctrl = new THREE.Vector3();

    this.start(cam, ctrl);
}

function animate(point, direction, speed, speedVector) {
    speedVector.copy(direction);
    speedVector.multiplyScalar(speed);
    point.addVectors(point, speedVector);
}

export default GoTo;
