
var mothProperties = {size: 0.15,
                      flightRadius: 1.5,
                      velocity: 0.1
                    };


function updateMoths() {

  var m = mothProperties;
  var moths = environment.moths;
  var origins = environment.mothVector;
    for ( var i = 0; i < moths.length; i++ ) {
        var moth = moths[i];
        var origin = origins[i];

        x = tick * m.velocity

        // Triple Cardiod/Rose Curve
        moth.position.x = (1.5 * cos(x) - cos(4 * x)) * m.flightRadius + origin.x
        moth.position.y = (1.5 * sin(x) - sin(4 * x)) * m.flightRadius + origin.y
        moth.position.z = sin(x) *m.flightRadius + origin.z

    }
}

function mothFactory(lantern) {
    var m = mothProperties;
    if ( !environment.moths ) {
        environment.moths = []
        environment.mothVector = []
    }

    var moth = sphereFactory(         m.size,
                                     { transparent : true,
                                       opacity : 0.7,
                                       color : 0xffffff,
                                       side : THREE.DoubleSide,
                                       shading : THREE.FlatShading,
                                       shininess : 100,
                                       emissive : 0xffffff
                                     } );


    // DEPENDS ON WHICH PARAMETRIC CURVE
    moth.position.x = lantern.position.x;
    moth.position.y = lantern.position.y;
    moth.position.z = lantern.position.z;

    origin = new THREE.Vector3(moth.position.x, moth.position.y,moth.position.z)

    environment.moths.push( moth );
    environment.mothVector.push(origin);
    return moth;
}
