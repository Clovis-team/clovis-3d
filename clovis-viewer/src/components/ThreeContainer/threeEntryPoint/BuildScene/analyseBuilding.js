import { get_building_ifc_elements } from './utils';

const analyseBuilding = (building) => {
    const floors = building.children;
    const {
        building_ifc_elements,
        mesh_all,
    } = get_building_ifc_elements(building);


    return {
        floors,
        building_ifc_elements,
        mesh_all,
    };
};

export default analyseBuilding;
