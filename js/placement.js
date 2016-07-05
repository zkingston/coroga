/**
* Produces a colored ball at target location. Used for debugging.
* @param { number } x The x coordinate of the ball
* @param { number } y The y coordinate of the ball
* @param {string} colorIn
* @return { THREE.Mesh } ball The ball object to be added to the scene
**/
function ball(x,y,colorIn) {
    var properties = { transparent : true,
      opacity : 1.0,
      color : colorIn,
      side : THREE.DoubleSide,
      shading : THREE.FlatShading,
      shininess : 0,
      emissive : colorIn
    }
    var geometry = new THREE.SphereGeometry(1);
    var ball = new THREE.Object3D();
    ball.addFeatureGeometry( 'ball', geometry );
    ball.addFeatureMaterialP('ball', properties);

    ball.position.x = x;
    ball.position.y = y;
    ball.position.z = 2;

    ball.generateFeatures();

    return ball;
}

/**
* Produces a colored ball at target location. Used for debugging.
* @param { number } x The x coordinate of the ball
* @param { number } y The y coordinate of the ball
* @return { THREE.Mesh } ball The ball object to be added to the scene
**/
function redBall(x,y){return ball(x,y,0xdc143c)}
function greenBall(x,y){return ball(x,y,0x00ff00)}
function blackBall(x,y){return ball(x,y, 0x000000)}




/**
* Placement engine using tile system to place features in a scene.
* Requires environment and scene
*
* @param {object} env Environment object containing a description of the scene
*        use:
*        placer = new PlacementEngine(environment, scene);
*        placer.runBiomeBasedEngine();
**/
function PlacementEngine(env, scene){

    // Member Variables
    var biomeConfig = createBiomeMatrix();
    this.numTiles = 4;
    this.biomeProbabilities = biomeConfig.biomeProbabilities;
    this.probabilityMatrix = biomeConfig.matrix;
    this.tileMap = biomeConfig.tileMap;



    // Randomly finds positions for tiles and places them.
    this.runRandomTileEngine = function(){
        // Reset the tiles (just in case)
        this.generatedTiles = [];
        // Pick your biome
        var bid = dirichletSample(this.biomeProbabilities);
        // Figure out the tile probabilities for that biome
        var tileProbabilities = this.probabilityMatrix[bid];
        // Make the allocation grid;
        var grid = new Grid(
            -1*(environment.width - 5)/2,
            (environment.width - 5)/2,
            -1*(environment.height - 5)/2,
            (environment.height - 5)/2
        );


        for (var i = 0; i < this.numTiles; i++){
            // Pick a tile type
            var tid = dirichletSample(tileProbabilities);
            // Find which tile exactly this id refers to
            var tileName = Object.keys(this.tileMap)[tid];
            // Look up the tile's configs
            var tile = tiles[tileName];
            // Find the location of bottom left corner of the tile
            var position = grid.allocate(tile.size.x, tile.size.y);


            // If we were able to allocate it.
            if(!(position === null)){
                // Calculate the offsets for each feature within the tile
                for(var f = 0; f < tile.features.length; f++){
                    var feature = tile.features[f];
                    // Put the feature down.
                    feature.constructor(
                        position.x + feature.x,
                        position.y + feature.y
                    );
                }
            }
        }
    }
}
