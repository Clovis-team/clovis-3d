import get from 'lodash/get';

// eslint-disable-next-line import/prefer-default-export
export const get_building = (scene) => {
    const building = get(scene, 'children[0].children[0].children[0].children[0]');
    if (building === undefined) {
        throw new Error('cannot reach building');
    }
    return building;
};
