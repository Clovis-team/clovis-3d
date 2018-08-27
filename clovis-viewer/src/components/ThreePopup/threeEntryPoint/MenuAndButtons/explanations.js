
// WHEN A USER SELECTS "IFC STAIR FLIGHT"

// N°13
// Object 3d
const IfcStairFlight = {
    visible: true,
    uuid: 'FB6F506D',
    ifc_tag: 'IfcStairFlight',
    // No key "categories"

    children: [
        // Mesh
        {
            visible: true,
            ifc_tag: 'IfcStairFlight',
            uuid: 'E1449D27',
            categories: [
                'FB6F506D',
            ],

            children: [0],
        },

    ],
};

// N°12
// Object 3d
const IfcStair = {
    visible: false,
    uuid: 'FE8F083B',
    ifc_tag: 'IfcStair',
    // No key "categories"

    children: [
        // Object3d
        {
            visible: false,
            uuid: '7BCBE140',
            ifc_tag: 'IfcStair',
            categories: [
                'FE8F083B',
            ],

            children: [
                // Object 3d
                {
                    visible: true,
                    uuid: '92763B67',
                    ifc_tag: '$RelAggregates',
                    // No key "categories"

                    children: [
                        // Mesh
                        {
                            visible: true,
                            uuid: 'E1449D27',
                            ifc_tag: 'IfcStairFlight',
                            categories: [
                                'FB6F506D',
                            ],

                            children: [0],
                        },
                    ],
                },
            ],
        },

    ],
};

// Note : if the children '7BCBE140', passes "visible : true", the stair is shown
