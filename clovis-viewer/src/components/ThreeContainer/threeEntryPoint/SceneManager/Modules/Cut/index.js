function convertToDoubleSided(object) {
    if (object.material) {
        object.material.side = THREE.DoubleSide;
    }
}

function convertToSingleSided(object) {
    if (object.material) {
        object.material.side = 0;
    }
}

function Cut({
    renderer, controls, canvas, buildingDatas,
}) {
    const cutMethods = {};

    const mouse = new THREE.Vector2();

    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 5);

    const makeVisiblePlane = ({ x, z }) => {
        const planeGeom = new THREE.PlaneGeometry(x, z, 32);
        planeGeom.rotateX(Math.PI / 2);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xf64747, side: THREE.DoubleSide, opacity: 0.2, transparent: true,
        });
        const planeMesh = new THREE.Mesh(planeGeom, planeMaterial);
        return (planeMesh);
    };

    let visiblePlane = makeVisiblePlane(1, 1);

    let planeExist = false;

    const edgedPlane = new THREE.Group();


    cutMethods.start = () => {
        if (controls) {
            controls.enabled = false;
        }

        if (!planeExist) {
            console.log(buildingDatas.building);
            buildingDatas.building.traverse(convertToDoubleSided);

            visiblePlane = makeVisiblePlane(buildingDatas.size);

            const edges = new THREE.EdgesGeometry(visiblePlane.geometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xf64747 }));

            edgedPlane.add(line);
            edgedPlane.add(visiblePlane);
            scene.add(edgedPlane);

            edgedPlane.position.copy(buildingDatas.center);
            edgedPlane.position.y = clippingPlane.constant - 0.001;

            planeExist = true;
        }
        edgedPlane.visible = true;

        renderer.clippingPlanes = [clippingPlane];
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
        edgedPlane.position.y = clippingPlane.constant - 0.001;
        canvas.addEventListener('mouseup', onCanvasMouseUp, false);
    };

    const onCanvasMouseUp = (event) => {
        canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
        canvas.removeEventListener('mouseup', onCanvasMouseUp, false);
        edgedPlane.visible = false;
        console.log('done');
        if (controls) {
            controls.enabled = true;
        }
    };

    const destroy = () => {
        buildingDatas.building.traverse(convertToSingleSided);
    };


    window.gui.add(cutMethods, 'start');
}


export default Cut;
