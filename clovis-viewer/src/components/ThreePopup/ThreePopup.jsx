
import React from 'react';
import './ThreePopup.css';

import ThreeContainer from '../ThreeContainer/ThreeContainer';


const ThreePopup = ({ isViewerOpened, OnViewerClose }) => {
    const popupClassName = `popup-viewer ${isViewerOpened ? 'popup-viewer-open' : ''}`;

    return (
        <div className={popupClassName}>

            <div
            className="popup-close-button"
                onClick={e => OnViewerClose()}
          >
          X
          </div>
            <div
            id="gui-container"
            className="gui-container"
          />
        <div
                id="stats-container"
                className="stats-container"
            />

            { isViewerOpened
                ? <ThreeContainer />
                : 'Loading Viewer...'
            }

      </div>
    );
};


export default ThreePopup;
