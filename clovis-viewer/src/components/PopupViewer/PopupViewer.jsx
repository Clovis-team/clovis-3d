
import React from 'react';
import './PopupViewer.css';

import ThreeJsCanvas from '../ThreeJsCanvas/ThreeJsCanvas'



const PopupViewer = ({ isViewerOpened, OnViewerClose }) => {

  const popupClassName = `popup-viewer ${isViewerOpened ? 'popup-viewer-open' : ''}`

  return (
    <div className={popupClassName}>

      <div 
        className="close-button"
        onClick={e => OnViewerClose()}
      >
        X
      </div>

      <ThreeJsCanvas />

    </div>
  )

};


export default PopupViewer;
