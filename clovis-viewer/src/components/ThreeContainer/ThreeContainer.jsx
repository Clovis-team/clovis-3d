
/**
 * ^Clement : To understand the implementation of Three.js in React, read this article :
 * https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0
 */
import _ from 'lodash';

import React, { Component } from 'react';
import threeEntryPoint from './threeEntryPoint';

import './ThreeContainer.css';

class ThreeContainer extends Component {
    constructor(props) {
        super(props);
        // this.buildingGltfPath = '/gltfs/Project1-assimp.gltf';
        this.buildingGltfPath = 'gltfs/15-assimp.gltf';

        const getRandomArbitrary = (min, max) => Math.round(Math.random() * (max - min) + min);

        const generatedTasks = [];
        // Randomly generated tasks
        for (let i = 0; i <= 30; i += 1) {
            const RandomArbitraryID = getRandomArbitrary(1000, 100000);
            generatedTasks.push({
                _id: RandomArbitraryID,
                onNoteOpen: () => { alert(`Open note n° ${RandomArbitraryID}`); },

                '3d_datas': {
                    x: getRandomArbitrary(0, 80),
                    y: getRandomArbitrary(0, 80),
                    z: getRandomArbitrary(0, 20),
                    selected: false,
                    linked_object: {
                        uuid: getRandomArbitrary(1000, 100000),
                        name: 'Jacuzzi',
                        categories: [
                            'IfcCovering',
                            'IfcColumn',
                        ],
                    },
                    camera_position: {
                        x: getRandomArbitrary(0, 80),
                        y: getRandomArbitrary(0, 80),
                        z: getRandomArbitrary(0, 20),
                    },
                    done: _.sample([true, false]),
                    notification: _.sample(['none', 'low', 'high']),
                },
            });
        }

        // Edit this one if needed
        generatedTasks.push({
            _id: '59026b827ec0050001ac0cc9',
            onNoteOpen: () => { alert('Open note n° 59026b827ec0050001ac0cc9'); },

            '3d_datas': {
                x: 20,
                y: 40,
                z: 30,
                selected: true,
                linked_object: {
                    uuid: 'AF987b827ec005000197687',
                    name: 'IfcStephenHawking',
                    categories: [
                        'IfcWall',
                        'IfcDoor',
                    ],
                },
                camera_position: {
                    x: 30,
                    y: 70,
                    z: 30,
                },
                done: false,
                notification: 'high',
            },
        });

        this.ViewerOptions = {
            LocalizedNotes: generatedTasks,
            Modules: {
                Select: {
                    active: true,
                    options: {
                        StandardButtons: {
                            // Smart is both 'GoTo' or 'GoThru' if it's a door
                            SmartGo: true,
                            GoCloser: true,
                        },
                        CustomButtons: [
                            {
                                name: 'AddTask',
                                text: 'Créer une tâche',
                                icon: '+', // Could also be html node
                                color: '#00b16a',
                                ClickFunction: (ObjectDatas) => {
                                    alert('Add Task, here is the ObjectDatas :');
                                    console.log('ObjectDatas : ', ObjectDatas);
                                },
                            },
                            {
                                name: 'ShowObjectInfos',
                                text: 'Voir les infos BIM',
                                icon: '☷', // Could also be html node
                                ClickFunction: (ObjectDatas) => {
                                    alert('Add Task, here is the ObjectDatas :');
                                    console.log('ObjectDatas : ', ObjectDatas);
                                },
                            },
                        ],
                    },
                },
                HorizontalSection: {
                    active: true,
                    options: {},
                },
                Explosion: {
                    active: true,
                    options: {},
                },
                BimMenu: {
                    active: true,
                    options: {},
                },
            },
            Background: {
                // Type could also be 3d model
                type: 'sky',
                options: {
                    // We can bring many options here
                },
            },
        };
    }

    componentDidMount() {
        const threeRootElement = this.threeRootElement;
        const buildingGltfPath = this.buildingGltfPath;
        const ViewerOptions = this.ViewerOptions;

        const threeControllers = threeEntryPoint(
            threeRootElement,
            buildingGltfPath,
            ViewerOptions,
        );
    }

    render() {
        return (
            <div
                ref={element => this.threeRootElement = element}
                className="canvas-wrapper"
                id="clovis-viewer-container"
          />
        );
    }
}


export default ThreeContainer;
