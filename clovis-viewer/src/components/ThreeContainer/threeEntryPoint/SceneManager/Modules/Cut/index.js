function Cut(renderer) {
    const plane = {
        normal: new THREE.Vector3(0, -1, 0),
        constant: 5,
    };


    const globalPlane = new THREE.Plane(plane.normal, plane.constant);

    // console.log(globalPlane);

    window.gui.add(globalPlane, 'constant', 0, 20);

    renderer.clippingPlanes = [globalPlane];
}


export default Cut;
