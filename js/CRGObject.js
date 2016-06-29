THREE.Object3D.prototype.getFeature = function( feature ) {
    if ( typeof this.userData.features === 'undefined' )
        this.userData.features = {};

    if ( !( feature in this.userData.features ) )
        this.userData.features[ feature ] = {
            geometry : undefined,
            material : undefined
        };

    return this.userData.features[ feature ];
};

THREE.Object3D.prototype.addFeatureGeometry = function( feature, geometry ) {
    var f = this.getFeature( feature );

    if ( typeof f.geometry === 'undefined' )
        f.geometry = geometry;
    else
        f.geometry = f.geometry.mergeGeometry( [ geometry ] );

    return this;
}

THREE.Object3D.prototype.bufferizeFeature = function( feature ) {
    var f = this.getFeature( feature );
    f.geometry = new THREE.BufferGeometry().fromGeometry( f.geometry );
    f.buffered = true;

    return this;
}

THREE.Object3D.prototype.updateFeatures = function() {
    for ( var f in this.userData.features ) {
        f = this.userData.features[ f ];
        f.geometry.computeFaceNormals();
        f.geometry.computeVertexNormals();
    }

    return this;
}

THREE.Object3D.prototype.addFeatureMaterialL = function( feature, attributes ) {
    var f = this.getFeature( feature );
    f.material = new THREE.MeshLambertMaterial( attributes );

    return this;
}

THREE.Object3D.prototype.addFeatureMaterialP = function( feature, attributes ) {
    var f = this.getFeature( feature );
    f.material = new THREE.MeshPhongMaterial( attributes );
    return this;
}

THREE.Object3D.prototype.generateFeatures = function() {
    for ( var c in this.children ) {
        if ( c.type == 'mesh' )
            this.remove( c );
    }

    this.updateFeatures();
    for ( var f in this.userData.features ) {
        f = this.userData.features[ f ];
        var mesh = new THREE.Mesh( f.geometry, f.material );
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        mesh.type = 'mesh';

        this.add( mesh );
    }

    return this;
}

THREE.Object3D.prototype.addToObject = function( object, x, y, z ) {
    if ( typeof x !== 'undefined' )
        this.position.x = x;

    if ( typeof y !== 'undefined' )
        this.position.y = y;

    if ( typeof z !== 'undefined' )
        this.position.z = z;


    object.add( this );
    this.updateMatrixWorld();

    return this;
}

/**
 * Traverses overall all vertices contained inside an object.
 * Callback accepts a Vector3.
 */
THREE.Object3D.prototype.traverseFeatureGeometry = function( callback ) {
    this.traverseVisible( function ( obj ) {
        for ( var f in obj.userData.features ) {
            f = obj.userData.features[ f ];
            if ( f.buffered ) // TODO: Handle BufferGeometry
                continue;

            for ( var i = 0, l = f.geometry.vertices.length; i < l; i++ )
                callback( f.geometry.vertices[ i ] );
        }
    });

    return this;
}

THREE.Object3D.prototype.boundingCircle = function( ) {
    if ( typeof this.userData.boundingCircle !== 'undefined' )
        return this.userData.boudingCircle;

    var center = new THREE.Vector3();
    var outer = new THREE.Vector3();
    var n = 0;

    this.traverseFeatureGeometry( function ( v ) {
        center.add( v );
        n++;
    });

    center.divideScalar( n );
    center.z = 0;
    var ca = center.abs();

    var m = 0;
    this.traverseFeatureGeometry( function ( v ) {
        var t = v.clone();
        t.z = 0;

        var d = t.sub( ca ).l2();
        if ( d > m ) {
            m = d;
            outer.copy( t );
        }
    });

    var r = outer.abs().sub( center.abs() );

    this.userData.boundingCenter = { center : center,
                                     radius : Math.sqrt( r.l2() ) };

    return this.userData.boundingCircle;
}
