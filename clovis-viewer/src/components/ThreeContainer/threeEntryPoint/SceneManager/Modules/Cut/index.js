
function Cut({
    renderer, controls, canvas, buildingDatas, scene,
}) {
    const plane = {
        clipping: new THREE.Plane(new THREE.Vector3(0, -1, 0), 2),
        edged: new THREE.Group(),
    };

    const mouse = { y: 0, y_prev: 0 };

    this.planeExist = false;

    const ButtonsContainer = document.getElementById('three-clovis-buttons-container');

    this.start = () => {
        ButtonsContainer.classList.add('horizontal-section-is-on');
        ButtonsContainer.classList.add('hide-buttons');
        ButtonsContainer.classList.add('show-horizontal-section-message');
        if (controls) { controls.enabled = false; }
        if (!this.planeExist) {
            console.log('initing');
            initSectionPlane(plane, buildingDatas, scene);
            this.planeExist = true;
        }
        plane.edged.visible = true;

        renderer.clippingPlanes = [plane.clipping];
        canvas.addEventListener('mousedown', onCanvasMouseDown, false);
    };

    const onCanvasMouseDown = (event) => {
        mouse.prev_y = getMouseY(event);
        canvas.removeEventListener('mousedown', onCanvasMouseDown, false);
        canvas.addEventListener('mousemove', onCanvasMouseMove, false);
    };

    const onCanvasMouseMove = (event) => {
        mouse.y = getMouseY(event);
        const delta = mouse.y - mouse.prev_y;
        mouse.prev_y = mouse.y;
        plane.clipping.constant += delta * buildingDatas.size.y;
        plane.edged.position.y = plane.clipping.constant - 0.001;
        canvas.addEventListener('mouseup', onCanvasMouseUp, false);
    };

    const onCanvasMouseUp = () => {
        ButtonsContainer.classList.remove('hide-buttons');
        ButtonsContainer.classList.remove('show-horizontal-selection-message');
        canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
        canvas.removeEventListener('mouseup', onCanvasMouseUp, false);

        window.setTimeout(() => { plane.edged.visible = false; }, 300);
        // TODO: amke the section plane fade away using material.opacity
        // then set to visible = false
        // end set the opacity back to normal

        // TODO: if the cut is not destroyed, show section intersection as RED (like in BimX)

        // TODO: if plane is higher than building destroy everything

        if (controls) { controls.enabled = true; }
    };

    this.destroy = () => {
        ButtonsContainer.classList.remove('horizontal-section-is-on');
        buildingDatas.building.traverse(convertToSingleSided);
        plane.edged.visible = false;
        if (controls) { controls.enabled = true; }
        renderer.clippingPlanes.pop();
    };

    this.update = () => {
        // TODO:  idea : on destroy :
        // 1- fade in previous cutted areas with red color on them 150 ms
        // 2- fade from red to natural color those areas - 150ms
    };

    window.gui.add(this, 'start');
    window.gui.add(this, 'destroy');
}

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

const makeVisiblePlane = ({ x, z }, color) => {
    const planeGeom = new THREE.PlaneGeometry(x + 10, z + 10, 32);
    planeGeom.rotateX(Math.PI / 2);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color, side: THREE.DoubleSide, opacity: 0.2, transparent: true,
    });
    const planeMesh = new THREE.Mesh(planeGeom, planeMaterial);

    const edges = new THREE.EdgesGeometry(planeMesh.geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xf64747 }));

    const group = new THREE.Group();

    group.add(planeMesh);
    group.add(line);

    return (group);
};

const initSectionPlane = (plane, { building, size, center }, scene) => {
    building.traverse(convertToDoubleSided);
    plane.edged = makeVisiblePlane(size, 0xf64747);
    scene.add(plane.edged);
    plane.edged.position.copy(center);
    plane.clipping.constant = center.y;
    plane.edged.position.y -= 0.001;
};


const getMouseY = event => -(event.clientY / window.innerHeight) * 2 + 1;


export default Cut;
