
/**
 * ^Clement : To understand the implementation of Three.js in React, read this article :
 * https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0
 */

import React, { Component } from 'react';
import threeEntryPoint from './threeEntryPoint';

import './ThreeContainer.css';

class ThreeContainer extends Component {
    constructor(props) {
        super(props);
        // this.buildingGltfPath = '/gltfs/Project1-assimp.gltf';
        this.buildingGltfPath = '../../gltfs/15-assimp.gltf';
        this.beautifullDatasFromReact = {
            x: 12,
            y: 24,
            z: 36,
            cameraType: 'first-view',
            hiddenElements: [
                'roof',
                'ceilings',
                'floor 1',
            ],
            explosion: [
                true,
                20,
            ],
            color: 'red',
            tasks: [
                {},
                {},
            ],
        };
    }

    componentDidMount() {
        const threeControllers = threeEntryPoint(
            this.threeRootElement,
            this.buildingGltfPath,
            this.beautifullDatasFromReact,
        );
        // console.log('>>>> threeControllers :', threeControllers);

        // this.ToggleWalking = threeControllers.ToggleWalking;


        // this.ToggleWalking();
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
