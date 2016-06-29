//Function that normalizes an array
function normalize(a) {

    //Use the reduce function to sum the array
    var sum = a.reduce(add, 0);
    function add(x, y) {
        return x + y;
    }

    //Normalize
    for (var i = 0; i < a.length; i++) {
        a[i] = a[i] / sum;
    }
}

//Function that normalizes each row of a matrix
function normalizeMatrix(m){
    for (var i = 0; i < m.length; i++) {
        normalize(m[i]);
    }
}

//Function that creates a matrix of feature probabilities given a config file
function createBiomeMatrix() {

    //Keep track of number of unique biomes and features
    var biomeCount = 0;
    var featureCount = 0;
    //Mappings of biomes and features to matrix indeces
    var biomeMap = {};
    var featureMap = {};

    //Fill in the biome map
    for (var biome in biomes) {
        //js thing to ignore internal properties
        if (!biomes.hasOwnProperty(biome)) {
            continue;
        }
        biomeMap[biome] = biomeCount++;
    }

    //Fill in the feature map
    for (var feature in features) {
        if (!features.hasOwnProperty(feature)) {
            continue;
        }
        featureMap[feature] = featureCount++;
    }

    //Debug output. Let me know if I should remove this
    console.log(biomeMap);
    console.log(featureMap);

    //Create matrix to hold the values
    var biomeMatrix = [];
    for (var i = 0; i < biomeCount; i++) {
        biomeMatrix.push([]);
        for (var j = 0; j < featureCount; j++) {
            biomeMatrix[i].push(0);
        }
    }

    //Look through every biome, and every feature in that biome
    for (var biome in biomes) {
        if (!biomes.hasOwnProperty(biome)) {
            continue;
        }

        for (var feature in biomes[biome]["features"]) {
            if (!biomes[biome]["features"].hasOwnProperty(feature)) {
                continue;
            }

            //Add the probability of the feature to the correct matrix index
            biomeMatrix[biomeMap[biome]][featureMap[feature]] = biomes[biome]["features"][feature];
        }
    }

    normalizeMatrix(biomeMatrix);

    console.log(biomeMatrix);

    //Create an object holding the matrix and maps for usable information
    biomeMatrixContext = {};
    biomeMatrixContext["matrix"] = biomeMatrix;
    biomeMatrixContext["biomeMap"] = biomeMap;
    biomeMatrixContext["featureMap"] = featureMap;

    return biomeMatrixContext;
}
