function Label({
    ViewerOptions, camera, canvas, controls,
}) {
    const labels = ViewerOptions.LocalizedNotes;

    const tags = [];
    labels.forEach((label) => {
        const tag = createDiv(label);
        tag.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            moveCameraOnClick(event);
        });
        tag.addEventListener('touchend', (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            event.stopPropagation();
            moveCameraOnClick(event);
        });
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

            // Manage the position of the label
            tags[i].style.left = `${pos.x + 10}px`;
            tags[i].style.top = `${pos.y - 40}px`;


            if (pos.z > 1) {
                // If the camera is after the lable, hide the label
                tags[i].classList.add('three-clovis-label_hidden');
            } else if (tags[i].selected) {
                // If the label is selected, change its color
                tags[i].classList.add('three-clovis-label_selected');
            } else {
                // Show the label back
                tags[i].classList.remove('three-clovis-label_hidden');
                tags[i].classList.remove('three-clovis-label_selected');
            }

            // Change the font size function of the distance
            // With font-size
            // tags[i].style.fontSize = `${1 / tags[i].labelPosition.distanceTo(camera.position) * 200 + 12}px`;
            // With Element size
            // tags[i].style.height = `${1 / tags[i].labelPosition.distanceTo(camera.position) * 300 + 12}px`;
            // tags[i].style.width = `${1 / tags[i].labelPosition.distanceTo(camera.position) * 300 + 12}px`;
            // With z-index
            tags[i].style.zIndex = `${Math.floor(1 / tags[i].labelPosition.distanceTo(camera.position) * 10000) + 2}`;
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
    const LabelElement = document.createElement('div');
    LabelElement.className = 'three-clovis-label';

    LabelElement.labelPosition = new THREE.Vector3().add(label.position);
    LabelElement.cameraPosition = new THREE.Vector3().add(label.cameraPosition);

    if (label.selected === true) {
        // TODO: uncomment this to open the viewer with selected task
        // LabelElement.selected = true;
        // LabelElement.classList.add('three-clovis-label_selected');
    } else {
        LabelElement.selected = false;
    }

    LabelElement.innerHTML = `${label._id}`.substring(0, Math.floor(Math.random() * 3) + 1);
    document.getElementById('popup-viewer').appendChild(LabelElement);
    return LabelElement;
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
