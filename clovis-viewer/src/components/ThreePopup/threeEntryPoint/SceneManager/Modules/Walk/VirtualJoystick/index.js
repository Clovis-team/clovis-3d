import nipplejs from 'nipplejs';

/**
 * creates a joystick and calls for movement in walkingModule
 * passing a THREE.Vector2
 *
 * https://www.npmjs.com/package/nipplejs
 * @param {*} walkingModule Clovis Walking module for threejs
 */
const VirtualJoystick = (joystickMovement, joystickRising) => {
    const ClovisViewerContainer = document.getElementById('clovis-viewer-container');

    const joystick1DomContainer = document.createElement('div');
    joystick1DomContainer.id = 'joystick1-container';
    ClovisViewerContainer.appendChild(joystick1DomContainer);

    const joystick1_options = {
        zone: joystick1DomContainer,
        mode: 'static',
        position: {
            left: '8rem',
            bottom: '8rem',
        },
        color: '#00b16a',
        threshold: 0.2,
    };


    // Create the Virtual Joysticks inside their dom containers
    const joystick1 = nipplejs.create(joystick1_options);

    const getVectorFromJoystick = (data) => {
        const angle = data.angle.radian;
        const { force } = data;
        const directionVector = new THREE.Vector3(-Math.cos(angle), 0, Math.sin(angle));
        directionVector.multiplyScalar(force > 5 ? 5 : force);
        return directionVector;
    };


    joystick1
        .on('move', (evt, data) => {
            const vector = getVectorFromJoystick(data);
            joystickMovement(vector);
        }).on('end', () => {
            const emptyvector = new THREE.Vector3(0, 0, 0);
            joystickMovement(emptyvector);
        });


    // SECOND JOYSTICK

    const joystick2DomContainer = document.createElement('div');
    joystick2DomContainer.id = 'joystick2-container';
    ClovisViewerContainer.appendChild(joystick2DomContainer);

    const joystick2_options = {
        zone: joystick2DomContainer,
        mode: 'static',
        position: {
            right: '8rem',
            bottom: '8rem',
        },
        color: '#00b16a',
        lockY: true,
        threshold: 0.2,
    };
    // Up and Down Joystick
    const joystick2 = nipplejs.create(joystick2_options);

    const vector = new THREE.Vector3(0, 0, 0);
    joystick2
        .on('move', (evt, data) => {
            // const vector = getVectorFromJoystick(data);
            // joystickMovement(vector);
            // console.log(controls.target);


            if (data.direction && data.direction.y === 'up') {
                vector.y = data.force;
                joystickRising(vector);
            } else if (data.direction && data.direction.y === 'down') {
                vector.y = -data.force;
                joystickRising(vector);
            }
        }).on('end', () => {
            vector.y = 0;
            joystickRising(vector);
            // const emptyvector = new THREE.Vector3(0, 0, 0);
            // joystickMovement(emptyvector);
        });
};


export default VirtualJoystick;
