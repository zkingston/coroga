function updateWalls() {
    if ( camera.position.z > 50 ) {
        environment.wallN.visible = true;
        environment.wallS.visible = true;
        environment.wallE.visible = true;
        environment.wallW.visible = true;

        return;
    }

    var dist = Math.sqrt( camera.position.x * camera.position.x
            + camera.position.y * camera.position.y );

    if ( dist > environment.radius ) {
        if ( camera.position.y > 0 ) {
            environment.wallN.visible = false;
            environment.wallS.visible = true;
        } else {
            environment.wallN.visible = true;
            environment.wallS.visible = false;
        }

        if ( camera.position.x > 0 ) {
            environment.wallE.visible = false;
            environment.wallW.visible = true;
        } else {
            environment.wallE.visible = true;
            environment.wallW.visible = false;
        }

        return;
    }

    var pline = camera.position.x * environment.height / environment.width;
    var nline = -camera.position.x * environment.height / environment.width;

    if ( camera.position.y > pline ) {
        if ( camera.position.y > nline ) {
            environment.wallN.visible = false;
            environment.wallS.visible = true;
            environment.wallE.visible = true;
            environment.wallW.visible = true;
        } else {
            environment.wallN.visible = true;
            environment.wallS.visible = true;
            environment.wallE.visible = true;
            environment.wallW.visible = false;
        }
    } else {
        if ( camera.position.y > nline ) {
            environment.wallN.visible = true;
            environment.wallS.visible = true;
            environment.wallE.visible = false;
            environment.wallW.visible = true;
        } else {
            environment.wallN.visible = true;
            environment.wallS.visible = false;
            environment.wallE.visible = true;
            environment.wallW.visible = true;
        }
    }
}

function createWalls( width, height, wallHeight ) {

    var brickOffset = 3;
    var wallOffset = brickOffset * 7 + brickOffset / 4;

    var wallN = createWall( width + wallOffset, 5, wallHeight, width / 4 );
    var wallS = wallN.clone();
    wallN.position.y += height / 2 + wallOffset / 2;
    wallN.position.z += wallHeight / 2 - 6 * brickOffset / 4;
    scene.add( wallN );

    wallS.position.y -= height / 2 + wallOffset / 2;
    wallS.position.z += wallHeight / 2 - 6 * brickOffset / 4;
    scene.add( wallS );

    environment.wallN = wallN;
    environment.wallS = wallS;

    var wallE = createWall( height + wallOffset, 5, wallHeight, height / 4 );
    var wallW = wallE.clone();
    wallE.rotation.z += Math.PI / 2;
    wallE.position.x += width / 2 + wallOffset / 2;
    wallE.position.z += wallHeight / 2 - 6 * brickOffset / 4;
    scene.add( wallE );

    wallW.rotation.z += Math.PI / 2;
    wallW.position.x -= width / 2 + wallOffset / 2;
    wallW.position.z += wallHeight / 2 - 6 * brickOffset / 4;
    scene.add( wallW );

    environment.wallE = wallE;
    environment.wallW = wallW;

    var brickDepth = 3;

    var brickN1 = createBrickLayer( width + 2 * brickOffset, brickOffset, brickDepth, width / 4 );
    brickN1.position.y += height / 2 + brickOffset / 2;
    brickN1.position.z -= brickDepth / 2 - 0.2;

    var brickS1 = createBrickLayer( width + 2 * brickOffset, brickOffset, brickDepth, width / 4 );
    brickS1.position.y -= height / 2 + brickOffset / 2;
    brickS1.position.z -= brickDepth / 2 - 0.2;
    
    var brickE1 = createBrickLayer( height, brickOffset, brickDepth, height / 4 );
    brickE1.rotation.z += Math.PI / 2;
    brickE1.position.x += width / 2 + brickOffset / 2;
    brickE1.position.z -= brickDepth / 2 - 0.2;
    
    var brickW1 = createBrickLayer( height, brickOffset, brickDepth, height / 4 );
    brickW1.rotation.z += Math.PI / 2;
    brickW1.position.x -= width / 2 + brickOffset / 2;
    brickW1.position.z -= brickDepth / 2 - 0.2;

    var brickN2 = createBrickLayer( width + 6 * brickOffset, brickOffset, brickDepth, width / 4 );
    brickN2.position.y += height / 2 + brickOffset / 2 + brickOffset * 2;
    brickN2.position.z -= brickDepth / 2 - 0.2;

    var brickS2 = createBrickLayer( width + 6 * brickOffset, brickOffset, brickDepth, width / 4 );
    brickS2.position.y -= height / 2 + brickOffset / 2 + brickOffset * 2;
    brickS2.position.z -= brickDepth / 2 - 0.2;
    
    var brickE2 = createBrickLayer( height + 4 * brickOffset, brickOffset, brickDepth, height / 4 );
    brickE2.rotation.z += Math.PI / 2;
    brickE2.position.x += width / 2 + brickOffset / 2 + brickOffset * 2; 
    brickE2.position.z -= brickDepth / 2 - 0.2;
    
    var brickW2 = createBrickLayer( height + 4 * brickOffset, brickOffset, brickDepth, height / 4 );
    brickW2.rotation.z += Math.PI / 2;
    brickW2.position.x -= width / 2 + brickOffset / 2 + brickOffset * 2;
    brickW2.position.z -= brickDepth / 2 - 0.2;
    
    scene.add( brickN1 );
    scene.add( brickS1 );
    scene.add( brickE1 );
    scene.add( brickW1 );

    scene.add( brickN2 );
    scene.add( brickS2 );
    scene.add( brickE2 );
    scene.add( brickW2 );

    var gravGeo = new THREE.PlaneGeometry( width + 4 * brickOffset,
                                           height + 4 * brickOffset,
                                           width * 3, height * 3 );

    var gravMat = new THREE.MeshPhongMaterial( { color : 0x453834,
                                                 shading : THREE.FlatShading,
                                                 shininess : 60,
                                                 refractionRatio : 0.8 } );

    for ( var i = 0; i < gravGeo.vertices.length; i++ ) {
        var vertex = gravGeo.vertices[i];
        vertex.z = peturb( 0, 0.3 );
    }

    var gravMesh = new THREE.Mesh( gravGeo, gravMat );
    gravMesh.position.z -= 0.4;

    scene.add( gravMesh );
    
    var floorGeo = new THREE.PlaneGeometry( 1000, 1000 );
    var floorMat = new THREE.MeshPhongMaterial( { color : 0xede2cb,
        shading : THREE.FlatShading,
        shininess : 0 } );
    var floor = new THREE.Mesh( floorGeo, floorMat );
    floor.position.z = -brickOffset;

    scene.add( floor );
}

function createBase( width, height, depth ) {

    var offset = 1;
    var baseFloor = boxFactory( width + offset, height + offset, offset );
    baseFloor.position.z = -depth;

    var baseNorth = boxFactory( width + offset, offset, depth );
    baseNorth.position.y = height / 2;
    baseNorth.position.z = -depth / 2 + offset / 2;

    var baseSouth = boxFactory( width + offset, offset, depth );
    baseSouth.position.y = -height / 2;
    baseSouth.position.z = -depth / 2 + offset / 2;

    var baseEast = boxFactory( offset, height - offset, depth );
    baseEast.position.x = width / 2;
    baseEast.position.z = -depth / 2 + offset / 2;

    var baseWest = boxFactory( offset, height - offset, depth );
    baseWest.position.x = -width / 2;
    baseWest.position.z = -depth / 2 + offset / 2;

    var nub1 = boxFactory( offset, offset, offset );
    nub1.position.x = -width / 2;
    nub1.position.y = -height / 2;
    nub1.position.z = -depth - offset;

    var nub2 = nub1.clone();
    nub2.position.x += width;

    var nub3 = nub1.clone();
    nub3.position.y += height;

    var nub4 = nub2.clone();
    nub4.position.y += height;

    var geometry = mergeMeshGeometry( [ baseFloor,
            baseNorth,
            baseSouth,
            baseEast,
            baseWest,
            nub1, nub2, nub3, nub4 ] );
    var material = new THREE.MeshPhongMaterial( { color : 0x996633,
        shading : THREE.FlatShading,
        shininess : 5,
        refractionRatio : 0.1 } );

    base = new THREE.Mesh( geometry, material );
    base.receiveShadow = true;
    base.castShadow = true;

    var floorGeo = new THREE.PlaneGeometry( 1000, 1000 );
    var floorMat = new THREE.MeshPhongMaterial( { color : 0xede2cb,
        shading : THREE.FlatShading,
        shininess : 0 } );
    var floor = new THREE.Mesh( floorGeo, floorMat );
    floor.position.z = -depth - 2 * offset;

    scene.add( floor );
    scene.add( base );

    environment.floor = floor;
    environment.base = base;

}

function createWall( width, height, depth, numSeg ) {
    var wallAttr =  { color : 0xfefcb4,
        shading : THREE.FlatShading,
        shininess : 5,
        refractionRatio : 0.1 }

    var roofAttr = { color : 0x404040,
        shading : THREE.FlatShading,
        shininess : 30,
        refractionRatio : 0.5 }

    numSeg = Math.floor( numSeg );
    var segWidth = width / numSeg;

    var wallSegs = [];
    var roofSegs = [];
    for ( var i = 0; i < numSeg; i++ ) {
        var newSeg = createWallSegment( segWidth, height, depth );
        wallSegs.push( newSeg.wall );
        roofSegs.push( newSeg.roof );

        wallSegs[i].position.x += segWidth * i;
        roofSegs[i].position.x += segWidth * i;
    }

    var offset = -(numSeg - 1) * segWidth / 2;
    var wallGeo = mergeMeshGeometry( wallSegs );
    wallGeo.translate( offset, 0, 0 );
    var roofGeo = mergeMeshGeometry( roofSegs );
    roofGeo.translate( offset, 0, 0 );

    var wall = new THREE.Group();

    wall.add( meshWrap( wallGeo, wallAttr ) );
    wall.add( meshWrap( roofGeo, roofAttr ) ) ;

    return wall;

}

function createWallSegment( width, height, depth ) {

    var wall = boxFactory( width, 3 * height / 4, 3 * depth / 4 );
    var wallTop = boxFactory( width, height, depth / 4 );
    wallTop.position.z += 1 * depth / 4;

    var wallGeo = mergeMeshGeometry( [ wall, wallTop ] );
    var wallMesh = meshWrap( wallGeo );

    var roofTopGeo = new THREE.CylinderGeometry( height / 6, height / 6, width, 8, Math.floor( width ) );
    var roofTop = meshWrap( roofTopGeo );
    roofTop.rotateX( Math.PI );
    roofTop.rotateZ( Math.PI / 2 );

    var roofTiles = []
        for (var i = 0; i < 3; i++) {
            var disp = 3 * height / 4 * (i + 1) / 3;
            var tile = boxFactory( width, disp, depth / 64 );
            tile.position.z -= i * depth / 64;
            tile.position.y += disp / 2;
            roofTiles.push( tile );
        }

    var pipe = boxFactory( width / 8, depth / 16, height );
    pipe.position.y += 3 * height / 8;
    pipe.rotation.x += Math.PI / 2;
    roofTiles.push( pipe );

    var roofTile1 = meshWrap( mergeMeshGeometry( roofTiles ) );
    var roofTile2 = roofTile1.clone();

    roofTile1.rotation.x -= Math.PI / 8;
    roofTile1.position.y += height / 8;

    roofTile2.rotation.x += Math.PI / 8;
    roofTile2.position.y -= height / 8;
    roofTile2.rotation.z += Math.PI;

    var roofGeo = mergeMeshGeometry( [ roofTop, roofTile1, roofTile2 ] );
    for ( var i = 0; i < roofGeo.vertices.length; i++ ) {
        var vertex = roofGeo.vertices[i];
        vertex.x = perturb( vertex.x, 0.08 );
        vertex.y = perturb( vertex.y, 0.08 );
        vertex.z = perturb( vertex.z, 0.08 );

    }
    var roof = meshWrap( roofGeo );
    roof.position.z += depth / 2;

    return { wall : wallMesh, roof : roof };
}

var brickAttr = {
    color : 0xd9c5bf,
    shading : THREE.FlatShading,
    shininess : 30,
    refractionRatio : 0.2
}

function createBrickLayer( width, height, depth, numSeg ) {
    numSeg = Math.floor( numSeg );

    var segWidth = width / numSeg;

    var bricks = [];
    for ( var i = 0; i < numSeg; i++ ) {
        var brick = createBrick( segWidth, height, depth );
        bricks.push( brick );

        bricks[i].position.x += segWidth * i;
    }

    var offset = -(numSeg - 1) * segWidth / 2;
    var layer = mergeMeshGeometry( bricks );
    layer.translate( offset, 0, 0 );

    return meshWrap( layer, brickAttr );
}

function createBrick( width, height, depth ) {
    var brick = boxFactory( width, height, depth );

    for ( var i = 0; i < brick.geometry.vertices.length; i++ ) {
        var vertex = brick.geometry.vertices[i];
        vertex.x = perturb( vertex.x, 0.1 );
        vertex.y = perturb( vertex.y, 0.1 );
        vertex.z = perturb( vertex.z, 0.1 );
    }

    return brick;
}







