var features = {
    "spireRock": {
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
    },
    "cherryTree": {
        height: 15,
        heightVariance: .25,
        width: 8,
        widthVariance: 0.25
    },
    "bamboo": {
        height: {
            value: 10,
            variance: 0.25
        },
        radius: {
            value: 0.2,
            variance: 0.15
        },
        tilt: {
            value: Math.PI / 2,
            variance: 0.05
        },
        jointSpacing: {
            value: 2,
            variance: 0.5
        },
        segments: 10,
        jointThickness: 1.1,
        jointHeight: 0.01,
        shootColor: 0x99CC00,
        jointColor: 0xCCCC66
    },
    "island": { // Holy magic number batman
        // Island Base
        base: {
            detail: 3, // Icosahedron detail parameter
            noise: {
                spike: 0.08, // Multiplier on exponential noise
                top: 100, // Size parameter of top turblent noise
                bottom: 200
            }, // Size parameter of bottom turbulent noise
            peak: {
                mult: 12, // Just give up understanding these
                reduce: 1.2, // Even I don't fully comprehend what's going on here
                shift: 4
            }, // Looks good though
            displace: 3, // Bottom half displacment ( negative z )
            perturb: 0.5, // All vertex perturb amount
            material: {
                color: 0x566053,
                shading: THREE.FlatShading,
                shininess: 10,
                refractionRatio: 0.1
            }
        },
        // Sand bowls
        sand: {
            modifier: 3, // Raking wave scalar
            height: 0.2, // Wave height modifier
            maxPatch: 2, // Maximum number of sandy ovals per island
            material: {
                color: 0xfcfbdf,
                shading: THREE.FlatShading,
                shininess: 10,
                refractionRatio: 0.5
            }
        },
        // Grass covering
        grass: {
            extrusions: [{
                    dMin: 0.8, // This extrudes grass on the flat top of the island,
                    dMax: 1, // but doesn't go up too high so mountains stay bare.
                    zMin: -20,
                    zMax: 10,
                    offset: 0.01
                },
                {
                    dMin: -1, // This covers the lower part of the
                    dMax: 1, // island so we get some grass overhang.
                    zMin: -10,
                    zMax: 0,
                    offset: 0.01
                }
            ],
            material: {
                color: 0x73f773,
                shading: THREE.FlatShading,
                shininess: 0,
                refractionRatio: 0.1
            }
        },
        // Snow covering
        snow: {
            extrusions: [{
                dMin: 0.3, // Create snow caps - Only place snow on
                dMax: 1, // somewhat flat mountain faces above z = 20.
                zMin: 20,
                zMax: 100,
                offset: 0.2
            }],
            material: {
                color: 0xffffff,
                shading: THREE.FlatShading,
                emissive: 0xaaaaaa,
                shininess: 70,
                refractionRatio: 0.7
            }
        },
        // Animation variables to tweak wobble
        animation: {
            raise: 10, // How fast does the island rise when swapped?
            threshold: 500, // z axis threshold for island appear / disappear
            zWobble: {
                scale: 0.005, // z axis wobble
                mult: 3
            },
            xWobble: {
                scale: 0.005, // x rotation wobble
                mult: 0.03
            },
            yWobble: {
                scale: 0.005, // y rotation wobble
                mult: 0.03
            }
        },
        bowl: 0.000, // How much does the island bend
        width: {
            min: 30, // Width range
            max: 70
        },
        height: {
            min: 30, // Height range
            max: 70
        }
    }
};