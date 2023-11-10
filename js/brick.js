var brickCfg = {
    depth: 3,
    offset: 3,
    attr: {
        color: 0xd9c5bf,
        shading: THREE.FlatShading,
        shininess: 0,
        refractionRatio: 0.2
    }
};

function BrickBoxGeometry(width, height) {
    var offset = brickCfg.offset;
    var depth = brickCfg.depth;
    var brickN1 = BrickLayerGeometry(width + 2 * offset, offset, depth, width /
        4);
    brickN1.translate(0, height / 2 + offset / 2, 0);
    var brickS1 = BrickLayerGeometry(width + 2 * offset, offset, depth, width /
        4);
    brickS1.translate(0, -(height / 2 + offset / 2), 0);
    var brickE1 = BrickLayerGeometry(height, offset, depth, height / 4);
    brickE1.rotateZ(Math.PI / 2);
    brickE1.translate(width / 2 + offset / 2, 0, 0);
    var brickW1 = BrickLayerGeometry(height, offset, depth, height / 4);
    brickW1.rotateZ(Math.PI / 2);
    brickW1.translate(-(width / 2 + offset / 2), 0, 0);
    var brickN2 = BrickLayerGeometry(width + 6 * offset, offset, depth, width /
        4);
    brickN2.translate(0, height / 2 + offset / 2 + offset * 2, 0);
    var brickS2 = BrickLayerGeometry(width + 6 * offset, offset, depth, width /
        4);
    brickS2.translate(0, -(height / 2 + offset / 2 + offset * 2), 0);
    var brickE2 = BrickLayerGeometry(height + 4 * offset, offset, depth,
        height / 4);
    brickE2.rotateZ(Math.PI / 2);
    brickE2.translate(width / 2 + offset / 2 + offset * 2, 0, 0);
    var brickW2 = BrickLayerGeometry(height + 4 * offset, offset, depth,
        height / 4);
    brickW2.rotateZ(Math.PI / 2);
    brickW2.translate(-(width / 2 + offset / 2 + offset * 2), 0, 0);
    var box = new THREE.Geometry();
    return box.mergeGeometry([brickN1,
        brickE1,
        brickS1,
        brickW1,
        brickN2,
        brickE2,
        brickS2,
        brickW2
    ]);
}

function BrickLayerGeometry(width, height, depth, numSeg) {
    var layer = new THREE.Geometry();
    numSeg = Math.floor(numSeg);
    var segWidth = width / numSeg;
    for (var i = 0; i < numSeg; i++) {
        var brick = BrickGeometry(segWidth, height, depth);
        brick.translate(segWidth * i, 0, 0);
        layer.mergeGeometry([brick]);
    }
    var offset = -(numSeg - 1) * segWidth / 2;
    layer.translate(offset, 0, -brickCfg.depth / 4);
    return layer;
}

function BrickGeometry(width, height, depth) {
    var brick = new THREE.BoxGeometry(width, height, depth, 2, 2, 1);
    for (var i = 0; i < brick.vertices.length; i++)
        brick.vertices[i].perturb(0.05);
    return brick;
}