
function createCanvas(document, container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
}

// TODO : @Nicola delete this function, i just wondered to show you how to
// manage multiple exports from one file
function createCanvas2(document, container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
}

export {
    createCanvas,
    createCanvas2,
};
