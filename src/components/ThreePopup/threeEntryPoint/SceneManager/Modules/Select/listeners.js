import {
    onDocumentMouseClick,
    onDocumentTouchEnd,
    ChangeCursorOnHover,
} from './controllers';

export default function Listeners({
    scene, camera, mouse, buildingDatas, canvas, ViewerOptions, raycaster, objSel, SelectOptions, renderer, modulesObject
}) {
    // Don't trigger the Select if the user rotates the camera with mouse
    let mouseMoved = false;

    document.addEventListener('mousedown', () => {
        mouseMoved = false;
    }, false);
    document.addEventListener('mousemove', (event) => {
        mouseMoved = true;

        ChangeCursorOnHover({
            event, mouse, raycaster, buildingDatas, camera,
        });
    }, false);
    document.addEventListener('mouseup', (event) => {
        if (mouseMoved === false) {
            onDocumentMouseClick({
                event,
                scene,
                camera,
                mouse,
                buildingDatas,
                canvas,
                ViewerOptions,
                raycaster,
                objSel,
                SelectOptions,
                renderer,
                modulesObject, 
            });
        }
    }, false);


    // Don't trigger the Select if the user rotates the camera with touch
    // Hack for touch because `mousemove` isn't triggered on the canvas because
    // of THREE.OrbitControls which include event.preventDefault(); and
    // event.stopPropagation(); for `mousemove`.
    let select_timeout_id = 0;
    const select_hold_time = 200;
    let select_timeOutPassed = false;

    document.addEventListener('touchstart', () => {
        select_timeOutPassed = false;
        select_timeout_id = setTimeout(() => {
            select_timeOutPassed = true;
        }, select_hold_time);
    }, false);
    document.addEventListener('touchend', (event) => {
        clearTimeout(select_timeout_id);
        if (select_timeOutPassed === false) {
            onDocumentTouchEnd({
                event,
                scene,
                camera,
                mouse,
                buildingDatas,
                canvas,
                ViewerOptions,
                raycaster,
                objSel,
                SelectOptions,
                renderer,
                modulesObject, 
            });
        }
    }, false);
}
