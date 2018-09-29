function Label({
    ViewerOptions, camera, canvas, controls,
}) {
    const selected = {
        div: null,
        // tween: false,
        // speed: 10,
        // cameraDest: null,
        // targetDest: null,
    };
    const labels = ViewerOptions.LocalizedNotes;

    // Initialize the dom container of labels
    const LabelContainer = initLabelContainer();

    const tags = labels.map(label => createDiv(label, LabelContainer, moveCameraOnClick, selected, controls, camera));

    // contains the selected div, to be able to act on it after a new one is selected

    // function setupTween(selected, cameraDest, targetDest) {
    //     selected.cameraDest = cameraDest;
    //     selected.targetDest = targetDestl;
    //     selected.cameraV =
    //     selected.tween = true;
    // }

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
        updateTagPositionAndStyle(tags, labels, camera, canvas);
    };
}


function updateTagPositionAndStyle(tags, labels, camera, canvas) {
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
        tags[i].style.zIndex = `${Math.floor(1 / tags[i].labelPosition.distanceTo(camera.position) * 1000) + 2}`;
    }
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

//     cameraMovement.divideScalar(steps);
//     controlsMovement.divideScalar(steps);

//     for (let i = 0; i < steps; i += 1) {
//         camera.position.copy(camera.position.add(cameraMovement));
//         controls.target.copy(controls.target.add(controlsMovement));
//         controls.update();
//         console.log(camera.position.x, controls.target.x);
//     }
// }

function createDiv(label, LabelContainer, moveCameraOnClick, selected, controls, camera) {
    const LabelElement = document.createElement('div');
    LabelElement.className = 'three-clovis-label';
    const LabelNotification = document.createElement('div');
    LabelNotification.className = 'three-clovis-label_notification';

    LabelElement.labelPosition = new THREE.Vector3().add(label.position);
    LabelElement.cameraPosition = new THREE.Vector3().add(label.cameraPosition);


    if (label.notifications.amount > 0) {
        if (label.notifications.strong) {
            console.log('label._id :', label._id);
            LabelElement.classList.add('three-clovis-label_notification-high');
            LabelNotification.innerHTML = label.notifications.amount;
        } else {
            LabelElement.classList.add('three-clovis-label_notification-low');
        }
    }


    if (label.selected === true) {
        window.addEventListener('endOfLoaderCallback', () => {
            selected.div = LabelElement;
            LabelElement.selected = true;
            LabelElement.classList.remove('three-clovis-label_hidden');
            LabelElement.classList.add('three-clovis-label_selected');
            controls.target.copy(LabelElement.labelPosition);
            camera.position.copy(LabelElement.cameraPosition);
            controls.update();
        });
    } else {
        LabelElement.selected = false;
    }

    LabelElement.innerHTML = `${label._id}`.substring(0, Math.floor(Math.random() * 3) + 1);

    addListeners(LabelElement, moveCameraOnClick);

    LabelElement.appendChild(LabelNotification);

    LabelContainer.appendChild(LabelElement);

    return LabelElement;
}

function addListeners(LabelElement, moveCameraOnClick) {
    LabelElement.addEventListener('mousedown', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        moveCameraOnClick(event);
    });
    LabelElement.addEventListener('touchend', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        moveCameraOnClick(event);
    });
}

function initLabelContainer() {
    const LabelContainer = document.createElement('div');
    LabelContainer.id = 'three-clovis-label-container';
    const ThreeClovisContainer = document.getElementById('clovis-viewer-container');
    ThreeClovisContainer.appendChild(LabelContainer);
    return LabelContainer;
}

function getScreenPosition(object, camera, canvas) {
    const width = parseInt(canvas.style.width);
    const height = parseInt(canvas.style.height);
    const widthHalf = width / 2;
    const heightHalf = height / 2;

    const pos = new THREE.Vector3().add(object.position);
    pos.project(camera);
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = -(pos.y * heightHalf) + heightHalf;
    return pos;
}

export default Label;
