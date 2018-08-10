
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

            <div
                id="three-progress-container"
                className="three-progress-container loading"
        >
          <div
                  id="three-loader"
                  className="three-loader loading"
                >
                  <div className="three-loader-spinner" />


                </div>
          <div
                  id="three-progress-text"
                  className="three-progress-text"
                >
                  Chargement
                </div>
        </div>

          { isViewerOpened
                ? <ThreeContainer />
                : 'Loading Viewer...'
            }

        </div>
    );
};


export default ThreePopup;
