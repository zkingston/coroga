var features = {
    "spireRock": {
        t_rad_range : { min : 0.4,
                        max : 0.8 },
        r_seg_range : { min : 5,
                        max : 10 },
        h_seg_range : { min : 5,
                        max : 10 },
        rotate      : { min : -Math.PI / 8,
                        max : Math.PI / 8 },
        vector_mag  : 0.3,
        top_perturb : 0.5,
        top_offset  : 0.3
    },
    "cherryTree": {
        height: 15,
        heightVariance: .25,
        width: 8,
        widthVariance: 0.25
    },
    "bamboo": {
        height: { value     : 10,
                  variance  : 0.25},
        radius: { value     : 0.2,
                  variance  : 0.15},
        tilt:   { value     : Math.PI/2,
                  variance  : 0.05},
        jointSpacing:   { value     : 2,
                          variance  : 0.5},
        jointThickness : 1.1,
        jointHeight : 0.01,
        shootColor : 0x99CC00,
        jointColor : 0xCCCC66
    }
};
