var tiles = {
    "loneTree" : {
        size : {
            x : 16,
            y : 16
        },
        features : [
            {
                constructor : generateCherryTree,
                x : 8,
                y : 8
            }
        ]
    },
    "bambooBush" : {
        size : {
            x : 4,
            y : 4
        },
        features : [
            {
                constructor : generateBambooBush,
                x : 2,
                y : 2
            }
        ]
    },
    "rockCluster" : {
        size : {
            x : 8,
            y : 8
        },
        features : [
            {
                constructor : generateSpireRock,
                x : 4,
                y : 4
            }
        ]
    },
    "mossyRockCluster" : {
        size : {
            x : 8,
            y : 8
        },
        features : [
            {
                constructor : generateMossyRock,
                x : 4,
                y : 4
            }
        ]
    }
}
