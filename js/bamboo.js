function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(getRandom(min, max));
}

/* Creates a stalk of bamboo
    radius: Thickness of the bamboo at the base
    height: Height of the stalk
*/
function bambooFactory(x, y, bush) {
    var cfg = features.bamboo;

    var stalk = new THREE.Object3D();

    //Create the "shoot", the plant without the joints
    var radius = cfg.radius.value + (Math.random() * cfg.radius.variance);
    var height = cfg.height.value + (Math.random() * cfg.height.variance);

    stalk.addFeatureGeometry( "bamboo", new THREE.CylinderGeometry( radius,
                                                                    radius,
                                                                    height,
                                                                    32,
                                                                    1,
                                                                    false));
    stalk.addFeatureMaterialL( "bamboo", { color: cfg.shootColor,
                                           side: THREE.DoubleSide} );
    //stalk.rotation.x = cfg.tilt.value + (Math.random() * cfg.tilt.variance);
    stalk.rotation.x = cfg.tilt.value;


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
        var offset = (Math.random() * cfg.jointSpacing.value)
                - cfg.jointSpacing.value/2;

        //Rotate joint so that it is upright
        jointGeo.rotateY( cfg.tilt.value );
        jointGeo.translate( 0, -height/2, 0 );
        jointGeo.translate( 0,
                            jointStart + offset,
                            0);

        stalk.addFeatureGeometry( "joints", jointGeo );
        jointStart+= cfg.jointSpacing.value;
    }

    stalk.addFeatureMaterialL( "joints",
             new THREE.MeshLambertMaterial( {color: cfg.jointColor} ));
    stalk.generateFeatures();

    stalk.addToObject(bush, x + Math.random() * 2, y + Math.random() * 2, height/2);
    return stalk;
}

function generateBambooBush(xPos, yPos) {
    console.log(xPos, yPos);
    var bush = new THREE.Object3D();
    for (var i = 0; i < 10; i++) {

        bambooFactory(xPos, yPos, bush);
    }
    bush.addToObject(environment.sand, xPos, yPos, 0);
}

