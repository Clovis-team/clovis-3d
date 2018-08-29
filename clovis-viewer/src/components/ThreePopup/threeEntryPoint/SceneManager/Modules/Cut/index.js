
function Cut({
    renderer, controls, canvas, buildingDatas, scene,
}) {
    const plane = {
        clipping: new THREE.Plane(new THREE.Vector3(0, -1, 0), 2),
        edged: new THREE.Group(),
    };
    this.planeExist = false;

    const mouse = { y: 0, y_prev: 0 };

    const ButtonsContainer = document.getElementById('three-clovis-buttons-container');

    this.start = () => {
        ButtonsContainer.classList.add('horizontal-section-is-on');
        ButtonsContainer.classList.add('hide-buttons');
        ButtonsContainer.classList.add('show-horizontal-section-message');

        buildingDatas.building.traverse(convertToDoubleSided);
        if (controls) { controls.enabled = false; }
        if (!this.planeExist) {
            initSectionPlane(plane, buildingDatas, scene);
            console.log(plane.edged)

            buildingDatas.mesh_all.push(plane.edged.children[0]);
            this.planeExist = true;
            this.splittingPlane = plane.edged.children[0]

        }
        plane.edged.visible = true;
        plane.edged.children[0].visible = true;




        renderer.clippingPlanes = [plane.clipping];
        canvas.addEventListener('mousedown', onCanvasMouseDown, false);
        canvas.addEventListener('touchstart', onCanvasMouseDown, false);
    };

    const onCanvasMouseDown = (event) => {
        mouse.prev_y = getMouseY(event);
        canvas.removeEventListener('mousedown', onCanvasMouseDown, false);
        canvas.removeEventListener('touchstart', onCanvasMouseDown, false);
        canvas.addEventListener('mousemove', onCanvasMouseMove, false);
        canvas.addEventListener('touchmove', onCanvasMouseMove, false);
    };

    const onCanvasMouseMove = (event) => {
        mouse.y = getMouseY(event);
        const delta = mouse.y - mouse.prev_y;
        mouse.prev_y = mouse.y;
        plane.clipping.constant += delta * buildingDatas.size.y;
        plane.edged.position.y = plane.clipping.constant - 0.001;
        canvas.addEventListener('mouseup', onCanvasMouseUp, false);
        canvas.addEventListener('touchend', onCanvasMouseUp, false);
    };

    const onCanvasMouseUp = () => {
        ButtonsContainer.classList.remove('hide-buttons');
        ButtonsContainer.classList.remove('show-horizontal-selection-message');
        canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
        canvas.removeEventListener('mouseup', onCanvasMouseUp, false);
        canvas.removeEventListener('touchmove', onCanvasMouseMove, false);
        canvas.removeEventListener('touchend', onCanvasMouseUp, false);


        window.setTimeout(() => { plane.edged.visible = false; }, 300);
        // TODO: make the section plane fade away using material.opacity
        // then set to visible = false
        // end set the opacity back to normal

        // TODO: if the cut is not destroyed, show section intersection as RED (like in BimX)
        if (controls) { controls.enabled = true; }
    };

    this.destroy = () => {
        ButtonsContainer.classList.remove('horizontal-section-is-on');
        buildingDatas.building.traverse(convertToSingleSided);
        plane.edged.visible = false;
        plane.edged.children[0].visible = false;
        
        if (controls) { controls.enabled = true; }
        renderer.clippingPlanes.pop();
    };

    this.update = () => {
        // TODO:  idea : on destroy :
        // 1- fade in previous cutted areas with red color on them 150 ms
        // 2- fade from red to natural color those areas - 150ms
    };

    const guiFolder = window.gui.addFolder('Section');
    guiFolder.add(this, 'start');
    guiFolder.add(this, 'destroy');
}


function convertToSingleSided(object) {
    if (object.material) {
        object.material.side = 0;
    }
}

function convertToDoubleSided(object) {
    if (object.material) {
        object.material.side = THREE.DoubleSide;
    }
}


const makeVisiblePlane = ({ x, z }, color) => {
    const planeGeom = new THREE.PlaneGeometry(x * 1.1, z * 1.1, 32);
    planeGeom.rotateX(Math.PI / 2);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color, side: THREE.DoubleSide, opacity: 0.2, transparent: true,
    });
    const planeMesh = new THREE.Mesh(planeGeom, planeMaterial);

    const edges = new THREE.EdgesGeometry(planeMesh.geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xf64747 }));

    const group = new THREE.Object3D();

    group.add(planeMesh);
    group.add(line);

    return (group);
};

const initSectionPlane = (plane, { size, center }, scene) => {
    plane.edged = makeVisiblePlane(size, 0xf64747);
    scene.add(plane.edged);
    plane.edged.position.copy(center);
    plane.clipping.constant = center.y;
    plane.edged.position.y -= 0.001;
};


const getMouseY = (event) => {
    if (!event.changedTouches) {
        return -(event.clientY / window.innerHeight) * 2 + 1;
    }
    return -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
};


export default Cut;
