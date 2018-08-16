/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 * @author nmanzini / http://nicolamanzini.com/
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
    this.plane_movements = false;

    this.collision_objects = undefined;
    this.collision_floor = false;

    this.collision_floor_vector = new THREE.Vector3(0, -1, 0);
    const collision_floor_ray = new THREE.Raycaster();
    this.set_height = 1.75;

    if (this.domElement !== document) {
        this.domElement.setAttribute('tabindex', -1);
    }

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

        this.mouseDragOn = true;

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
    };

    this.onKeyDown = function onKeyDown(event) {
        // event.preventDefault();

        switch (event.keyCode) {
        case 38: /* up */
        case 69: /* E */ this.moveForward = true; break;

        case 37: /* left */
        case 83: /* S */ this.moveLeft = true; break;

        case 40: /* down */
        case 68: /* D */ this.moveBackward = true; break;

        case 39: /* right */
        case 70: /* F */ this.moveRight = true; break;

        case 84: /* T */ this.moveUp = true; break;
        case 71: /* G */ this.moveDown = true; break;
        default: break;
        }
    };

    this.onKeyUp = function onKeyUp(event) {
        switch (event.keyCode) {
        case 38: /* up */
        case 69: /* E */ this.moveForward = false; break;

        case 37: /* left */
        case 83: /* S */ this.moveLeft = false; break;

        case 40: /* down */
        case 68: /* D */ this.moveBackward = false; break;

        case 39: /* right */
        case 70: /* F */ this.moveRight = false; break;

        case 84: /* T */ this.moveUp = false; break;
        case 71: /* G */ this.moveDown = false; break;
        default: break;
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
            if (this.moveForward || (this.autoForward && !this.moveBackward)) {
                this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
            }
            if (this.moveBackward) this.object.translateZ(actualMoveSpeed);
        }


        if (this.moveLeft) this.object.translateX(-actualMoveSpeed);
        if (this.moveRight) this.object.translateX(actualMoveSpeed);


        if (this.collision_floor && this.collision_objects) {
            collision_floor_ray.set(this.object.position, this.collision_floor_vector);
            const collision_objects = this.collision_objects;
            const intersects = collision_floor_ray.intersectObjects(collision_objects);

            const delta_y = actualMoveSpeed / 2;

            if (intersects.length) {
                const dist_to_floor = intersects[0].distance;
                if (dist_to_floor > this.set_height + delta_y) {
                    this.object.position.y -= actualMoveSpeed;
                } else if (dist_to_floor < this.set_height - delta_y) {
                    this.object.position.y += actualMoveSpeed;
                } else {
                    this.object.position.y += this.set_height - dist_to_floor;
                }
            }
        }

        if (this.moveUp) this.object.position.y += actualMoveSpeed;
        if (this.moveDown) this.object.position.y -= actualMoveSpeed;

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
            this.lon += this.mouseX_delta * actualLookSpeed;
            if (this.lookVertical) this.lat -= this.mouseY_delta * actualLookSpeed * verticalLookRatio;
        } else {
            this.lon -= this.mouseX_delta * actualLookSpeed;
            if (this.lookVertical) this.lat += this.mouseY_delta * actualLookSpeed * verticalLookRatio;
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

        const position = this.object.position;
        targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        targetPosition.y = position.y + 100 * Math.cos(this.phi);
        targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

        this.object.lookAt(targetPosition);
    };

    function contextmenu(event) {
        event.preventDefault();
    }

    function bind(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    }

    const bind_onMouseMove = bind(this, this.onMouseMove);
    const bind_onMouseDown = bind(this, this.onMouseDown);
    const bind_onMouseUp = bind(this, this.onMouseUp);
    const bind_onKeyDown = bind(this, this.onKeyDown);
    const bind_onKeyUp = bind(this, this.onKeyUp);


    this.dispose = function dispose() {
        this.domElement.removeEventListener('contextmenu', contextmenu, false);
        this.domElement.removeEventListener('mousedown', bind_onMouseDown, false);
        this.domElement.removeEventListener('mousemove', bind_onMouseMove, false);
        this.domElement.removeEventListener('mouseup', bind_onMouseUp, false);

        window.removeEventListener('keydown', bind_onKeyDown, false);
        window.removeEventListener('keyup', bind_onKeyUp, false);
    };


    this.domElement.addEventListener('contextmenu', contextmenu, false);
    this.domElement.addEventListener('mousemove', bind_onMouseMove, false);
    this.domElement.addEventListener('mousedown', bind_onMouseDown, false);
    this.domElement.addEventListener('mouseup', bind_onMouseUp, false);

    window.addEventListener('keydown', bind_onKeyDown, false);
    window.addEventListener('keyup', bind_onKeyUp, false);


    this.handleResize();
};
