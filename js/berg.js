/**
 * Create an island base, with the rock, grass, sand, and covering snow for the mountain.
 *
 * @param { number } width Radial width of island
 * @param { number } height Radial height of island
 *
 * @return { THREE.Object3d } A new island object
 */
function islandCreate(width, height) {
    var cfg = features.island;
    var island = new THREE.Object3D();
    // Set environmental data.
    island.userData.width = width;
    island.userData.height = height;
    islandAddBase(island);
    //islandAddSand( island );
    // Bowl out the island's shape
    island.traverseGeometry(function(vertex) {
        var dist = Math.pow(vertex.x, 2) + Math.pow(vertex.y, 2);
        vertex.z -= cfg.bowl * dist;
    })
    islandAddGrass(island);
    islandAddSnow(island);
    // Can't bufferize sand as it may be rippled by other objects
    island.bufferizeFeature('base');
    island.bufferizeFeature('grass');
    island.bufferizeFeature('snow');
    island.generateFeatures();
    // Add the update callback that will give gentle sway / raise the island
    // when spawned
    island.addUpdateCallback(function(obj) {
        // Rise up if we were placed lower
        if (obj.position.z < 0) {
            obj.position.z += cfg.animation.raise;
            islandWobble(obj);
        }
        // Gently oscillate
        else {
            lock = false;
            obj.clearUpdateCallbacks();
            // Fun hack to switch the update callback
            obj.addUpdateCallback(function(obj) {
                obj.position.z = Math.sin(cfg.animation.zWobble
                        .scale * tick) * cfg.animation.zWobble
                    .mult;
                islandWobble(obj);
            });
        }
    });
    return island;
}

function islandWobble(obj) {
    var cfg = features.island.animation;
    obj.rotation.x = Math.sin(cfg.xWobble.scale * tick) * cfg.xWobble.mult;
    obj.rotation.y = Math.cos(cfg.yWobble.scale * tick) * cfg.yWobble.mult;
}

function islandSwitch() {
    var cfg = features.island;
    var animCfg = cfg.animation;
    lock = true;
    environment.island.clearUpdateCallbacks();
    environment.island.addUpdateCallback(function(obj) {
        obj.position.z += animCfg.raise;
        islandWobble(obj);
        if (obj.position.z > animCfg.threshold)
            garbage.push(obj);
    });
    var islandWidth = discreteUniform(cfg.width.min, cfg.width.max);
    var islandHeight = discreteUniform(cfg.height.min, cfg.height.max);
    var newIsland = islandCreate(islandWidth, islandHeight);
    newIsland.addToObject(scene);
    newIsland.position.z = -animCfg.threshold;
    environment.island = newIsland;
    environment.width = islandWidth * 2;
    environment.height = islandHeight * 2;
}

function rippleSand(diameter, object) {
    return
    var island = environment.island;
    var cfg = features.island.sand;
    var bound = object.boundingCircle();
    var center = object.localToWorld(bound.center);
    island.traverseFeatureGeometry('sand', function(v) {
        var dist = center.distanceTo(v);
        if (dist <= diameter + bound.radius) {
            v.z += Math.cos(dist * cfg.modifier) * cfg.height * 1.2;
        }
    });
}

function islandAddBase(island) {
    var cfg = features.island.base;
    var width = island.userData.width;
    var height = island.userData.height;
    var radius = Math.min(width, height);
    // Get our noise generators for the top and bottom of the island. Double
    // width / height as these specify radius not diameter.
    var topNoise = new Noise(2 * width, 2 * height);
    var botNoise = new Noise(2 * width, 2 * height);
    var massCenter = function(x, y, percent) {
        // A&B are dimensions of island, ab are dimensions of % *center of mass
        var A = width / 2;
        var B = height / 2;
        // #algebra; Turns out pB^2 = b^2
        var a = Math.sqrt(percent * A * A);
        var b = Math.sqrt(percent * B * B);
        if (((x * x) / (a * a)) + ((y * y) / (b * b)) < 1) {
            return true
        } else {
            return false;
        }
    }
    // Create and scale island geometry to be ellipsoid
    var base = new THREE.IcosahedronGeometry(radius, cfg.detail);
    base.scale(width / radius, height / radius, 1);
    // Find the highest point on the island while we are doing the noising pass
    var max = new THREE.Vector3();
    base.vertices.map(function(vertex) {
        // Use bottom noise generator, with a little smoother scale ( 200 )
        if (vertex.z < 0) {
            // This function is a bit magic, but it works. Causes exponential
            // spiking of heights to get nicer topography.
            // Width & height are added to make values non-negative.
            vertex.z *= cfg.noise.spike *
                Math.exp(botNoise.turbulence(vertex.x + width,
                    vertex.y + height,
                    cfg.noise.bottom));
            // Use top noies generator, we don't care if it's noisier as it will be squashed later
        } else {
            //Proposed Ush Change
            vertex.z = continuousUniform(0.1, 1);
            //Original Zak Code
            // vertex.z *= cfg.noise.spike *
            //     Math.exp( topNoise.turbulence( vertex.x + width,
            //                                    vertex.y + height,
            //                                    cfg.noise.top ) );
            // // Keep track of max value
            // if( massCenter( vertex.x, vertex.y, 0.99 ) == false ) {
            //     // But only if it is sufficiently far from the center of mass.
            //     if ( vertex.z > max.z) {
            //         max = vertex;
            //     }
            // }
        }
    });
    // Hulk squash
    max = max.clone();
    base.vertices.map(function(vertex) {
        // Use inverse sigmoid function to squash values farther away from peak, but still keep a smooth descent.
        if (vertex.z > 0) {
            var dist = vertex.distanceTo(max);
            vertex.z *= 1 / (1 + Math.exp(cfg.peak.mult * dist / (cfg
                .peak.reduce * radius) - cfg.peak.shift))
            // Displace lower half a little bit as the squashing will cause a pile up of vertices. Makes it look more natural.
        } else {
            vertex.z -= cfg.displace;
        }
        // Bend all vertices down on a parabola away from the island's center.
        vertex.perturb(cfg.perturb);
    });
    // Add mountain to userdata
    island.userData.mountain = {
        center: max,
        radius: 6
    };
    // Create island base feature
    island.addFeatureGeometry('base', base);
    island.addFeatureMaterialP('base', cfg.material);
};

function islandAddSand(island) {
    var cfg = features.island.sand;
    var width = island.userData.width;
    var height = island.userData.height;
    // Create some nice sand areas
    var numSand = discreteUniform(1, cfg.maxPatch);
    island.userData.sands = [];
    for (var i = 0; i < numSand; ++i) {
        // Let's make some sand - get the offset from center the sand bowl will be
        // placed and the sand pit's dimensions
        var sandXOff = continuousUniform(0, width / 2);
        var sandYOff = continuousUniform(0, height / 2);
        var sandWidth = 2 * width - 2 * sandXOff;
        var sandHeight = 2 * height - 2 * sandYOff;
        var sandRad = Math.min(sandWidth, sandHeight);
        var sand = new THREE.PlaneGeometry(sandWidth, sandHeight,
            sandWidth, sandHeight);
        var sandWidth2 = Math.pow(sandWidth, 2);
        var sandHeight2 = Math.pow(sandHeight, 2);
        // Cut out all face not inside the bounding ellipse
        sand.cut(function(face) {
            var centroid = sand.faceCentroid(face);
            // Ellipsoid inequality
            if ((Math.pow(centroid.x, 2) / sandWidth2 +
                    Math.pow(centroid.y, 2) / sandHeight2) > 1)
                return false;
            return true;
        });
        // Rake the sand
        sand.vertices.map(function(vertex) {
            vertex.z = Math.sin(vertex.x * cfg.modifier) * cfg.height +
                2;
            vertex.z -= 20 * (Math.pow(vertex.x, 2) / sandWidth2 +
                Math.pow(vertex.y, 2) / sandHeight2);
        });
        var sandX = discreteUniform(-1, 1)
            .sign() * sandXOff;
        var sandY = discreteUniform(-1, 1)
            .sign() * sandYOff;
        // Translate
        sand.translate(sandX, sandY, 0);
        // Add sand to userdata
        island.userData.sands.push({
            center: new THREE.Vector3(sandX, sandY, 0),
            width: sandWidth,
            height: sandHeight
        });
        island.addFeatureGeometry('sand', sand);
    }
    island.addFeatureMaterialP('sand', cfg.material);
};

function islandAddGrass(island) {
    var cfg = features.island.grass;
    var base = island.getFeature('base')
        .geometry;
    for (var i = 0; i < cfg.extrusions.length; ++i) {
        var e = cfg.extrusions[i];
        island.addFeatureGeometry('grass',
            extrudeFaces(base, e.dMin, e.dMax,
                e.zMin, e.zMax, e.offset));
    }
    // Distort the grass so we can let some sand features come through.
    var grass = island.getFeature('grass')
        .geometry;
    island.addFeatureMaterialP('grass', cfg.material);
};

function islandAddSnow(island) {
    var cfg = features.island.snow;
    var base = island.getFeature('base')
        .geometry;
    for (var i = 0; i < cfg.extrusions.length; ++i) {
        var e = cfg.extrusions[i];
        island.addFeatureGeometry('snow',
            extrudeFaces(base, e.dMin, e.dMax,
                e.zMin, e.zMax, e.offset));
    }
    island.addFeatureMaterialP('snow', cfg.material);
};