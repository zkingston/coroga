THREE.Object3D.prototype.getFeature( feature ) {
    if ( typeof this.userData.features === 'undefined' )
        this.userData.features = {};

    if ( !( feature in this.userData.features ) )
        this.userData.features[ feature ] = {
            geometry : undefined,
            material : undefined
        };

    return this.userData.features[ feature ];
}

THREE.Object3D.prototype.addFeatureGeometry( feature, geometry ) {
    var f = this.getFeature( feature );

    if ( typeof f.geometry === 'undefined' )
        f.geometry = geometry.clone();
    else
        f.geometry.mergeGeometry( [ geometry ] );

    return this;
}

THREE.Object3D.prototype.bufferizeFeature( feature ) {
    var f = this.getFeature( feature );
    f.geometry = new THREE.BufferGeometry().fromGeometry( f.geometry );

    return this;
}

THREE.Object3D.prototype.updateFeatures() {
    for ( var f in this.userData.features )
        f.geometry.computeFaceNormals();

    return this;
}

THREE.Object3D.prototype.addFeatureMaterial( feature, attributes ) {
    var f = this.getFeature( feature );
    f.material = new THREE.MeshLambertMaterial( attributes );

    return this;
}

THREE.Object3D.prototype.addFeatureMaterialFancy( feature, material ) {
    var f = this.getFeature( feature );
    f.material = material;

    return this;
}

THREE.Object3D.prototype.generateFeatures() {
    for ( var c in this.children )
        this.remove( c );

    for ( var f in this.userData.features )
        this.add( new THREE.Mesh( f.geometry, f.material ) );

    return this;
}

THREE.Object3D.prototype.addToObject( object, x, y, z ) {
    if ( typeof x !== 'undefined' )
        this.translateX( x );

    if ( typeof y !== 'undefined' )
        this.translateY( y );

    if ( typeof z !== 'undefined' )
        this.translateZ( z );

    object.add( this );

    return this;
}
