var rakeModifier = 6;
var rakeHeight = 0.125;
var sandRandom = 0.125;
var sideRakeBuffer = 10;

function createSand( width, height ) {
    var obj = new THREE.Object3D();

    obj.addFeatureGeometry( 'sand',
                            new THREE.PlaneGeometry( width, height, width * 2, height * 2 ) );

    obj.addFeatureMaterialP( 'sand', { color : 0xfcfbdf,
                                       shading : THREE.FlatShading,
                                       shininess : 10,
                                       refractionRatio : 0.5 } );

    obj.traverseFeatureGeometry( function ( v ) {
        if ( Math.abs( v.x ) > width / 2 - sideRakeBuffer ) {
            v.z = peturb( Math.cos( v.x * rakeModifier ) * rakeHeight, sandRandom );
        } else {
            v.z = peturb( Math.sin( v.y * rakeModifier ) * rakeHeight, sandRandom );
        }
    } );

    obj.generateFeatures();
    obj.addToObject( scene );

    obj.userData.width = width;
    obj.userData.height = height;

    environment.sand = obj;
}

function rippleSand( diameter, object ) {
    var bound = object.boundingCircle();
    var center = object.localToWorld( bound.center );

    var sand = environment.sand;

    sand.traverseFeatureGeometry( function ( v ) {
        var dist = center.distanceTo( v );

        if ( dist <= diameter + bound.radius ) {
            if ( Math.abs( v.x ) < sand.userData.width / 2 - sideRakeBuffer )
                v.z = peturb( Math.cos( dist * rakeModifier ) * rakeHeight, sandRandom );
        }
    } );
}

