import _ from 'lodash';

export default function generateTasks() {
    const getRandomArbitrary = (min, max) => Math.round(Math.random() * (max - min) + min);

    const generatedTasks = [];
    // Randomly generated tasks
    for (let i = 0; i <= 5; i += 1) {
        const RandomArbitraryID = getRandomArbitrary(1000, 100000);
        generatedTasks.push({
            _id: RandomArbitraryID,
            onNoteOpen: () => { alert(`Open note n° ${RandomArbitraryID}`); },
            position: {
                x: getRandomArbitrary(0, 160),
                y: getRandomArbitrary(0, 40),
                z: getRandomArbitrary(-80, 80),
            },
            selected: false,
            linked_object: {
                uuid: getRandomArbitrary(1000, 100000),
                name: 'Jacuzzi',
                categories: [
                    'IfcCovering',
                    'IfcColumn',
                ],
            },
            cameraPosition: {
                x: getRandomArbitrary(0, 80),
                y: getRandomArbitrary(0, 80),
                z: getRandomArbitrary(0, 20),
            },
            done: _.sample([true, false]),
            notifications: {
                amount: 0,
                strong: 'false',
            },
        });
    }

    // Edit this one if needed
    generatedTasks.push({
        _id: '59026b827ec0050001ac0cc9',
        onNoteOpen: () => { alert('Open note n° 59026b827ec0050001ac0cc9'); },

        position: {
            x: 20,
            y: 40,
            z: 30,
        },
        selected: true,
        linked_object: {
            uuid: 'AF987b827ec005000197687',
            name: 'IfcStephenHawking',
            categories: [
                'IfcWall',
                'IfcDoor',
            ],
        },
        cameraPosition: {
            x: 30,
            y: 70,
            z: 30,
        },
        done: false,
        notifications: {
            amount: 3,
            strong: true,
        },
    });

    // Edit this one if needed
    generatedTasks.push({
        _id: '765765827ec005000176657',
        onNoteOpen: () => { alert('Open note n° 59026b827ec0050001ac0cc9'); },

        position: {
            x: 20,
            y: 20,
            z: 70,
        },
        selected: true,
        linked_object: {
            uuid: '89768767b827ec005000765756',
            name: 'IfcStephenHawking',
            categories: [
                'IfcWall',
                'IfcDoor',
            ],
        },
        cameraPosition: {
            x: 20,
            y: 40,
            z: 70,
        },
        done: false,
        notifications: {
            amount: 2,
            strong: false,
        },
    });

    return generatedTasks;
}
