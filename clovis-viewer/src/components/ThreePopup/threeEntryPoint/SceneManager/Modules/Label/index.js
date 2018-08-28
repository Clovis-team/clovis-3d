function Label({
    ViewerOptions, camera, canvas, controls,
}) {
    const labels = ViewerOptions.LocalizedNotes;

    const tags = [];
    labels.forEach((label) => {
        const tag = createDiv(label);
        tag.addEventListener('mousedown', moveCameraOnClick);
        tags.push(tag);
    });

    // contains the selected div, to be able to act on it after a new one is selected
    const selected = {
        div: null,
    };

    function moveCameraOnClick(evt) {
        if (selected.div) {
            selected.div.selected = false;
        }
        selected.div = evt.target;

        controls.target.copy(evt.target.labelPosition);
        camera.position.copy(evt.target.cameraPosition);
        controls.update();

        // tweenCameraControls(camera, controls, evt.target.cameraPosition, evt.target.labelPosition, 1000);

        selected.div.selected = true;

        console.log(evt.target.labelPosition);
    }

    // runtime movement of the tags
    this.update = () => {
        for (let i = 0; i < tags.length; i += 1) {
            const pos = getScreenPosition(labels[i], camera, canvas);
            tags[i].style.left = `${pos.x + 10}px`;
            tags[i].style.top = `${pos.y - 40}px`;
            if (pos.z > 1) {
                tags[i].style.visibility = 'hidden';
            } else if (tags[i].selected) {
                tags[i].style.background = 'green';
            } else {
                tags[i].style.background = 'blue';
                tags[i].style.visibility = 'visible';
            }
            tags[i].style.fontSize = `${1 / tags[i].labelPosition.distanceTo(camera.position) * 200 + 12}px`;
        }
    };
}

// function tweenCameraControls(camera, controls, position, target, steps, time) {
//     if (!time) {
//         const time = 1500;
//     }
//     if (!steps) {
//         const steps = 100;
//     }
//     const cameraMovement = position.clone().sub(camera.position);
//     const controlsMovement = target.clone().sub(controls.target);
//     console.log(cameraMovement, controlsMovement);

//     cameraMovement.divideScalar(steps);
//     controlsMovement.divideScalar(steps);
//     console.log(cameraMovement, controlsMovement);

//     for (let i = 0; i < steps; i += 1) {
//         camera.position.add(cameraMovement);
//         controls.target.add(controlsMovement);
//         controls.update();
//     }
// }

function createDiv(label) {
    const div = document.createElement('div');
    div.style.background = 'red';
    div.style.color = 'white';
    div.style.position = 'absolute';
    div.style.textAlign = 'center';
    div.style.verticalAlign = 'middle';


    div.labelPosition = new THREE.Vector3().add(label.position);
    div.cameraPosition = new THREE.Vector3().add(label.cameraPosition);
    div.selected = false;


    div.innerHTML = label._id;
    document.getElementById('popup-viewer').appendChild(div);
    return div;
}

function getScreenPosition(object, camera, canvas) {
    const { width, height } = canvas;
    const widthHalf = width / 2;
    const heightHalf = height / 2;

    const pos = new THREE.Vector3().add(object.position);
    pos.project(camera);
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = -(pos.y * heightHalf) + heightHalf;
    return pos;
}

export default Label;
