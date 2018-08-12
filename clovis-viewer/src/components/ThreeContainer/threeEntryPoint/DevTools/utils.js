import dat from 'dat.gui/build/dat.gui.module';
import Stats from 'stats.js/src/Stats';
import RendererStats from '@xailabs/three-renderer-stats';
import { type } from 'os';

/** Stats is the Three.js Stats panel on bottom left */
export function loadStats() {
    window.stats = new Stats();
    window.stats.setMode(1);
    window.stats.showPanel(0);
    window.stats.dom.style = {
        position: 'absolute',
        bottom: 0,
        right: 0,
    };
    document.getElementById('stats-container').appendChild(window.stats.dom);
    return window.stats;
}

export function loadRendererStats() {
    window.rendererStats = new RendererStats();
    window.rendererStats.domElement.style = {
        position: 'absolute',
        bottom: 0,
        right: 0,
    };

    document.getElementById('stats-container').appendChild(window.rendererStats.domElement);

    return window.rendererStats;
}
