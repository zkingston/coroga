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
    "bamboo" : {
        size : {
            x : 16,
            y : 16
        },
        features : [
            {
                constructor : generateBambooBush,
                x : 8,
                y : 8
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
    }
}
