var roofCfg = {
    attr: {
        color: 0x404040,
        shading: THREE.FlatShading,
        shininess: 30,
        refractionRatio: 0.5
    }
};
var wallCfg = {
    offset: brickCfg.offset * 7 + brickCfg.offset / 4,
    attr: {
        color: 0xfefcb4,
        shading: THREE.FlatShading,
        shininess: 5,
        refractionRatio: 0.1
    }
};

function updateWalls(obj) {
    if (camera.position.z > 50) {
        obj.userData.wallN.visible = true;
        obj.userData.wallS.visible = true;
        obj.userData.wallE.visible = true;
        obj.userData.wallW.visible = true;
        return;
    }
    var dist = Math.sqrt(camera.position.x * camera.position.x +
        camera.position.y * camera.position.y);
    if (dist > environment.radius) {
        if (camera.position.y > 0) {
            obj.userData.wallN.visible = false;
            obj.userData.wallS.visible = true;
        } else {
            obj.userData.wallN.visible = true;
            obj.userData.wallS.visible = false;
        }
        if (camera.position.x > 0) {
            obj.userData.wallE.visible = false;
            obj.userData.wallW.visible = true;
        } else {
            obj.userData.wallE.visible = true;
            obj.userData.wallW.visible = false;
        }
        return;
    }
    var pline = camera.position.x * environment.height / environment.width;
    var nline = -camera.position.x * environment.height / environment.width;
    if (camera.position.y > pline) {
        if (camera.position.y > nline) {
            obj.userData.wallN.visible = false;
            obj.userData.wallS.visible = true;
            obj.userData.wallE.visible = true;
            obj.userData.wallW.visible = true;
        } else {
            obj.userData.wallN.visible = true;
            obj.userData.wallS.visible = true;
            obj.userData.wallE.visible = true;
            obj.userData.wallW.visible = false;
        }
    } else {
        if (camera.position.y > nline) {
            obj.userData.wallN.visible = true;
            obj.userData.wallS.visible = true;
            obj.userData.wallE.visible = false;
            obj.userData.wallW.visible = true;
        } else {
            obj.userData.wallN.visible = true;
            obj.userData.wallS.visible = false;
            obj.userData.wallE.visible = true;
            obj.userData.wallW.visible = true;
        }
    }
}

function createWalls(width, height, wallHeight) {
    var wallOff = wallCfg.offset;
    var brickOff = brickCfg.offset;
    var obj = new THREE.Object3D();
    var wallN = createWall(width + wallOff, 5, wallHeight, width / 4);
    var wallS = wallN.clone();
    wallN.addToObject(obj, 0, height / 2 + wallOff / 2, wallHeight / 2 - 6 *
        brickOff / 4);
    wallS.addToObject(obj, 0, -(height / 2 + wallOff / 2), wallHeight / 2 - 6 *
        brickOff / 4);
    obj.userData.wallN = wallN;
    obj.userData.wallS = wallS;
    var wallE = createWall(height + wallOff, 5, wallHeight, height / 4);
    var wallW = wallE.clone();
    wallE.rotation.z += Math.PI / 2;
    wallE.addToObject(obj, width / 2 + wallOff / 2, 0, wallHeight / 2 - 6 *
        brickOff / 4);
    wallW.rotation.z += Math.PI / 2;
    wallW.addToObject(obj, -(width / 2 + wallOff / 2), 0, wallHeight / 2 - 6 *
        brickOff / 4);
    obj.userData.wallE = wallE;
    obj.userData.wallW = wallW;
    obj.addFeatureGeometry('brick', BrickBoxGeometry(width, height));
    obj.bufferizeFeature('brick');
    obj.addFeatureMaterialP('brick', brickCfg.attr);
    obj.addFeatureGeometry('gravel', new THREE.PlaneGeometry(width + 4 *
        brickOff,
        height + 4 * brickOff,
        width * 3, height * 3));
    obj.addFeatureMaterialP('gravel', {
        color: 0x453834,
        shading: THREE.FlatShading,
        shininess: 60,
        refractionRatio: 0.8
    });
    obj.traverseGeometry(function(v) {
        v.z = perturb(0, 0.2) - 1;
    });
    obj.bufferizeFeature('gravel');
    obj.addFeatureGeometry('floor', new THREE.PlaneGeometry(1000, 1000));
    obj.bufferizeFeature('floor');
    obj.addFeatureMaterialL('floor', {
        color: 0xede2cb
    });
    obj.getFeature('floor')
        .geometry.translate(0, 0, -brickCfg.offset);
    obj.addUpdateCallback(updateWalls);
    obj.generateFeatures();
    obj.addToObject(scene);
}

function createWall(width, height, depth, numSeg) {
    numSeg = Math.floor(numSeg);
    var segWidth = width / numSeg;
    var wall = new THREE.Geometry();
    var roof = new THREE.Geometry();
    for (var i = 0; i < numSeg; i++) {
        var wallSeg = WallSegmentGeometry(segWidth, height, depth);
        var roofSeg = RoofSegmentGeometry(segWidth, height, depth);
        wallSeg.translate(segWidth * i, 0, 0);
        roofSeg.translate(segWidth * i, 0, 0);
        wall.mergeGeometry([wallSeg]);
        roof.mergeGeometry([roofSeg]);
    }
    var offset = -(numSeg - 1) * segWidth / 2;
    wall.translate(offset, 0, 0);
    roof.translate(offset, 0, 0);
    var obj = new THREE.Object3D();
    obj.addFeatureGeometry('wall', wall);
    obj.bufferizeFeature('wall');
    obj.addFeatureMaterialP('wall', wallCfg.attr);
    obj.addFeatureGeometry('roof', roof);
    obj.bufferizeFeature('roof');
    obj.addFeatureMaterialP('roof', roofCfg.attr);
    obj.generateFeatures();
    return obj
}

function RoofSegmentGeometry(width, height, depth) {
    var top = new THREE.ClosedCylinderGeometry(height / 6, height / 6, width,
        8, Math.floor(width));
    top.rotateX(Math.PI);
    top.rotateZ(Math.PI / 2);
    var tiles = new THREE.Geometry();
    for (var i = 0; i < 3; i++) {
        var disp = 3 * height / 4 * (i + 1) / 3;
        var tile = new THREE.BoxGeometry(width, disp, depth / 64);
        tile.translate(0, disp / 2, -i * depth / 64);
        tiles.mergeGeometry([tile]);
    }
    var pipe = new THREE.BoxGeometry(width / 8, depth / 16, height);
    pipe.translate(0, 0, -3 * height / 8);
    pipe.rotateX(Math.PI / 2);
    var tile1 = tiles.mergeGeometry([pipe]);
    var tile2 = tile1.clone();
    tile1.translate(0, height / 8, 0);
    tile1.rotateX(-Math.PI / 8);
    tile2.rotateZ(Math.PI);
    tile2.translate(0, -height / 8, 0);
    tile2.rotateX(Math.PI / 8);
    var roof = tile1.mergeGeometry([top, tile2]);
    for (var i = 0; i < roof.vertices.length; i++)
        roof.vertices[i].perturb(0.03);
    roof.translate(0, 0, depth / 2);
    return roof;
}

function WallSegmentGeometry(width, height, depth) {
    var wall = new THREE.BoxGeometry(width, 3 * height / 4, 3 * depth / 4, 3, 3,
        3);
    var wallTop = new THREE.BoxGeometry(width, height, depth / 4, 2, 2, 2);
    wallTop.translate(0, 0, 1 * depth / 4);
    return wall.mergeGeometry([wallTop]);
}