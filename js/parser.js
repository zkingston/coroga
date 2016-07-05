//Function that normalizes each row of a matrix
function normalizeMatrix(m){
    for (var i = 0; i < m.length; i++) {
        m[i].normalize();
    }
}

//Function that creates a matrix of tile probabilities given a config file
function createBiomeMatrix() {

    //Keep track of number of unique biomes and tiles
    var biomeCount = 0;
    var tileCount = 0;
    //Mappings of biomes and tiles to matrix indeces
    var biomeMap = {};
    var tileMap = {};

    //Fill in the biome map
    for (var biome in biomes) {
        //js thing to ignore internal properties
        if (!biomes.hasOwnProperty(biome)) {
            continue;
        }
        biomeMap[biome] = biomeCount++;
    }

    //Fill in the tile map
    for (var tile in tiles) {
        if (!tiles.hasOwnProperty(tile)) {
            continue;
        }
        tileMap[tile] = tileCount++;
    }

    //Debug output. Let me know if I should remove this
    // console.log(biomeMap);
    // console.log(tileMap);

    //Create matrix to hold the values
    var biomeMatrix = [];
    for (var i = 0; i < biomeCount; i++) {
        biomeMatrix.push([]);
        for (var j = 0; j < tileCount; j++) {
            biomeMatrix[i].push(0);
        }
    }

    //Look through every biome, and every tile in that biome
    for (var biome in biomes) {
        if (!biomes.hasOwnProperty(biome)) {
            continue;
        }

        for (var tile in biomes[biome]["tiles"]) {
            if (!biomes[biome]["tiles"].hasOwnProperty(tile)) {
                continue;
            }

            //Add the probability of the tile to the correct matrix index
            biomeMatrix[biomeMap[biome]][tileMap[tile]] = biomes[biome]["tiles"][tile];
        }
    }

    normalizeMatrix(biomeMatrix);

    console.log(biomeMatrix);

    //Create an object holding the matrix and maps for usable information
    biomeMatrixContext = {};
    biomeMatrixContext["matrix"] = biomeMatrix;
    biomeMatrixContext["biomeMap"] = biomeMap;
    biomeMatrixContext["tileMap"] = tileMap;

    return biomeMatrixContext;
}
