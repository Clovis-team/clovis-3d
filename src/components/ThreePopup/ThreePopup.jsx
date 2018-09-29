
/**
 * ^Clement : To understand the implementation of Three.js in React, read this article :
 * https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0
 */

import React, { Component } from 'react';
import threeEntryPoint from './threeEntryPoint';

import './clovis-3d-viewer.css';
import './ThreePopup.css';

import generatedTasks from './fixtures/tasks';

class ThreePopup extends Component {
    constructor(props) {
        super(props);
        // this.buildingGltfPath = '/gltfs/Project1-assimp.gltf';
        // this.buildingGltfPath = 'https://s3-eu-west-1.amazonaws.com/clovis/15-assimp.gltf';
        this.buildingGltfPath = 'gltfs/15-assimp.gltf';

        this.ViewerOptions = {
            LocalizedNotes: generatedTasks(),
            Modules: {
                Select: {
                    active: true,
                    options: {
                        StandardButtons: {
                            SeeBimInfos: true,
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
                    active: false,
                    options: {},
                },
                Walk: {
                    active: true,
                    options: {},
                },
                Label: {
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
        this.destroy = threeControllers.destroy;
    }

    render() {
        const popupClassName = `popup-viewer ${this.props.isViewerOpened ? 'popup-viewer-open' : ''}`;

        return (
          <div
              className={popupClassName}
              id="popup-viewer"
            >

              <div
                  className="popup-close-button"
                  onClick={e => this.props.OnViewerClose()}
                >
                ✕
                </div>

              { this.props.isViewerOpened
                    ? (
                      <div
                          ref={element => this.threeRootElement = element}
                          className="clovis-3d-viewer-container"
                          id="clovis-viewer-container"
                        />
                    )
                    : 'Loading Viewer...'
                }

            </div>
        );
    }
}

export default ThreePopup;
