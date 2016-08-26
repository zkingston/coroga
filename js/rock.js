function RockClusterFactory( RockGeometry, width, height, depth ) {
    var x = width;
    var y = height;
    var z = depth;

    var rocks = new THREE.Object3D();
    rocks.addFeatureGeometry( 'rocks', RockGeometry( x, y, z ) );

    var chance = 0.3;

    while ( rand() > chance && x > 3 && y > 3 && z > 3 ) {
        for ( var i = 0; i < 2; i++ ) {
            x -= rand();
            y -= rand();
            z -= rand();

            var newRock = RockGeometry( x, y, z );
            newRock.scale( Math.random() / 2 + 0.4, 1, 1 );

            newRock.translate( randOffset( 0, 2 * width ),
                               randOffset( 0, 2 * height ),
                               -z / 2 );

            newRock.rotateZ( Math.random() * Math.PI );
            rocks.addFeatureGeometry( 'rocks', newRock );
        }

        chance += 0.2;
    }

    rocks.addFeatureMaterialP( 'rocks', { color : 0x505050,
                                          shading : THREE.FlatShading,
                                          shininess : 10,
                                          refractionRatio : 0.1 } )

    rocks.generateFeatures();
    return rocks;
}

function SpireRockGeometry( width, height, depth ) {
    var cfg = features.spireRock;

    width = Math.ceil( width );
    height = Math.ceil( height );
    depth = Math.ceil( depth );
    var diameter = Math.max( width, height );
    var b_rad = diameter / 2;
    var t_rad = continuousUniform( cfg.t_rad_range.min,
                                   cfg.t_rad_range.max ) * b_rad;

    var r_seg = discreteUniform( cfg.r_seg_range.min,
                                 cfg.r_seg_range.max ).even();

    var h_seg = discreteUniform( cfg.h_seg_range.min,
                                 cfg.h_seg_range.max ).even();

    var geometry = new THREE.ClosedCylinderGeometry(
        t_rad, b_rad, depth, r_seg, h_seg ).rotateX( Math.PI / 2 );

    var half_depth = depth / 2;
    geometry.vertices.map( function ( vertex ) {
        if ( Math.abs( vertex.z ) === half_depth ) {
            var s = vertex.z.sign();
            var r = continuousUniform( 0, cfg.top_perturb );
            if ( Math.abs( vertex.x ) < 0.001 && Math.abs( vertex.y ) < 0.001 ) {
                vertex.z += s * ( r + cfg.top_offset );
            } else {
                vertex.z += s * r;
            }
        }
    } );

    var rotate = continuousUniform( cfg.rotate.min, cfg.rotate.max );
    geometry.rotateX( rotate );

    var axis_vectors = [];
    var num_vectors = h_seg;
    for ( var v = 0; v < num_vectors; v++ ) {
        var r = continuousUniform( -0.7, 0.7 );
        var ar = Math.abs( r ) + 0.3;
        axis_vectors.push( new THREE.Vector3( continuousUniform( -ar, ar ) * b_rad,
                                              continuousUniform( -ar, ar ) * b_rad,
                                              r * half_depth ) );
    }

    geometry.vertices.map( function ( vertex ) {
        var internal = vertex.closest( axis_vectors ).clone();
        vertex.sub( internal.multiplyScalar( cfg.vector_mag ) );
    } );

    geometry.scale( width / diameter, height / diameter, 1 );
    geometry.rotateX( -rotate );

    return geometry;

    // OPTIMAL CONFIGS
    // t_rad_range : { min : 0.4,
    //                 max : 0.8 },
    // r_seg_range : { min : 5,
    //                 max : 10 },
    // h_seg_range : { min : 5,
    //                 max : 10 },
    // rotate      : { min : -Math.PI / 8,
    //                 max : Math.PI / 8 },
    // vector_mag  : 0.3,
    // top_perturb : 0.5,
    // top_offset  : 0.3

}

function generateSpireRock( xPos, yPos ) {
    var x = Math.floor( rand() * 6 + 3 );
    var y = Math.floor( rand() * 6 + 3 );
    var z = Math.floor( rand() * 6 + 2 );

    var rock = RockClusterFactory( SpireRockGeometry, x, y, z );

    try {
        rock.addToObjectProject( environment.island,
                                 xPos,
                                 yPos );
        rippleSand( 2, rock );
    } catch ( e ) {
        console.log( e );
    }
}

function generateMossyRock( xPos, yPos ) {
    var x = Math.floor( rand() * 6 + 3 );
    var y = Math.floor( rand() * 6 + 3 );
    var z = Math.floor( rand() * 6 + 2 );

    var rock = RockClusterFactory( SpireRockGeometry, x, y, z );

    var rockGeo = rock.getFeature( 'rocks' ).geometry;
    rock.addFeatureGeometry( 'moss',
                             extrudeFaces( rockGeo, 0.8, 1,
                                           z / 4, z, 0.01 ) );
    rock.addFeatureGeometry( 'moss',
                             extrudeFaces( rockGeo, 0.5, 1,
                                           z / 4, z, 0.01, new THREE.Vector3(0, 1, 0 ) ) );

    rock.addFeatureMaterialP( 'moss', { color : 0x73f773,
                                        shading : THREE.FlatShading,
                                        shininess : 0,
                                        refractionRatio : 0.1 } )
    rock.generateFeatures();

    try {
        rock.addToObjectProject( environment.island,
                                 xPos,
                                 yPos );
        rippleSand( 2, rock );
    } catch ( e ) {
        console.log( e );
    }
}
