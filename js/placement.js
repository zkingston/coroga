
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

    // TODO Fix this;
    // This is a hardcoded parametric ellipse bounds checker.
    // Eventually this needs to be passed in. 
    var c = function(x,y){
        var dim = environment.island.userData;
        var xr = dim.width;
        var yr = dim.height;

        if (((x*x)/(xr*xr))+((y*y)/(yr*yr))<1){
            return true
        }else{
            return false;
        }
    }

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
            (environment.height - 5)/2,
            c
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
