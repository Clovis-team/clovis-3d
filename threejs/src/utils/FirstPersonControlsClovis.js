/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControlsClovis = function FirstPersonControlsClovis(object, domElement) {
    this.object = object;
    this.target = new THREE.Vector3(0, 0, 0);
    this.new_target = false;

    this.domElement = (domElement !== undefined) ? domElement : document;

    this.enabled = true;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseX_delta = 0;
    this.mouseY_delta = 0;
    this.mouseX_old = 0;
    this.mouseY_old = 0;
    this.mouseX_start = 0;
    this.mouseY_start = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    this.fps_style = false;
    this.plane_movements = true;

    if (this.domElement !== document) {
        this.domElement.setAttribute('tabindex', -1);
    }

    //

    this.handleResize = function handleResize() {
        if (this.domElement === document) {
            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;
        } else {
            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;
        }
    };

    this.onMouseDown = function onMouseDown(event) {
        if (this.domElement !== document) {
            this.domElement.focus();
        }

        event.preventDefault();
        event.stopPropagation();

        // state = STATE.DOWN;

        // if (this.domElement === document) {
        //     this.mouseX = event.pageX - this.viewHalfX;
        //     this.mouseY = event.pageY - this.viewHalfY;
        // } else {
        //     this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
        //     this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
        // }


        // this.lon += this.mouseX;
        // if (this.lookVertical) this.lat -= this.mouseY;
        // this.lat = Math.max(-85, Math.min(85, this.lat));

        // console.log(this.lon, this.lat);

        this.mouseDragOn = true;


        // CLOVIS

        if (this.domElement === document) {
            this.mouseX_start = event.pageX - this.viewHalfX;
            this.mouseY_start = event.pageY - this.viewHalfY;
        } else {
            this.mouseX_start = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            this.mouseY_start = event.pageY - this.domElement.offsetTop - this.viewHalfY;
        }
    };

    this.onMouseUp = function onMouseUp(event) {
        event.preventDefault();
        event.stopPropagation();

        // if (this.activeLook) {
        //     switch (event.button) {
        //     case 0: this.moveForward = false; break;
        //     case 2: this.moveBackward = false; break;
        //     }
        // }

        // this.state = STATE.NONE;

        this.mouseDragOn = false;
        this.mouseX_old = 0;
        this.mouseY_old = 0;
        this.mouseX = 0;
        this.mouseY = 0;
    };

    this.onMouseMove = function onMouseMove(event) {
        if (this.mouseDragOn) {
            if (this.domElement === document) {
                this.mouseX = event.pageX - this.viewHalfX - this.mouseX_start;
                this.mouseY = event.pageY - this.viewHalfY - this.mouseY_start;
            } else {
                this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX - this.mouseX_start;
                this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY - this.mouseY_start;
            }
        }
        console.log(this.mouseX, this.mouseY);
        // if (this.domElement === document) {
        //     this.mouseX = event.pageX - this.viewHalfX;
        //     this.mouseY = event.pageY - this.viewHalfY;
        // } else {
        //     this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
        //     this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
        // }
    };

    this.onKeyDown = function onKeyDown(event) {
        // event.preventDefault();

        switch (event.keyCode) {
        case 38: /* up */
        case 87: /* W */ this.moveForward = true; break;

        case 37: /* left */
        case 65: /* A */ this.moveLeft = true; break;

        case 40: /* down */
        case 83: /* S */ this.moveBackward = true; break;

        case 39: /* right */
        case 68: /* D */ this.moveRight = true; break;

        case 82: /* R */ this.moveUp = true; break;
        case 70: /* F */ this.moveDown = true; break;
        }
    };

    this.onKeyUp = function onKeyUp(event) {
        switch (event.keyCode) {
        case 38: /* up */
        case 87: /* W */ this.moveForward = false; break;

        case 37: /* left */
        case 65: /* A */ this.moveLeft = false; break;

        case 40: /* down */
        case 83: /* S */ this.moveBackward = false; break;

        case 39: /* right */
        case 68: /* D */ this.moveRight = false; break;

        case 82: /* R */ this.moveUp = false; break;
        case 70: /* F */ this.moveDown = false; break;
        }
    };


    this.update = function update(delta) {
        if (this.enabled === false) return;

        if (this.heightSpeed) {
            const y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
            const heightDelta = y - this.heightMin;

            this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
        } else {
            this.autoSpeedFactor = 0.0;
        }

        const actualMoveSpeed = delta * this.movementSpeed;

        if (this.plane_movements) {
            if (this.moveForward || (this.autoForward && !this.moveBackward)) {
                this.object.position.z += actualMoveSpeed * Math.sin(this.phi) * Math.sin(this.theta);
                this.object.position.x += actualMoveSpeed * Math.sin(this.phi) * Math.cos(this.theta);
            }
            if (this.moveBackward) {
                this.object.position.z -= actualMoveSpeed * Math.sin(this.phi) * Math.sin(this.theta);
                this.object.position.x -= actualMoveSpeed * Math.sin(this.phi) * Math.cos(this.theta);
            }
        } else {
            if (this.moveForward || (this.autoForward && !this.moveBackward)) this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
            if (this.moveBackward) this.object.translateZ(actualMoveSpeed);
        }


        if (this.moveLeft) this.object.translateX(-actualMoveSpeed);
        if (this.moveRight) this.object.translateX(actualMoveSpeed);

        if (this.moveUp) this.object.translateY(actualMoveSpeed);
        if (this.moveDown) this.object.translateY(-actualMoveSpeed);


        let actualLookSpeed = delta * this.lookSpeed;

        if (!this.activeLook) {
            actualLookSpeed = 0;
        }

        let verticalLookRatio = 1;

        if (this.constrainVertical) {
            verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
        }

        this.mouseX_delta = this.mouseX - this.mouseX_old;
        this.mouseY_delta = this.mouseY - this.mouseY_old;

        if (this.fps_style) {
            this.lon -= this.mouseX_delta * actualLookSpeed;
            if (this.lookVertical) this.lat += this.mouseY_delta * actualLookSpeed * verticalLookRatio;
        } else {
            this.lon += this.mouseX_delta * actualLookSpeed;
            if (this.lookVertical) this.lat -= this.mouseY_delta * actualLookSpeed * verticalLookRatio;
        }
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.mouseX_old = this.mouseX;
        this.mouseY_old = this.mouseY;

        this.phi = THREE.Math.degToRad(90 - this.lat);

        this.theta = THREE.Math.degToRad(this.lon);

        if (this.constrainVertical) {
            this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
        }

        const targetPosition = this.target;

        // if (this.new_target) {
        //     this.new_target = false;
        // } else {

        console.log(this.object.rotation);

        const position = this.object.position;
        targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        targetPosition.y = position.y + 100 * Math.cos(this.phi);
        targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

        this.object.lookAt(targetPosition);
    };

    function contextmenu(event) {
        event.preventDefault();
    }

    this.dispose = function dispose() {
        this.domElement.removeEventListener('contextmenu', contextmenu, false);
        this.domElement.removeEventListener('mousedown', _onMouseDown, false);
        this.domElement.removeEventListener('mousemove', _onMouseMove, false);
        this.domElement.removeEventListener('mouseup', _onMouseUp, false);

        window.removeEventListener('keydown', _onKeyDown, false);
        window.removeEventListener('keyup', _onKeyUp, false);
    };

    const _onMouseMove = bind(this, this.onMouseMove);
    const _onMouseDown = bind(this, this.onMouseDown);
    const _onMouseUp = bind(this, this.onMouseUp);
    const _onKeyDown = bind(this, this.onKeyDown);
    const _onKeyUp = bind(this, this.onKeyUp);

    this.domElement.addEventListener('contextmenu', contextmenu, false);
    this.domElement.addEventListener('mousemove', _onMouseMove, false);
    this.domElement.addEventListener('mousedown', _onMouseDown, false);
    this.domElement.addEventListener('mouseup', _onMouseUp, false);

    window.addEventListener('keydown', _onKeyDown, false);
    window.addEventListener('keyup', _onKeyUp, false);

    function bind(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    }

    this.handleResize();
};
