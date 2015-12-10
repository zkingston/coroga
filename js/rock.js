var rockClusters = [];

function basicRockFactory( width, height, depth, attributes ) {

    var geometry = new THREE.BoxGeometry( width, height, 0.01, width * 2, height * 2, 10 );

    var axis = new THREE.Vector3( peturb( 0, width ), peturb( 0, height ), 0 );
    var maxDist = Math.sqrt( width * width + height * height );

    for ( var i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];
        vertex.x = peturb( vertex.x, 0.1 );
        vertex.y = peturb( vertex.y, 0.1 );

        if ( vertex.z == 0.005 ) {
            vertex.z = peturb( ( maxDist - vertex.distanceTo( axis ) ) * 3 * depth / 4, depth / 4 );
        }
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var material = new THREE.MeshPhongMaterial( { color : 0x202020,
                                                  shading : THREE.FlatShading,
                                                  shininess : 20,
                                                  refractionRatio : 0.1 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    rockClusters.push( mesh );

    return mesh;

}
