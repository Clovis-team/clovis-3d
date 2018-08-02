
import React from 'react';
import './ThreePopup.css';

import ThreeContainer from '../ThreeContainer/ThreeContainer'



const ThreePopup = ({ isViewerOpened, OnViewerClose }) => {

  const popupClassName = `popup-viewer ${isViewerOpened ? 'popup-viewer-open' : ''}`

  return (
    <div className={popupClassName}>

      <div 
        className="close-button"
        onClick={e => OnViewerClose()}
      >
        X
      </div>

      { isViewerOpened ?
        <ThreeContainer /> :
        'Loading Viewer...'
      }

    </div>
  )

};


export default ThreePopup;
