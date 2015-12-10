function lanternFactory( width, height, depth, postDepth ) {

    var lantern = new THREE.Group();

    var lightContainer = boxFactory( width / 2,
                                     height / 2,
                                     depth / 2,
                                     {
                                     } );

    lantern.traverse( function( object ) {

        if ( object instanceof THREE.Mesh ) {
            object.castShadow = true;
            object.receiveShadow = true;
        }

    } );

    return lantern;

}
