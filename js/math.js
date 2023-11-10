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
atan2 = Math.atan2;
abs = Math.abs;
round = Math.round;
// Efficient algorithm to see if 2 line segs intersect in the general case.
// Cannot detect overlaid lines.
function ccw(a, b, c) {
    return ((c.y - a.y) * (b.x - a.x)) > ((b.y - a.y) * (c.x - a.x));
}

function intersects(p1, p2, q1, q2) {
    return (ccw(p1, q1, q2) != ccw(p2, q1, q2)) && (ccw(p1, p2, q1) != ccw(p1,
        p2, q2));
}
// I'm lazy af.
function pow2(x) {
    return Math.pow(x, 2);
}

function bound(x, xmin, xmax) {
    if (x < xmin) {
        return xmin;
    }
    if (x > xmax) {
        return xmax;
    }
    return x;
}
/**
 * Bernoulli distribution. Returns true with probability n
 * @param {number} n The probability true is returned
 * @return {boolean} a boolean.
 **/
function bernoulli(n) {
    return (random() < n) ? true : false;
}
/**
 * Uniform distribution Returns a random number within two bounds
 * @param {number} low The lower bound a random number is produced
 * @param {number} high The upper bound a random number is produced
 * @return {number} A random number
 **/
function uniform(low, high) {
    return Math.random() * (high - low) + low
}
/**
 * Normalizes a dirichlet vector represented by an array
 * @param {array} x The vector to be normalized
 * @return {array} The normalized vector.
 *
 **/
function dirichletNormalize(x) {
    if (x.length == 0) {
        return x;
    }
    var total = x.reduce(function(a, b) {
        return a + b;
    }, 0);
    return x.map(function(i) {
        return (i / total);
    });
}
// Dirichlet Sample that returns index
/**
 * Takes a sample from a dirichlet distribution in the form of an array of probs
 * @param {array} x An array of probabilities summing to 1
 * @return {number} the index of the array that was chosen
 *
 **/
function dirichletSample(x) {
    if (x.length == 0) {
        console.log("Error in Dirichlet sampling in file math.js");
        return 0;
    }
    var total = 0;
    var rval = random();
    for (var i = 0; i < x.length; i++) {
        total = total + x[i];
        if (rval < total) {
            return i;
        }
    }
    return x[x.length - 1];
}

function coneSample3D(origin, vector, length, degreeLow, degreeHigh) {
    // Default value for degree high
    degreeHigh = (!degreeHigh) ? 1 : degreeHigh;
    // Normalize the start vector.
    vector.normalize()
    var rl = (Math.PI / 180) * degreeLow
    var rh = (Math.PI / 180) * degreeHigh
    // Pick some vectors that will help you come up with a basis.
    // Use Cross Products to construct the basis. (a,u,v) are the vectors.
    var a = vector;
    var temp = (a.y != 0 || a.z != 0) ?
        new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    var u = new THREE.Vector3();
    u.crossVectors(a, temp)
        .normalize()
    var v = new THREE.Vector3();
    v.crossVectors(a, u)
        .normalize()
    //axis, u, v basis constructed
    // Randomly generate the angles of the new point for conic form.
    var theta = acos(uniform(cos(rl), cos(rh)));
    var phi = uniform(0, 2 * Math.PI);
    // Produce the resulting unit vector using the randomly generated angles.
    var x = new THREE.Vector3(
        sin(theta) * (cos(phi) * u.x + sin(phi) * v.x) + cos(theta) * a.x,
        sin(theta) * (cos(phi) * u.y + sin(phi) * v.y) + cos(theta) * a.y,
        sin(theta) * (cos(phi) * u.z + sin(phi) * v.z) + cos(theta) * a.z)
    x.normalize()
    // Stretch the Unit Vector into the size required.
    return new THREE.Vector3(
        origin.x + x.x * length,
        origin.y + x.y * length,
        origin.z + x.z * length)
}

function coneSample2D(origin, vector, length, degreeLow, degreeHigh) {
    // Default value for degree high
    degreeHigh = (!degreeHigh) ? 1 : degreeHigh;
    // Normalize the start vector.
    vector.normalize()
    var rl = (Math.PI / 180) * degreeLow
    var rh = (Math.PI / 180) * degreeHigh
    // Pick some vectors that will help you come up with a basis.
    // Use Cross Products to construct the basis. (a,u,v) are the vectors.
    var a = vector;
    var temp = (a.y != 0 || a.z != 0) ?
        new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    var u = new THREE.Vector3();
    u.crossVectors(a, temp)
        .normalize()
    var v = new THREE.Vector3();
    v.crossVectors(a, u)
        .normalize()
    //axis, u, v basis constructed
    // Randomly generate the angles of the new point for conic form.
    var theta = acos(uniform(cos(rl), cos(rh)));
    var phi = uniform(0, 2 * Math.PI);
    // Produce the resulting unit vector using the randomly generated angles.
    var x = new THREE.Vector3(
        sin(theta) * (cos(phi) * u.x + sin(phi) * v.x) + cos(theta) * a.x,
        sin(theta) * (cos(phi) * u.y + sin(phi) * v.y) + cos(theta) * a.y,
        sin(theta) * (cos(phi) * u.z + sin(phi) * v.z) + cos(theta) * a.z)
    x.normalize()
    // Stretch the Unit Vector into the size required.
    return new THREE.Vector3(
        origin.x + x.x * length,
        origin.y + x.y * length,
        0);
}
//BRUTE FORCE
//can make faster through divide and conquer.... but nah.
function findClosestAndPop(v, pool) {
    var closest = null;
    var distance = null;
    var index = null
    var temp = null;
    var p = null;
    for (var iter = 0; iter < pool.length; iter++) {
        p = pool[iter];
        if (closest === null) {
            closest = p;
            distance = v.distanceTo(p);
            index = iter;
        } else {
            temp = v.distanceTo(p);
            if (temp < distance) {
                closest = p;
                distance = temp;
                index = iter;
            }
        }
    }
    pool.splice(index, 1);
    return closest;
}
//nondeterministic icosahedral approximation of a point cloud with no
// guarantee of concavity or convexity.
//
function icosahedralApproximation(ps, origin) {
    var shell = new THREE.IcosahedronGeometry(100, 2);
    var p = new THREE.Vector3();
    shell.vertices.map(function(v) {
        p.set(v.x, v.y, v.z);
        var closest = findClosestAndPop(p, ps);
        if (closest) {
            v.x = closest.x;
            v.y = closest.y;
            v.z = closest.z;
        }
    });
    return shell;
}
//finds a point between contextB and target such that all 4 fall in a circle
function smoothInterpolate(contextA, contextB, target) {
    var center = new THREE.Vector3(0, 0, 0);
    var ma = (p2.y - p1.y) / (p2.x - p1.x);
    var mb = (p3.y - p2.y) / (p3.x - p2.x);
    center.x = (ma * mb * (p1.y - p3.y) + mb * (p1.x + p2.x) - ma * (p2.x + p3
        .x)) / (2 * (mb - ma));
    center.y = (-1 / ma) * (center.x - (p1.x + p2.x) / 2) + (p1.y + p2.y) / 2;
    var radius = center.distanceTo(contextB);
    //find the angular bisector between radius c,b and c,target
    // I can cheat and optimize by just adding the vectors, since they are equal magnitude
    var va = new THREE.Vector3()
        .subVectors(contextB, center);
    var vb = new THREE.Vector3()
        .subVectors(contextA, center);
    var v = new THREE.Vector3()
        .addVectors(va, vb)
        .setLength(radius);
    return v;
}

function smoothenCurve(contextA, target, contextB) {
    var a = new THREE.Vector3(target.x - contextA.x, target.y - contextA.y, 0);
    var b = new THREE.Vector3(target.x - contextB.x, target.y - contextB.y, 0);
    var theta = acos(a.dot(b) / (a.length() * b.length()))
    if (theta < pi / 2) {
        var aoffset = new THREE.Vector3()
            .subVectors(contextA, target);
        aoffset.setLength(aoffset.length() / 2);
        var boffset = new THREE.Vector3()
            .subVectors(contextB, target);
        boffset.setLength(boffset.length() / 2);
        target.add(aoffset);
        target.add(boffset);
    }
    return target;
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
    var S = [
        [stdDev, 0],
        [0, stdDev]
    ];
    var L = this.choleskyDecomposition2D(S);
    while (true) {
        var z = this.boxMullerTransform2D();
        var rVal = {
            "x": mu[0] + (L[0][0] * z[0]) + (L[0][1] * z[1]),
            "y": mu[1] + (L[1][0] * z[0]) + (L[1][1] * z[1])
        };
        // Check Bounds
        if (Math.abs(rVal.x) <= env.width / 2 && Math.abs(rVal.y) <= env
            .height / 2) {
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
    var L = [
        [0, 0],
        [0, 0]
    ];
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
        sqrt(-2 * ln(u1)) * sin(2 * pi * u2)
    ];
}