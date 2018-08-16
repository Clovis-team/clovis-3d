import nipplejs from 'nipplejs';

/**
 * creates a joystick and calls for movement in walkingModule
 * passing a THREE.Vector2
 *
 * https://www.npmjs.com/package/nipplejs
 * @param {*} walkingModule Clovis Walking module for threejs
 */
const VirtualJoystick = (joystickMovement) => {
    const joystick1DomContainer = document.getElementById('joystick1-container');

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

    // const joystick2DomContainer = document.getElementById('joystick2-container');

    // const joystick2_options = {
    //     zone: joystick2DomContainer,
    //     mode: 'static',
    //     position: {
    //         right: '8rem',
    //         bottom: '8rem',
    //     },
    //     color: '#00b16a',
    //     lockY: true,
    //     threshold: 0.2,
    // };
    // Up and Down Joystick
    // const joystick2 = nipplejs.create(joystick2_options);
    // joystick2
    //     .on('dir:up dir:down', (evt) => {
    //         switch (evt.type) {
    //         case 'dir:up':
    //             // moveUp = true;
    //             break;
    //         case 'dir:down':
    //             // moveDown = true;
    //             break;
    //         default:
    //             break;
    //         }
    //     })
    //     .on('end', () => {
    //         // stopMoving();
    //     });
};


export default VirtualJoystick;
