
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

        buildingDatas.building.traverse(convertToDoubleSided);
        if (controls) { controls.enabled = false; }
        if (!this.planeExist) {
            initSectionPlane(plane, buildingDatas, scene);
            this.planeExist = true;
        }
        plane.edged.visible = true;

        // tries to section everything
        // buildingDatas.building.traverse(drawIntersectionPoints);

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
        // draws a cube and its attempted intersection
        // drawIntersectionPoints(cube);

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

    function drawIntersectionPoints(obj) {
        if (obj.type === 'Mesh') {
            console.log(obj);
        }

        const c_geometry = new THREE.BoxGeometry(10, 10, 10);
        const c_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(c_geometry, c_material);
        cube.position.x = 10;
        scene.add(cube);

        const a = new THREE.Vector3();
        const b = new THREE.Vector3();
        const c = new THREE.Vector3();
        const planePointA = new THREE.Vector3();
        const planePointB = new THREE.Vector3();
        const planePointC = new THREE.Vector3();
        let lineAB = new THREE.Line3();
        let lineBC = new THREE.Line3();
        let lineCA = new THREE.Line3();
        const pointsOfIntersection = new THREE.Geometry();
        const pointOfIntersection = new THREE.Vector3();

        function setPointOfIntersection(line, this_plane) {
            this_plane.intersectLine(line, pointOfIntersection);
            if (pointOfIntersection) {
                pointsOfIntersection.vertices.push(pointOfIntersection.clone());
            }
        }

        if (obj.type === 'Mesh' && obj.geometry.faces !== undefined) {
            obj.geometry.faces.forEach((face) => {
                obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
                obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
                obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
                lineAB = new THREE.Line3(a, b);
                lineBC = new THREE.Line3(b, c);
                lineCA = new THREE.Line3(c, a);
                setPointOfIntersection(lineAB, plane.clipping);
                setPointOfIntersection(lineBC, plane.clipping);
                setPointOfIntersection(lineCA, plane.clipping);
            });

            const pointsMaterial = new THREE.PointsMaterial({
                size: 0.5,
                color: 'yellow',
            });
            const points = new THREE.Points(pointsOfIntersection, pointsMaterial);
            scene.add(points);

            const array = [];

            for (let i = 0; i < pointsOfIntersection.vertices.length; i += 1) {
                array.push(new THREE.Vector2(
                    pointsOfIntersection.vertices[i].x,
                    pointsOfIntersection.vertices[i].z,
                ));
            }

            const shape = new THREE.Shape(array);


            const geometry = new THREE.ShapeGeometry(shape);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.rotateX(-Math.PI / 2);
            mesh.position.y = plane.clipping.constant;

            scene.add(mesh);

            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
            const line = new THREE.LineSegments(pointsOfIntersection, lineMaterial);
            scene.add(line);
        }
    }

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

    const group = new THREE.Group();

    group.add(planeMesh);
    group.add(line);

    return (group);
};

const initSectionPlane = (plane, { building, size, center }, scene) => {
    plane.edged = makeVisiblePlane(size, 0xf64747);
    scene.add(plane.edged);
    plane.edged.position.copy(center);
    plane.clipping.constant = center.y;
    plane.edged.position.y -= 0.001;
};


const getMouseY = event => -(event.clientY / window.innerHeight) * 2 + 1;


export default Cut;
