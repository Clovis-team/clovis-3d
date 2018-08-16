function onKeyPress(event) {
    // Utilitary to show hide the stats as gui does on H shortcut
    if (event.key === 'h' && typeof document.getElementById('stats-container') !== 'undefined') {
        console.log('H PRESSED :');
        console.log('document.getElementById(`stats-container`).style :', document.getElementById('stats-container').style);
        if (document.getElementById('stats-container').style.display === 'block'
            || document.getElementById('stats-container').style.display === ''
        ) {
            console.log('OK ITS VISIBLE:');
            document.getElementById('stats-container').style.display = 'none';
        } else {
            console.log('OK ITS NOT VISIBLE:');
            document.getElementById('stats-container').style.display = 'block';
        }
    }
}

function onResize(canvas, SceneManager) {
    // Change canvas
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    SceneManager.resizeCanvas();
}


export default {
    onResize,
    onKeyPress,
};
