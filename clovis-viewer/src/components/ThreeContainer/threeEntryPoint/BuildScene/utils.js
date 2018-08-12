import get from 'lodash/get';

// eslint-disable-next-line import/prefer-default-export
export const get_building = (scene) => {
    const building = get(scene, 'children[0].children[0].children[0].children[0]');
    if (building === undefined) {
        throw new Error('cannot reach building');
    }
    return building;
};


export const get_building_ifc_elements = (object) => {
    const building_ifc_elements = [];
    const mesh_all = [];


    object.traverse((node_no) => {
        const node = node_no;

        if ((node instanceof THREE.Mesh || node instanceof THREE.Object3D) && node.name !== '') {
            mesh_all.push(node);

            const ifc_tag = node.name.split('_')[0];
            node.ifc_tag = ifc_tag;
            const ifc_name = node.name.split('_')[1];
            node.ifc_name = ifc_name;

            if (ifc_tag !== '' && ifc_tag.charAt(0) !== '$' && ifc_tag !== 'mesh' && ifc_tag !== 'IfcBuildingStorey') {
                if (!building_ifc_elements.some(obj => obj.ifc_tag === ifc_tag)) {
                    const ifc_building_element = new THREE.Object3D();

                    ifc_building_element.ifc_tag = ifc_tag;
                    ifc_building_element.name = ifc_tag;
                    ifc_building_element.ifc_name = ifc_name;
                    ifc_building_element.visible_order = true;
                    ifc_building_element.children.push(node);
                    building_ifc_elements.push(ifc_building_element);
                } else {
                    const ifc_building_element = building_ifc_elements.find(
                        obj => obj.ifc_tag === ifc_tag,
                    );
                    ifc_building_element.children.push(node);
                }
            }
        }
    });

    return {
        building_ifc_elements,
        mesh_all,
    };
};

// TODO: make it cleaner (and work)
export function center_and_position_camera(object, controls) {
    object.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    controls.target = (center);
    // controls.target.copy(center);
    controls.new_target = true;
    camera.position.copy(center.add(size / 2));
    console.log('target', controls.target);
    console.log('camera postion', camera.position);
}
