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
    islandGeo.verticesNeedUpdate = true;

    island.addFeatureGeometry( 'base', islandGeo );
    island.addFeatureMaterialP( 'base', { color : 0x566053, shading : THREE.FlatShading } );

    island.addFeatureGeometry( 'grass', MossDecorator( islandGeo, 0.9, 1 ) );
    // island.addFeatureGeometry( 'grass', MossDecorator( islandGeo, 0, 0.3 ) );
    island.addFeatureMaterialP( 'grass', { color : 0x73f773, shading : THREE.FlatShading } );
    
    island.bufferizeFeature( 'base' );

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

function MossDecorator( geo, min, max ) {

    geo.computeFaceNormals();

    var mossGeo = new THREE.Geometry();
    mossGeo.vertices = new Array( geo.vertices.length );
    for ( var i = 0; i < geo.vertices.length; ++i )
        mossGeo.vertices[ i ] = geo.vertices[ i ].clone();

    var mossAngle = new THREE.Vector3( 0, 0, 1 );

    for ( var i = 0; i < geo.faces.length; i++ ) {
        var face = geo.faces[i];

        var dot = face.normal.dot( mossAngle );
        if ( dot < max && dot > min ) {
            console.log( dot );
            var va = mossGeo.vertices[face.a];
            var vb = mossGeo.vertices[face.b];
            var vc = mossGeo.vertices[face.c];

            va.z += 0.1;
            vb.z += 0.1;
            vc.z += 0.1;
            mossGeo.faces.push(face.clone());
        }
    }

    return mossGeo;

}
