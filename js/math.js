
acos = Math.acos
tan = Math.tan
cos = Math.cos;
sin = Math.sin;
random = Math.random;
ln = Math.log;
pi = Math.PI;
sqrt = Math.sqrt;
pow = Math.pow;
max = Math.max;
floor = Math.floor;
arctan = Math.atan;




function pow2(x){return Math.pow(x,2);}
/**
* Bernoulli distribution. Returns true with probability n
* @param {number} n The probability true is returned
* @return {boolean} a boolean.
**/
function bernoulli(n){
    return  (random() < n) ? true : false;
}

/**
* Uniform distribution Returns a random number within two bounds
* @param {number} low The lower bound a random number is produced
* @param {number} high The upper bound a random number is produced
* @return {number} A random number
**/
function uniform(low, high){
    return Math.random()*(high -low) + low
}


/**
* Normalizes a dirichlet vector represented by an array
* @param {array} x The vector to be normalized
* @return {array} The normalized vector.
*
**/
function dirichletNormalize(x){
    if(x.length == 0){
        return x;
    }

    var total = x.reduce(function(a,b) {return a + b;}, 0);
    return x.map(function(i){ return (i / total);});
}

// Dirichlet Sample that returns index
/**
* Takes a sample from a dirichlet distribution in the form of an array of probs
* @param {array} x An array of probabilities summing to 1
* @return {number} the index of the array that was chosen
*
**/
function dirichletSample(x) {
    if(x.length == 0){
        console.log("Error in Dirichlet sampling in file math.js");
        return 0;
    }

    var total = 0;
    var rval = random();

    for (var i = 0; i < x.length; i++){
        total = total + x[i];
        if (rval < total){
            return i;
        }
    }

    return  x[x.length - 1];
}



/**
* Takes a 2d Gaussian sample based around a mu vector until it selects
* a point within the environment.
*
* @param {array} mu An array containing the mu values for the mean vector
* @param {number} sigs The variance from the mean
* @param {object} env The environment variable to ensure bounds.
* @return {object} Contains the x and y coordinate of a random sample.
**/
this.multivariateGaussianSample2D = function(mu, sigs, env) {
    var S = [[stdDev, 0], [0, stdDev]];
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
