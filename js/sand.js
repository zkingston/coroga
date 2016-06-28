var rakeModifier = 6;
var rakeHeight = 0.125;

var sandRandom = 0.125;

var sideRakeBuffer = 10;

function createSand( width, height ) {

    var geometry = new THREE.PlaneGeometry( width, height, width * 2, height * 2 );

    // var texture = THREE.ImageUtils.loadTexture('img/sand.png');
    var material = new THREE.MeshPhongMaterial( { color : 0xfcfbdf,
                                                  shading : THREE.FlatShading,
                                                  shininess : 10,
                                                  refractionRatio : 0.5 } );

    for ( var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];

        if ( Math.abs( vertex.x ) > width / 2 - sideRakeBuffer ) {
            vertex.z = peturb( Math.cos( vertex.x * rakeModifier ) * rakeHeight, sandRandom );
        } else {
            vertex.z = peturb( Math.sin( vertex.y * rakeModifier ) * rakeHeight, sandRandom );
        }
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

