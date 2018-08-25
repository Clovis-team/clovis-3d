export function getScreenTranslation(object, camera, canvas) {
    const { width, height } = canvas;
    const widthHalf = width / 2;
    const heightHalf = height / 2;

    const pos = object.position.clone();
    pos.project(camera);
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = -(pos.y * heightHalf) + heightHalf;

    return pos;
}

export function colorElement(hitPoint, objSel) {
    if (objSel.obj && objSel.old_material) {
        objSel.obj.material = objSel.old_material;
    }
    if (hitPoint) {
        objSel.ifc_tag = hitPoint.object.ifc_tag;
        objSel.ifc_name = hitPoint.object.ifc_name;

        const event_color = new THREE.Color(0x55dda7);

        const event_material = new THREE.MeshBasicMaterial({ color: event_color });
        objSel.obj = hitPoint.object;
        objSel.old_material = hitPoint.object.material;
        hitPoint.object.material = event_material;
    } else {
        // If no element is selected, remove the color on the previous
        // selected Object
        objSel.obj.material = objSel.old_material;
    }
}

export const toggleSelectionMenuButton = () => {
    const SelectionMenu = document.getElementById('three-selection-menu');

    if (SelectionMenu) {
        if (SelectionMenu.classList.contains('selection-menu-open')) {
            SelectionMenu.classList.remove('selection-menu-open');
        } else {
            SelectionMenu.classList.add('selection-menu-open');
        }
    }
};

export const closeSelectionMenuButton = () => {
    const SelectionMenu = document.getElementById('three-selection-menu');

    if (SelectionMenu) {
        if (SelectionMenu.classList.contains('selection-menu-open')) {
            SelectionMenu.classList.remove('selection-menu-open');
        }
    }
};

export function removeSelectionMenu(objSel) {
    const SelectionMenu = document.getElementById('three-selection-menu');
    if (SelectionMenu) {
        SelectionMenu.parentElement.removeChild(SelectionMenu);
    }

    objSel.div = null;
}

export function getHitPoint(raycaster, buildingDatas) {
    const intersects = raycaster.intersectObjects(buildingDatas.mesh_all);
    if (intersects.length > 0) {
        return intersects[0];
    }
    return null;
}

// Make a hex color lighter or darker if negative luminance
// Cf : https://www.sitepoint.com/javascript-generate-lighter-darker-color/
export function ColorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#';
    let c;
    let i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += (`00${c}`).substr(c.length);
    }

    return rgb;
}

// Convert hex color to rgba with opacity
export function hexToRgbA(hex, opacity) {
    let c;
    let selectedOpacity = 1;

    if (opacity) {
        selectedOpacity = opacity;
    }

    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = `0x${c.join('')}`;

        return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${selectedOpacity})`;
    }
    throw new Error('Bad Hex');
}
