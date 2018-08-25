
import React from 'react';
import './ThreePopup.css';

import ThreeContainer from '../ThreeContainer/ThreeContainer';


const ThreePopup = ({ isViewerOpened, OnViewerClose }) => {
    const popupClassName = `popup-viewer ${isViewerOpened ? 'popup-viewer-open' : ''}`;

    return (
      <div
          className={popupClassName}
          id="popup-viewer"
        >

          <div
              className="popup-close-button"
              onClick={e => OnViewerClose()}
            >
            ✕
            </div>

          <div
              id="three-clovis-buttons-container"
              className="three-clovis-buttons-container"
            />
          <div
              id="three-clovis-menu-container"
              className="three-clovis-menu-container"
            />
          <div
                id="three-help-popup-container"
                className="three-help-popup-container"
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
