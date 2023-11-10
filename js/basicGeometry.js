function mergeMeshGeometry(meshes) {
    var combined = new THREE.Geometry();
    for (var i = 0; i < meshes.length; i++) {
        if (!meshes[i]) {
            continue;
        }
        meshes[i].updateMatrix();
        combined.merge(meshes[i].geometry, meshes[i].matrix);
    }
    return combined;
}

function peturb(value, range) {
    return value + (Math.random() * range) - (range / 2);
}

function boxFactory(width, height, depth, attributes) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    return meshWrap(geometry, attributes);
}

function sphereFactory(radius, attributes) {
    var geometry = new THREE.SphereGeometry(radius);
    return meshWrap(geometry, attributes);
}

function meshWrap(geometry, attributes) {
    var material = new THREE.MeshPhongMaterial(attributes);
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}