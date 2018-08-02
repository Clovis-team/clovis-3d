import React, { Component } from 'react';

import ThreePopup from './components/ThreePopup/ThreePopup';
import './App.css';
import logo from './assets/logo/clovis-white.svg'


class App extends Component {


  constructor() {
    super()
    this.state = {
      isViewerOpened: true,
    }
  }

  OnViewerOpen = () => {
    this.setState({
      isViewerOpened: true,
    })
  }

  OnViewerClose = () => {
    this.setState({
      isViewerOpened: false,
    })
  }

  render() {

    return (
      <div className="App">

        <div 
          className="viewer-button"
          onClick={(e) => this.OnViewerOpen()}
        >
          <img 
            src={logo}
            className="App-logo"
            alt="logo"
          />
          <p>
            Open Clovis viewer
          </p>
        </div>


        <ThreePopup
          isViewerOpened={this.state.isViewerOpened}
          OnViewerClose={this.OnViewerClose}
        />
      </div>
    )
  }


};

export default App;


