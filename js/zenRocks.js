// Rock Geometry Components -----------------------------------------------------------------
var rock_cfg = {
    "flat": {
        "height": {
            min: 3,
            max: 5
        },
        "diameter": {
            min: 12,
            max: 15
        }
    },
    "tall": {
        "height": {
            min: 15,
            max: 21
        },
        "diameter": {
            min: 9,
            max: 11
        }
    },
    "short": {
        "height": {
            min: 6,
            max: 9
        },
        "diameter": {
            min: 9,
            max: 11
        }
    },
    "reclining": {
        "height": {
            min: 10,
            max: 12
        },
        "diameter": {
            min: 18,
            max: 21
        }
    },
    "arched": {
        "height": {
            min: 9,
            max: 15
        },
        "diameter": {
            min: 15,
            max: 18
        }
    }
}

function HexLatticeRockGeometry(width, length, height) {
    var cfg = {
        t_rad_range: {
            min: 0.4,
            max: 0.8
        },
        r_seg_range: {
            min: 5,
            max: 10
        },
        h_seg_range: {
            min: 5,
            max: 10
        },
        rotate: {
            min: -Math.PI / 8,
            max: Math.PI / 8
        },
        vector_mag: 0.3,
        top_perturb: 0.5,
        top_offset: 0.3
    }
    width = Math.ceil(width);
    length = Math.ceil(length);
    height = Math.ceil(height);
    var diameter = Math.max(width, length);
    var b_rad;
    var t_rad;
    b_rad = diameter / 2;
    t_rad = continuousUniform(cfg.t_rad_range.min,
        cfg.t_rad_range.max) * b_rad;
    var r_seg = discreteUniform(cfg.r_seg_range.min,
            cfg.r_seg_range.max)
        .even();
    var h_seg = discreteUniform(cfg.h_seg_range.min,
            cfg.h_seg_range.max)
        .even();
    var geometry = new THREE.ClosedCylinderGeometry(
            t_rad, b_rad, height, r_seg, h_seg)
        .rotateX(Math.PI / 2);
    var half_height = height / 2;
    geometry.vertices.map(function(vertex) {
        if (Math.abs(vertex.z) === half_height) {
            var s = vertex.z.sign();
            var r = continuousUniform(0, cfg.top_perturb);
            if (Math.abs(vertex.x) < 0.001 && Math.abs(vertex.y) <
                0.001) {
                vertex.z += s * (r + cfg.top_offset);
            } else {
                vertex.z += s * r;
            }
        }
    });
    var rotate = continuousUniform(cfg.rotate.min, cfg.rotate.max);
    geometry.rotateX(rotate);
    var axis_vectors = [];
    var num_vectors = h_seg;
    for (var v = 0; v < num_vectors; v++) {
        var r = continuousUniform(-0.7, 0.7);
        var ar = Math.abs(r) + 0.3;
        axis_vectors.push(new THREE.Vector3(continuousUniform(-ar, ar) * b_rad,
            continuousUniform(-ar, ar) * b_rad,
            r * half_height));
    }
    geometry.vertices.map(function(vertex) {
        var internal = vertex.closest(axis_vectors)
            .clone();
        vertex.sub(internal.multiplyScalar(cfg.vector_mag));
    });
    geometry.scale(width / diameter, length / diameter, 1);
    geometry.rotateX(-rotate);
    geometry.translate(0, 0, 0) // half_height - 3)
    return geometry;
}
// TODO: PUT HEIGHT IN TERMS OF MAX RADIUS INSTEAD OF HARDCODE
// TODO: Rename to maxdiameter.
function flatRock() {
    var diameter = continuousUniform(rock_cfg.flat.diameter.min, rock_cfg.flat
        .diameter.max);
    var height = continuousUniform(rock_cfg.flat.height.min, rock_cfg.flat
        .height.max);
    var geometry = HexLatticeRockGeometry(
        diameter,
        continuousUniform(.8, 1) * diameter,
        height
    );
    return geometry;
}

function tallRock(maxRadius) {
    var diameter = continuousUniform(rock_cfg.tall.diameter.min, rock_cfg.tall
        .diameter.max);
    var height = continuousUniform(rock_cfg.tall.height.min, rock_cfg.tall
        .height.max);
    var geometry = HexLatticeRockGeometry(
        diameter,
        continuousUniform(.8, 1) * diameter,
        height
    );
    return geometry;
}

function shortRock(maxRadius) {
    var diameter = continuousUniform(rock_cfg.short.diameter.min, rock_cfg.short
        .diameter.max);
    var height = continuousUniform(rock_cfg.short.height.min, rock_cfg.short
        .height.max);
    var geometry = HexLatticeRockGeometry(
        diameter,
        continuousUniform(.8, 1) * diameter,
        height
    );
    return geometry;
}

function archedRock(maxRadius) {
    var diameter = continuousUniform(rock_cfg.arched.diameter.min, rock_cfg
        .arched.diameter.max);
    var height = continuousUniform(rock_cfg.arched.height.min, rock_cfg.arched
        .height.max);
    var geometry = HexLatticeRockGeometry(
        diameter,
        diameter,
        height
    );
    //Rocks arent indexed by their goddamn base.
    // Find the base offset.
    var randomDirection = function() {
        return new THREE.Vector3(
                continuousUniform(-1, 1),
                continuousUniform(-1, 1),
                0)
            .normalize();
    }
    var xyAngle = function(v1, v2) {
        var x1 = new THREE.Vector2(v1.x, v1.y);
        var x2 = new THREE.Vector2(v2.x, v2.y);
        var angle = Math.acos(x1.dot(x2) / (x1.length() * x2.length()));
        return angle;
    }
    var randVec = randomDirection();
    var cutoffAngle = pi * 0.25;
    geometry.vertices.map(
        function(v) {
            if (v.z < 0) {
                var vv = new THREE.Vector3(v.x, v.y, v.z);
                // Push point into 0,0,0 proportional to how well it aligns with randVec
                var angle = xyAngle(randVec, vv);
                if (angle < cutoffAngle) {
                    v.x = 0;
                    v.y = 0;
                }
            }
        }
    );
    return geometry;
}

function reclineRock(maxRadius) {
    var diameter = continuousUniform(rock_cfg.reclining.diameter.min, rock_cfg
        .reclining.diameter.max);
    var height = continuousUniform(rock_cfg.reclining.height.min, rock_cfg
        .reclining.height.max);
    var geometry = HexLatticeRockGeometry(
        diameter,
        diameter,
        height
    );
    geometry.scale(.3, 1, 1);
    //var vertices = geometry.vertices;
    //var maxVertex = vertices.slice().reduce(function(maxV,testV){return maxV.z > testV.z ? maxV : testV}, vertices[0]);
    // maxVertex.z = maxVertex.z + 5;
    return geometry;
}
// Shintai - Horizontal & Flat / Water
// Taido - Tall / Wood
// Shigyo - Arched & Branched / Fire
// Kikyaku - Reclining / Earth
// Reisho - Low & Vertical / Metal
// Rock Materials --------------------------------------------------------------------------
function igneousMaterial() {
    return {
        color: 0x505050,
        shading: THREE.FlatShading,
        shininess: 10,
        refractionRatio: 0.1
    };
}

function RockGeometryAggregator(geometries, positions, material) {
    var length = Math.min(geometries.length, positions.length)
    var rocks = new THREE.Object3D();
    for (var i = 0; i < length; i++) {
        var p = positions[i];
        var geometry = geometries[i];
        var lowest = null;
        geometry.vertices.map(function(v) {
            if (lowest == null) {
                lowest = v;
            } else {
                if (v.z < lowest.z) {
                    lowest = v;
                }
            }
        })
        var displacement = lowest.z * .75;
        geometry.translate(p.x, p.y, p.z - displacement);
        geometry.rotateZ(Math.random() * Math.PI);
        rocks.addFeatureGeometry('rocks', geometry);
    }
    rocks.addFeatureMaterialP('rocks', material)
    rocks.generateFeatures();
    return rocks;
}
// TODO: RANDOMIZE LOCATIONS
function generateRock_Wood(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock()],
        [new THREE.Vector3(0, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateRock_Earth(x, y) {
    var rock = RockGeometryAggregator(
        [reclineRock()],
        [new THREE.Vector3(0, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateRock_Fire(x, y) {
    var rock = RockGeometryAggregator(
        [archedRock()],
        [new THREE.Vector3(0, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateRock_Water(x, y) {
    var rock = RockGeometryAggregator(
        [flatRock()],
        [new THREE.Vector3(0, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateRock_Metal(x, y) {
    var rock = RockGeometryAggregator(
        [shortRock()],
        [new THREE.Vector3(0, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_Buddha(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock(), shortRock(), shortRock()],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-6, 0, 0), new THREE
            .Vector3(6, 0, 0)
        ],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_ManWoman(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock(), shortRock(), ],
        [new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_BigDick(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock(), flatRock(), flatRock()],
        [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2, -2, 0), new THREE
            .Vector3(2, -2, 0)
        ],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_WoodEarth(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock(), reclineRock(), ],
        [new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_WaterMetal(x, y) {
    var rock = RockGeometryAggregator(
        [flatRock(), shortRock(), ],
        [new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_FireMetal(x, y) {
    var rock = RockGeometryAggregator(
        [archedRock(), shortRock(), ],
        [new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_EarthWater(x, y) {
    var rock = RockGeometryAggregator(
        [reclineRock(), flatRock(), ],
        [new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_EarthMetal(x, y) {
    var rock = RockGeometryAggregator(
        [reclineRock(), shortRock(), ],
        [new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_WoodFireWater(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock(), archedRock(), flatRock()],
        [new THREE.Vector3(4, 0, 0), new THREE.Vector3(-3, -2, 0), new THREE
            .Vector3(3, -2, 0)
        ],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_WoodFireMetal(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock(), archedRock(), shortRock()],
        [new THREE.Vector3(4, 0, 0), new THREE.Vector3(-3, -2, 0), new THREE
            .Vector3(3, -2, 0)
        ],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_WoodWaterMetal(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock(), flatRock(), shortRock()],
        [new THREE.Vector3(4, 0, 0), new THREE.Vector3(-3, -2, 0), new THREE
            .Vector3(3, -2, 0)
        ],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_WaterMetalFire(x, y) {
    var rock = RockGeometryAggregator(
        [flatRock(), archedRock(), shortRock()],
        [new THREE.Vector3(4, 0, 0), new THREE.Vector3(-3, -2, 0), new THREE
            .Vector3(3, -2, 0)
        ],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_WaterMetalEarth(x, y) {
    var rock = RockGeometryAggregator(
        [shortRock(), flatRock(), reclineRock()],
        [new THREE.Vector3(4, 0, 0), new THREE.Vector3(-3, -2, 0), new THREE
            .Vector3(3, -2, 0)
        ],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster_WoodEarthMetal(x, y) {
    var rock = RockGeometryAggregator(
        [tallRock(), reclineRock(), shortRock()],
        [new THREE.Vector3(4, 0, 0), new THREE.Vector3(-3, -2, 0), new THREE
            .Vector3(3, -2, 0)
        ],
        igneousMaterial());
    rock.addToObjectProject(environment.island, x, y);
    return rock;
}

function generateCluster8x8(x, y) {
    var clusterList = [
        generateRock_Wood,
        generateRock_Earth,
        generateRock_Fire,
        generateRock_Water,
        generateRock_Metal
    ];
    var rock = clusterList[discreteUniform(0, clusterList.length - 1)](x, y);
    rock.addToObject(environment.island, x, y, 0);
    return rock;
}

function generateCluster10x10(x, y) {
    var clusterList = [
        generateCluster_Buddha,
        generateCluster_ManWoman,
        generateCluster_BigDick,
        generateCluster_WoodEarth,
        generateCluster_WaterMetal,
        generateCluster_FireMetal,
        generateCluster_EarthWater,
        generateCluster_WoodEarthMetal
    ];
    var rock = clusterList[discreteUniform(0, clusterList.length - 1)](x, y);
    rock.addToObject(environment.island, x, y, 0);
    return rock;
}

function generateCluster16x16(x, y) {
    var clusterList = [
        generateCluster_WoodFireWater,
        generateCluster_WoodFireMetal,
        generateCluster_WoodWaterMetal,
        generateCluster_WaterMetalFire,
        generateCluster_WaterMetalEarth,
        generateCluster_WoodEarthMetal
    ];
    var rock = clusterList[discreteUniform(0, clusterList.length - 1)](x, y);
    rock.addToObject(environment.island, x, y, 0);
    return rock;
}