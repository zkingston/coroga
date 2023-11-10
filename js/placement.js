// Because the Seventh circle of hell is a frozen lake of Raytracer Errors.
function debugBall(x, y, z) {
    var geometry = new THREE.SphereGeometry(1, 4, 4);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    geometry.translate(x, y, z)
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
}

function debugFeature(x, y, z, i) {
    var ball = new THREE.Object3D();
    var geometry = new THREE.SphereGeometry(1, 4, 4);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    ball.addFeatureGeometries("ball", geometry);
    ball.addFeatureMaterialP("ball", material);
    ball.generateFeatures();
    console.log(ball);
    ball.addToObject(i, x, y, z)
}
/**
 * Placement engine using tile system to place features in a scene.
 * Requires environment and scene
 *
 * WARNING. MUST HAVE USERDATA CURVES INITIALIZED.
 * @param {object} env Environment object containing a description of the scene
 *        use:
 *        placer = new PlacementEngine(environment, scene);
 *        placer.runBiomeBasedEngine();
 **/
function PlacementEngine(env, scene) {
    var islandCurve = environment.island.userData.curves.island.islandCurve;
    // Member Variables
    var biomeConfig = createBiomeMatrix();
    this.numTiles = 10;
    this.biomeProbabilities = biomeConfig.biomeProbabilities;
    this.probabilityMatrix = biomeConfig.matrix;
    this.tileMap = biomeConfig.tileMap;
    // Randomly finds positions for tiles and places them.
    this.runRandomTileEngine = function() {
        // Reset the tiles (just in case)
        this.generatedTiles = [];
        // Pick your biome
        var bid = dirichletSample(this.biomeProbabilities);
        // Figure out the tile probabilities for that biome
        var tileProbabilities = this.probabilityMatrix[bid];
        // Make the allocation grid;
        var grid = new Grid(
            -1 * (environment.width - 5),
            (environment.width - 5),
            -1 * (environment.height - 5),
            (environment.height - 5),
            environment.island.userData.curves
        );
        console.log(environment.width);
        console.log(environment.height);
        // If there are any no-go regions, mark them.
        // Edit: There arent anymore.
        // for (var q = 0; q<100; q++){
        //     var xa = uniform(environment.width*-1, environment.width);
        //     var ya = uniform(environment.height*-1,environment.height);
        //     if (environment.island.userData.curves.sand(xa,ya)){
        //         debugBall(xa,ya,10);
        //
        //     }
        //
        // }
        // debugBall(0,0,10);
        //
        var e = environment;
        // debugBall(e.width*-1,e.height,10);
        // debugBall(e.width,e.height*-1,10);
        // debugBall(e.width*-1,e.height*-1,10);
        // debugBall(e.width,e.height,10);
        //
        // debugBall(0,0,10);
        for (var i = 0; i < this.numTiles; i++) {
            // Pick a tile type
            var tid = dirichletSample(tileProbabilities);
            // Find which tile exactly this id refers to
            var tileName = Object.keys(this.tileMap)[tid];
            // Look up the tile's configs
            var tile = tiles[tileName];
            // Find the location of bottom left corner of the tile
            var position = grid.allocate(tile.size.x, tile.size.y, tile.size
                .buffer, tile.terrain);;
            // If we were able to allocate it.
            if (!(position === null)) {
                // Calculate the offsets for each feature within the tile
                for (var f = 0; f < tile.features.length; f++) {
                    var feature = tile.features[f];
                    // Put the feature down.
                    feature.constructor(
                        (position.x + feature.x),
                        (position.y + feature.y)
                    );
                    // debugBall((position.x + feature.x),
                    // (position.y + feature.y),10)
                }
            }
        }
    }
}