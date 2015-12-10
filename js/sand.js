var rakeModifier = 4;
var rakeHeight = 0.125;

var sandRandom = 0.125;

function createSand( width, height ) {

    var geometry = new THREE.PlaneGeometry( width, height, width * 2, height * 2 );

    // var texture = THREE.ImageUtils.loadTexture('img/sand.png');
    var material = new THREE.MeshPhongMaterial( { color : 0xfcfbdf,
                                                  shading : THREE.FlatShading,
                                                  shininess : 10,
                                                  refractionRatio : 0.5 } );

    for ( var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];
        vertex.z = peturb( Math.sin( vertex.y * rakeModifier ) * rakeHeight, sandRandom );
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var sand = new THREE.Mesh( geometry, material );
    sand.receiveShadow = true;
    sand.castShadow = true;

    scene.add( sand );

    environment.sand = sand;
}

function rippleSand( diameter, object ) {

    if ( !object.geometry.boundingBox ) {
        object.geometry.computeBoundingBox();
    }

    var bbMax = object.geometry.boundingBox.max;
    bbMax = new THREE.Vector2( bbMax.x, bbMax.y );

    var center = object.geometry.center();
    center = new THREE.Vector2( center.x, center.y );

    var radius = center.distanceTo( bbMax );

    center.x += object.position.x;
    center.y += object.position.y;

    var sand = environment.sand;

    for ( var i = 0; i < sand.geometry.vertices.length; i++ ) {
        var vertex = sand.geometry.vertices[i];
        var dist = center.distanceTo( vertex );

        if ( dist <= diameter + radius ) {
            vertex.z = peturb( Math.cos( dist * rakeModifier ) * rakeHeight, sandRandom );
        }
    }

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
