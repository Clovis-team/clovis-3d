function Cut({
    renderer, controls, canvas, buildingDatas,
}) {
    const cutMethods = {};

    const mouse = new THREE.Vector2();

    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 5);

    const makeVisiblePlane = () => {
        const planeGeom = new THREE.PlaneGeometry(1, 1, 32);
        planeGeom.rotateX(Math.PI / 2);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00, side: THREE.DoubleSide, opacity: 0.1, transparent: true,
        });
        const planeMesh = new THREE.Mesh(planeGeom, planeMaterial);
        scene.add(planeMesh);
        return (planeMesh);
    };

    const visiblePlane = makeVisiblePlane();


    cutMethods.start = () => {
        if (controls) {
            controls.enabled = false;
        }

        scene.add(visiblePlane);

        visiblePlane.scale.copy(buildingDatas.size);
        visiblePlane.position.copy(buildingDatas.center);

        renderer.clippingPlanes = [clippingPlane];
        window.gui.add(clippingPlane, 'constant', 0, 20);
        canvas.addEventListener('mousedown', onCanvasMouseDown, false);
    };

    const onCanvasMouseDown = (event) => {
        console.log(event);
        mouse.prev_y = -(event.clientY / window.innerHeight) * 2 + 1;
        canvas.removeEventListener('mousedown', onCanvasMouseDown, false);
        canvas.addEventListener('mousemove', onCanvasMouseMove, false);
    };

    const onCanvasMouseMove = (event) => {
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        const delta = mouse.y - mouse.prev_y;
        mouse.prev_y = mouse.y;
        clippingPlane.constant += delta * buildingDatas.size.y;
        visiblePlane.position.y = clippingPlane.constant - 0.01;
        canvas.addEventListener('mouseup', onCanvasMouseUp, false);
    };

    const onCanvasMouseUp = (event) => {
        canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
        canvas.removeEventListener('mouseup', onCanvasMouseUp, false);
        console.log('done');
        if (controls) {
            controls.enabled = true;
        }
    };


    window.gui.add(cutMethods, 'start');
}


export default Cut;
