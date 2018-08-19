
const get_main_floor = (floor_array) => {
    let max_value = 0;
    let max_id = 0;
    console.log('floor_array :', floor_array);

    floor_array.forEach((floor, index) => {
        if (floor.children.length > max_value) {
            max_value = floor.children.length;
            max_id = index;
        }
    });
    return max_id;
};


function Explosion({ buildingDatas }) {
    const z_delta = 20;
    let main_floor = {};
    const ButtonsContainer = document.getElementById('three-clovis-buttons-container');

    this.start = () => {
        ButtonsContainer.classList.add('explosion-is-on');
        main_floor = get_main_floor(buildingDatas.floors);

        // new_removedTags.push(CoveringCategory.uuid);
        // changeRemovedTags(new_removedTags);
        // building_ifc_elements.forEach(category => {
        //     if(category.uuid)

        // })
        buildingDatas.floors.forEach((floor_no, index) => {
            const floor = floor_no;
            floor.position.z += (z_delta * (index - main_floor));
        });
    };

    this.destroy = () => {
        ButtonsContainer.classList.remove('explosion-is-on');
        // new_removedTags.filter(category => (category.uuid !== CoveringCategory.uuid));
        // changeRemovedTags(new_removedTags);
        buildingDatas.floors.forEach((floor_no, index) => {
            const floor = floor_no;
            floor.position.z -= (z_delta * (index - main_floor));
        });
    };

    this.update = () => {

    };
}

export default Explosion;
