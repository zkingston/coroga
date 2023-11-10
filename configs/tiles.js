//Usage:
// Ensure tile name is equivalent in biome.
// Size simply ensures other features are not placed too close or off the edge.
// Compound features should be generated and assembled within constructor, and
// max possible spacing recorded here as size.
// Terrain is a list of all viable terrain.
var tiles = {
    "loneCherryTree": {
        size: {
            x: 16,
            y: 16,
            buffer: 8
        },
        features: [{
            constructor: generateCherryTree,
            x: 8,
            y: 8
        }],
        terrain: ["grass"]
    },
    "loneWillowTree": {
        size: {
            x: 16,
            y: 16,
            buffer: 8
        },
        features: [{
            constructor: generateWillowTree,
            x: 8,
            y: 8
        }],
        terrain: ["grass"]
    },
    "loneDeadTree": {
        size: {
            x: 16,
            y: 16,
            buffer: 8
        },
        features: [{
            constructor: generateDeadTree,
            x: 8,
            y: 8
        }],
        terrain: ["grass"]
    },
    "bambooBush": {
        size: {
            x: 4,
            y: 4,
            buffer: 2
        },
        features: [{
            constructor: generateBambooBush,
            x: 2,
            y: 2
        }],
        terrain: ["sand"]
    },
    "rockClusterSmall": {
        size: {
            x: 16,
            y: 16,
            buffer: 3
        },
        features: [{
            constructor: generateCluster8x8,
            x: 8,
            y: 8
        }],
        terrain: ["sand"]
    },
    "rockClusterMedium": {
        size: {
            x: 16,
            y: 16,
            buffer: 4
        },
        features: [{
            constructor: generateCluster10x10,
            x: 8,
            y: 8
        }],
        terrain: ["sand"]
    },
    "rockClusterLarge": {
        size: {
            x: 16,
            y: 16,
            buffer: 4
        },
        features: [{
            constructor: generateCluster16x16,
            x: 8,
            y: 8
        }],
        terrain: ["sand"]
    }
}