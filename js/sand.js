var rakeModifier = 6;
var rakeHeight = 0.125;
var sandRandom = 0.08;
var sideRakeBuffer = 5;

function createSand(width, height) {
    var obj = new THREE.Object3D();
    obj.addFeatureGeometry('sand',
        new THREE.PlaneGeometry(width, height, width * 2, height * 2));
    obj.addFeatureMaterialP('sand', {
        color: 0xfcfbdf,
        shading: THREE.FlatShading,
        shininess: 10,
        refractionRatio: 0.5
    });
    obj.traverseGeometry(function(v) {
        if (Math.abs(v.x) > width / 2 - sideRakeBuffer) {
            v.z = perturb(Math.cos(v.x * rakeModifier) * rakeHeight,
                sandRandom);
        } else {
            v.z = perturb(Math.sin(v.y * rakeModifier) * rakeHeight,
                sandRandom);
        }
    });
    obj.generateFeatures();
    obj.addToObject(scene);
    obj.userData.width = width;
    obj.userData.height = height;
    environment.sand = obj;
}

function rippleSand(diameter, object) {
    return
    var bound = object.boundingCircle();
    var center = object.localToWorld(bound.center);
    var sand = environment.sand;
    sand.traverseFeatureGeometry('sand', function(v) {
        var dist = center.distanceTo(v);
        if (dist <= diameter + bound.radius) {
            if (Math.abs(v.x) < sand.userData.width / 2 -
                sideRakeBuffer)
                v.z = randOffset(Math.cos(dist * rakeModifier) *
                    rakeHeight * 1.2, sandRandom);
        }
    });
}