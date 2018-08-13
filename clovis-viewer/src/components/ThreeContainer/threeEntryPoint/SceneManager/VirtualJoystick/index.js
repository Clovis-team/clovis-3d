/**
 * dat.gui is a lightweight graphical user interface (GUI) to controll
 * the viewer
 */

import nipplejs from 'nipplejs';


const VirtualJoystick = () => {
    const joystick1DomContainer = document.getElementById('joystick1-container');
    const joystick2DomContainer = document.getElementById('joystick2-container');

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

    // function stopMoving(){
    //     moveForward = false;
    //     moveBackward = false;
    //     moveLeft = false;
    //     moveRight = false;
    //     moveUp = false;
    //     moveDown = false;
    // }

    // Create the Virtual Joysticks inside their dom containers
    // Normal Joystick
    const joystick1 = nipplejs.create(joystick1_options);
    // Up and Down Joystick
    const joystick2 = nipplejs.create(joystick2_options);

    // TODO: @Nicola could be great that your controls could handle
    // advanced directions, and direction strength, like x, y, and strength
    // see https://www.npmjs.com/package/nipplejs#move
    joystick1
        .on('dir:up dir:down dir:right dir:left', (evt) => {
            console.log('evt :', evt);

            switch (evt.type) {
            case 'dir:up':
                // moveForward = true;
                break;
            case 'dir:down':
                // moveBackward = true;
                break;
            case 'dir:right':
                // moveRight = true;
                break;
            case 'dir:left':
                // moveLeft = true;
                break;
            default:
                break;
            }
        })
        .on('end', (evt) => {
            console.log('evt :', evt);
            // stopMoving();
        });

    joystick2
        .on('dir:up dir:down', (evt) => {
            switch (evt.type) {
            case 'dir:up':
                // moveUp = true;
                break;
            case 'dir:down':
                // moveDown = true;
                break;
            default:
                break;
            }
        })
        .on('end', () => {
            // stopMoving();
        });
};


export default VirtualJoystick;
