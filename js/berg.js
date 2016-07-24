function Noise( width, height ) {
    this.width = Math.round( width );
    this.height = Math.round( height );

    this.noise = new Array( this.width );
    for ( var i = 0; i < this.width; ++i )
        this.noise[ i ] = new Array( this.height );

    for ( var x = 0; x < this.width; ++x )
        for ( var y = 0; y < this.height; ++y )
            this.noise[ x ][ y ] = continuousUniform( 0, 1 );
}

Noise.prototype.smoothNoise = function ( x, y ) {
    var xint = Math.round( x );
    var yint = Math.round( y );
    var xfrac = x % 1;
    var yfrac = y % 1;

    var x1 = ( xint + this.width ) % this.width;
    var y1 = ( yint + this.height ) % this.height;
    var x2 = ( x1 + this.width - 1 ) % this.width;
    var y2 = ( y1 + this.height - 1 ) % this.height;

    var value = 0;
    value += xfrac         * yfrac         * this.noise[ x1 ][ y1 ];
    value += ( 1 - xfrac ) * yfrac         * this.noise[ x2 ][ y1 ];
    value += xfrac         * ( 1 - yfrac ) * this.noise[ x1 ][ y2 ];
    value += ( 1 - xfrac ) * ( 1 - yfrac ) * this.noise[ x2 ][ y2 ];

    return value;
};

Noise.prototype.turbulence = function ( x, y, size ) {
    var value = 0;
    var initialSize = size;

    while ( size >= 1 ) {
        value += this.smoothNoise( x / size, y / size ) * size;
        size /= 1.3;
    }

    return value / initialSize;
}

function createIsland ( width, height ) {
    var island = new THREE.Object3D();

    var radius = Math.min( width, height );
    var topNoise = new Noise( 2 * width, 2 * height );
    var botNoise = new Noise( 2 * width, 2 * height );


    var islandGeo = new THREE.IcosahedronGeometry( radius, 3 );

    var max = new THREE.Vector3();
    islandGeo.vertices.map( function ( vertex ) {
        if ( vertex.z < 0 ) {
            vertex.z *= 0.08 * Math.exp(  botNoise.turbulence( vertex.x + width, vertex.y + height, 200 ) );
        } else {
            vertex.z *= 0.08 * Math.exp(  topNoise.turbulence( vertex.x + width, vertex.y + height, 100 ) );

            if ( vertex.z > max.z )
                max = vertex;
        }
    } );

    max = max.clone();
    islandGeo.vertices.map( function ( vertex ) {
        if ( vertex.z > 0 ) {
            var dist = vertex.distanceTo( max );
            vertex.z *= 1 / ( 1 + Math.exp( 12 * dist / (1.2 * radius)  - 4))
        } else {
            vertex.z -= 3;
        }

        vertex.perturb( 0.5 );
        vertex.z -= 0.003 * (Math.pow( vertex.x, 2 ) + Math.pow( vertex.y, 2 ));
    } );

    islandGeo.scale( width / radius, height / radius, 1 );

    island.addFeatureGeometry( 'base', islandGeo );
    island.addFeatureMaterialP( 'base', { color : 0x566053,
                                          shading : THREE.FlatShading,
                                          shininess : 10,
                                          refractionRatio : 0.1 } );

    // Grass
    island.addFeatureGeometry( 'grass', extrudeFaces( islandGeo, 0.8, 1.0, 0, 10, 0.01 ) );
    island.addFeatureGeometry( 'grass', extrudeFaces( islandGeo, -1, 1, -10, 0, 0.01 ) );

    var grass = island.getFeature( 'grass' ).geometry;
    grass.vertices.map( function ( vertex ) {
        var v = new THREE.Vector3( max.x, max.y, vertex.z );
    } );


    island.addFeatureMaterialP( 'grass', { color : 0x73f773,
                                           shading : THREE.FlatShading,
                                           shininess : 0,
                                           refractionRatio : 0.1 } );

    island.addFeatureGeometry( 'snow', extrudeFaces( islandGeo, 0.3, 1, 20, 100, 0.2 ) );
    island.addFeatureMaterialP( 'snow', { color : 0xffffff,
                                          shading : THREE.FlatShading,
                                          emissive : 0xaaaaaa,
                                          shininess : 70,
                                          refractionRatio : 0.7 } );

    island.bufferizeFeature( 'base' );
    island.bufferizeFeature( 'grass' );
    island.bufferizeFeature( 'snow' );

    island.generateFeatures();

    island.addUpdateCallback( function( obj ) {
        // obj.rotateZ( 0.001 );
        obj.position.z = Math.sin( 0.005 * tick ) * 3;
        obj.rotation.x = Math.sin( 0.005 * tick ) * 0.03;
        obj.rotation.y = Math.cos( 0.005 * tick ) * 0.03;
    } );

    island.addToObject( scene );

    island.userData.width = width;
    island.userData.height = height;

    environment.island = island;
    environment.width = width * 2;
    environment.height = height * 2;
}

function extrudeFaces( geometry, dMin, dMax, zMin, zMax, offset ) {

    geometry.computeFaceNormals();

    var extrude = new THREE.Geometry();

    extrude.vertices = new Array( geometry.vertices.length );
    for ( var i = 0; i < geometry.vertices.length; ++i )
        extrude.vertices[ i ] = geometry.vertices[ i ].clone();

    var mossAngle = new THREE.Vector3( 0, 0, 1 );

    for ( var i = 0; i < geometry.faces.length; i++ ) {
        var face = geometry.faces[i];

        var dot = face.normal.dot( mossAngle );
        if ( dot < dMax && dot > dMin ) {
            var va = extrude.vertices[ face.a ];
            var vb = extrude.vertices[ face.b ];
            var vc = extrude.vertices[ face.c ];

            var z = ( va.z + vb.z + vc.z );
            if ( z < zMax * 3 && z > zMin * 3 ) {
                var normal = face.normal.multiplyScalar( offset );
                va.add( normal );
                vb.add( normal );
                vc.add( normal );
                extrude.faces.push(face.clone());
            }
        }
    }

    return extrude;

}
