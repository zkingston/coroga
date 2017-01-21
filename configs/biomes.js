var biomes = {
    "riverLand": {
        probability: 0,
        tiles: {
          "bambooBush": 0,
          "rockClusterSmall": 0.2
        }
    },
    "forest": {
        probability: 0,
        tiles: {
          "loneTree": 0.25,
          "rockClusterSmall": 0.75
        }
    },
    "desert": {
        probability: 0.99,
        tiles: {
          "loneTree": 0.25,
          "rockClusterSmall": 0.25,
          "rockClusterMedium": 0.25,
          "rockClusterLarge": 0.25
        }
    },
    "debug":{
        probability: 0.01,
        tiles: {
            "loneTree": 0.99,
            "bambooBush": 0.01
        }
    }
}
