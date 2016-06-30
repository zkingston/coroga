

cos = Math.cos;
sin = Math.sin;
random = Math.random;
ln = Math.log;
pi = Math.PI;
sqrt = Math.sqrt;

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

    for (i = 0; i < x.length; i++){
        total = total + x[i];
        if (rval < total){
            return i;
        }
    }

    return  x[x.length - 1];
}
