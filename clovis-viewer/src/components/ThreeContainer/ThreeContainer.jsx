
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
            generatedTasks.push({
                _id: getRandomArbitrary(1000, 100000),
                '3d_datas': {
                    x: getRandomArbitrary(0, 80),
                    y: getRandomArbitrary(0, 80),
                    z: getRandomArbitrary(0, 20),
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
            '3d_datas': {
                x: 20,
                y: 40,
                z: 30,
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

        this.DatasFromReact = {
            selectedTask: {
                _id: '59026b827ec0050001ac0cc9',
            },
            allTasks: generatedTasks,
        };
    }

    addTask = (ThreeData) => {
        alert('Add Task, here is the THreeData :');
        console.log('ThreeData : ', ThreeData);
    }

    componentDidMount() {
        const threeRootElement = this.threeRootElement;
        const buildingGltfPath = this.buildingGltfPath;
        const DatasFromReact = this.DatasFromReact;
        const addTask = this.addTask;

        const threeControllers = threeEntryPoint(
            threeRootElement,
            buildingGltfPath,
            DatasFromReact,
            addTask,
        );
    }

    render() {
        return (
            <div
                ref={element => this.threeRootElement = element}
                className="canvas-wrapper"
          />

        //   <button
        //     onClick={(e)=> this.ToggleWalking()}>
        //   </button>
        );
    }
}


export default ThreeContainer;
