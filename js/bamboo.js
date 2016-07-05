function getRandom( min, max ) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(getRandom(min, max));
}

/* Creates a stalk of bamboo
    radius: Thickness of the bamboo at the base
    height: Height of the stalk
*/
function bambooFactory( bush, x, y ) {
    var cfg = features.bamboo;

    var stalk = new THREE.Object3D();

    //Create the "shoot", the plant without the joints
    var radius = cfg.radius.value + (Math.random() * cfg.radius.variance * cfg.radius.value );
    var height = cfg.height.value + (Math.random() * cfg.height.variance * cfg.height.value );

    var stalkGeo = new THREE.CylinderGeometry( radius, radius, height, 32, 1, false );
    stalkGeo.rotateX( cfg.tilt.value );
    stalkGeo.translate( x, y, height/2 );
    bush.addFeatureGeometry( "bamboo", stalkGeo );

    //Start the joints one "jointSpacing" length up the shoot. That is, we do
    //not want a joint at the bottom of the stalk
    var jointStart = cfg.jointSpacing.value;
    var joints = new THREE.Object3D();

    //Create the joints
    while (height > jointStart + cfg.jointSpacing.variance) {

        //Generate joint properties with shoot properties * modifiers
        var jointGeo = new THREE.CylinderGeometry( radius * cfg.jointThickness,
                                                   radius * cfg.jointThickness,
                                                   height * cfg.jointHeight,
                                                   32, 5, false );
        var offset = (Math.random() * cfg.jointSpacing.variance)
                - cfg.jointSpacing.variance/2;

        //Rotate joint so that it is upright
        jointGeo.rotateX( cfg.tilt.value );
        jointGeo.translate( x, y,
                            jointStart + offset );

        bush.addFeatureGeometry( "joints", jointGeo );
        jointStart+= cfg.jointSpacing.value + offset;
    }
}

function isColliding( points, x, y ) {
    for (var i = 0; i < points.length; i++) {
        if (Math.pow( features.bamboo.radius.value, 2 ) >
                Math.pow( x - points[i][0], 2 ) + Math.pow( y - points[i][1], 2 ) ) {
            return true;
        }
    }
    return false;
}

function generateBambooBush(xPos, yPos) {
    var cfg = features.bamboo;
    var bush = new THREE.Object3D();
    var points = []
    for (var i = 0; i < 25; i++) {
        var x = Math.random() * tiles.bambooBush.size.x - tiles.bambooBush.size.x/2;
        var y = Math.random() * tiles.bambooBush.size.y - tiles.bambooBush.size.y/2;
        var flag = isColliding( points, x, y );
        while (flag) {
            x = Math.random() * tiles.bambooBush.size.x - tiles.bambooBush.size.x/2;
            y = Math.random() * tiles.bambooBush.size.y - tiles.bambooBush.size.y/2;
            flag = isColliding( points, x, y)
        }
        points.push( [ x, y ] );
        bambooFactory( bush, x, y );
    }
    bush.addFeatureMaterialP( "bamboo", { color: cfg.shootColor,
                                          shading: THREE.FlatShading,
                                          reflectivity: 0.5,
                                          refractionRatio: 0.5,
                                          side: THREE.DoubleSide
                                        } );
    bush.addFeatureMaterialP( "joints", { color: cfg.jointColor,
                                          reflectivity: 0.5,
                                          refractionRatio: 0.5,
                                          shading: THREE.FlatShading,
                                        } );
    bush.bufferizeFeature( "bamboo" );
    bush.bufferizeFeature( "joints" );
    bush.generateFeatures();
    bush.addToObject( environment.sand, xPos, yPos, 0 );
    rippleSand( 6, bush );
}
