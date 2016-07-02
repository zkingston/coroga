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
    var ball = meshWrap( geometry, properties );
    ball.position.x = x;
    ball.position.y = y;
    ball.position.z = 2;

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
* Placement engine using gaussian distribution to place features in a scene.
* Requires environment and scene
*
* @param {object} env Environment object containing a description of the scene
*        use:
*        placer = new PlacementEngine(environment, scene);
*        placer.runBiomeBasedEngine();
**/
function PlacementEngine(env, scene){

    // TODO: Read these in from config and error check
    //----------------------------------------------------------
    this.numberOfBiomes = 3;
    this.maxNumberOfFeatures = 100;
    this.biomeStdDev = Math.max(env.height,env.width) *1.5 / (this.numberOfBiomes-1);


    this.featureHandles = [redBall, greenBall, blackBall] // List of constructor handles
    this.biomeProbabilities = [.25,.25,.5]; // P(B)
    this.pfbMatrix = [ // P(F|B)
        [.8,.1, .1],
        [0,.5,.5],
        [.33,.33,.34]];

    //-----------------------------------------------------------

    // Utility Functions
    /**
    * Takes a 2d Gaussian sample based around a mu vector until it selects
    * a point within the environment.
    *
    * @param {array} mu An array containing the mu values for the mean vector
    * @return {object} Contains the x and y coordinate of a random sample.
    **/
    this.multivariateGaussianSample2D = function(mu) {
        var S = [[this.biomeStdDev, 0], [0, this.biomeStdDev]];
        var L = this.choleskyDecomposition2D(S);

        while(true){
            var z = this.boxMullerTransform2D();
            var rVal =  {
                "x" : mu[0] + (L[0][0] * z[0]) + (L[0][1] * z[1]),
                "y" : mu[1] + (L[1][0] * z[0]) + (L[1][1] * z[1])
            };

            // Check Bounds
            if (Math.abs(rVal.x) <= env.width/2 && Math.abs(rVal.y) <= env.height/2){
                return rVal;
            }
        }
    }

    /**
    * Used to form a lower triangular matrix for producing random Variables
    * @param {array} S Covariance matrix
    * @return {array} a lower triangular matrix
    *
    *
    **/
    this.choleskyDecomposition2D = function(S) {
        var L = [[0,0],[0,0]];
        L[0][0] = sqrt(S[0][0]);
        L[1][0] = S[1][0] / L[0][0];
        L[0][1] = 0;
        L[1][1] = sqrt(S[1][1] - L[1][0]);
        return L;
    }


    /** Box muller transform for producing random variables
    * @return {array} an array representation of a vector to produce independent
    * variables.
    *
    **/
    this.boxMullerTransform2D = function() {
        var u1 = random();
        var u2 = random();
        return [sqrt(-2 * ln(u1)) * cos(2 * pi * u2),
                sqrt(-2 * ln(u1)) * sin(2 * pi * u2)];
    }

    /** Extensible in case environment shape changes
    * Produces a random location in the bounds of the environment
    * @return {object} object containing the x and y coordinates of the point.
    **/
    this.randomLocation2D = function(){
        // TODO Possible Bug. x and y are switched.
        return {
            "x" : -1 * (env.width) /2 + random() * (env.width),
            "y" : -1 * (env.height) /2 + random() * (env.height)
        }
    }

    // Member Variables
    this.biomes = [];
    this.features = [];

    // Produce list and location of biome locii
    for (var i = 0; i < this.numberOfBiomes; i++){
        // Select a biome and add it to list
        var index = dirichletSample(this.biomeProbabilities)
        this.biomes.push(
            {
                "bid" : index,
                "locus" : this.randomLocation2D()
            }
        );
    }

    /**
    * Runs the engine by selecting a random biome and randomly placing features
    * within it.
    *
    **/
    this.runBiomeBasedEngine = function() {
        // allocate a feature...
        for(var i = 0; i < this.maxNumberOfFeatures; i++){
            // to a random biome
            var randomBiome = this.biomes[Math.floor(random() * this.biomes.length)];
            var mu = randomBiome.locus;
            var bid = randomBiome.bid;
            var position = this.multivariateGaussianSample2D([mu.x,mu.y]);
            // select feature within biome
            var fid = dirichletSample(this.pfbMatrix[bid]);
            var featureConstructor = this.featureHandles[fid];
            var feature = featureConstructor(position.x, position.y);
            this.features.push(feature);
            scene.add(feature);
        }
    }


    // TODO
    this.runFeatureBasedEngine = function() {}

}
