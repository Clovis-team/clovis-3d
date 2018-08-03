
/** 
 * ^Clement : To understand the implementation of Three.js in React, read this article :
 * https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0
 */

import React, { Component } from 'react';
import threeEntryPoint from './threejs/threeEntryPoint';

import './ThreeContainer.css';

class ThreeContainer extends Component {

  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }

  render() {
    return (
      <div 
        ref={element => this.threeRootElement = element}
        className="canvas-wrapper"
      />
    )
  }
};


export default ThreeContainer;
