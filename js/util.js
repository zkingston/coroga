/**
 * String format function. Works similar to Python's string format.
 * Does literal text replacement with argument order corresponding to
 * format number.
 *
 * I.E. '{0} is {1}'.format( 'javascript', 'bad' ) will output
 *      'javascript is bad'
 *
 * @param { ...string } varargs The replacement values
 *
 * @return { string } The string with fields replaced.
 */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {

        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};

/**
 * Returns the closest vector in a vector list to the value of this.
 *
 * @param { THREE.Vector3[] } vector_list The list of vectors to compare
 *
 * @return { THREE.Vector3 } The closest vector
 */
THREE.Vector3.prototype.closest = function ( vector_list ) {
    var that = this;
    var m_val, m_dist;

    vector_list.forEach( function ( vector ) {
        var dist = that.distanceTo( vector );
        if ( typeof m_val === 'undefined' || dist < m_dist ) {
            m_val = vector;
            m_dist = dist;
        }
    } );

    return m_val;
};

/**
 * Randomly samples from this array.
 *
 * @return { Object } A random element from this
 */
Array.prototype.choose = function () {
    return this[ discreteUniform( 0, this.length - 1 ) ];
};

/**
 * Shuffles an array in place.
 *
 * @return { Array } This, but shuffled
 */
Array.prototype.shuffle = function () {
    var tmp, rand_idx;
    var cur_idx = this.length;

    while ( 0 !== cur_idx ) {
        rand_idx = Math.floor( rand() * cur_idx );
        cur_idx--;

        tmp = this[cur_idx];
        this[cur_idx] = this[rand_idx];
        this[rand_idx] = tmp;
    }

    return this;
};

/**
 * Returns the sign of this number.
 *
 * @return { number } -1 if negative, 1 if positive, 0 if zero
 */
Number.prototype.sign = function () {
    var n = this.valueOf();
    return n ? n < 0 ? -1 : 1: 0;
};

/**
 * Rounds number up to nearest even value.
 *
 * @return { number } Even number
 */
Number.prototype.even = function () {
    var n = this.valueOf();
    return ( n % 2 ) ? n + 1 : n;
}

/**
 * Returns the L2-norm of this vector.
 *
 * @return { number } The L2-norm of this vector.
 */
THREE.Vector3.prototype.l2 = function() {
    return Math.sqrt( this.dot( this ) );
}

/**
 * Takes and replaces all values in the vector with their absolute value.
 *
 * @return { THREE.Vector3 } This
 */
THREE.Vector3.prototype.abs = function() {
    var v = this.clone();
    v.x = Math.abs( this.x );
    v.y = Math.abs( this.y );
    v.z = Math.abs( this.z );

    return v;
};

/**
 * Takes the union of this and geometries and merges them together.
 *
 * @param { THREE.Geometry[] } geometries List of geometries to merge
 *
 * @return { THREE.Geometry } This
 */
THREE.Geometry.prototype.mergeGeometry = function( geometries ) {
    for ( var idx = 0; idx < geometries.length; idx++ ) {
        var mesh = new THREE.Mesh( geometries[idx] );
        mesh.updateMatrix();
        this.merge( mesh.geometry, mesh.matrix );
    }

    return this;
};

var rand = Math.random;

/**
 * Takes a uniform sample from a continuous range from 'a' to 'b'.
 *
 * @param { number } a Start of the range
 * @param { number } b End of the range
 *
 * @return { number } Random sample
 */
function continuousUniform ( a, b ) {
    return a + ( b - a ) * rand();
}

/**
 * Takes a uniform sample from a discrete range from 'a' to 'b'.
 *
 * @param { number } a Start of the range
 * @param { number } b End of the range
 *
 * @return { number } Random sample
 */
function discreteUniform ( a, b ) {
    return Math.round( continuousUniform( a, b ));
}

/**
 * Takes a sample from a normal distribution.
 *
 * @param { number } mu    Mean of distribution
 * @param { number } sigma Standard deviation of distribution
 *
 * @return { number } Random sample
 */
var normal = function () {
    var alternate = 1;
    var z0, z1;
    var pi2 = Math.PI * 2;

    return function ( mu, sigma ) {
        alternate = !alternate;

        if ( alternate ) {
            return z1 * sigma + mu;
        }

        var u = rand();
        var v = rand();

        var tmp = Math.sqrt( -2 * Math.log( u ) );
        z0 = tmp * Math.cos( pi2 * v );
        z1 = tmp * Math.sin( pi2 * v );

        return z0 * sigma + mu;
    };
}();

/**
 * Randomly offsets a value by a value within a range, centered on the original
 * value.
 *
 * @param { number } value Value to offset
 * @param { number } range Range of offset
 *
 * @return { number } The offset value
 */
function randOffset( value, range ) {
    return value + ( Math.random() * range ) - ( range / 2 ) ;
}

/**
 * Perturbs a value by a random sample from a normal distribution.
 *
 * @param { number } value     Value to perturb
 * @param { number } deviation Deviation of distribution
 *
 * @return { number } Perturbed value
 */
function perturb( value, deviation ) {
    return value + normal( 0, deviation );
}

/**
 * Perturbs a vector using perturb().
 *
 * @param { number } deviation Deviation of distribution
 *
 * @return { THREE.Vector3 } This
 */
THREE.Vector3.prototype.perturb = function( deviation ) {
    this.x = perturb( this.x, deviation );
    this.y = perturb( this.y, deviation );
    this.z = perturb( this.z, deviation );

    return this;
}

/**
 * Takes a sample from a poisson distribution.
 *
 * @param { number } lambda Lambda parameter of distribution
 *
 * @return { number } Sample
 */
function poisson ( lambda ) {
    var x = 0;
    var p = Math.pow( Math.E, -lambda );
    var s = p;
    var u = rand();

    while ( u > s ) {
        x += 1;
        p *= lambda / x;
        s += p;
    }

    return x;
}

/**
 * Takes a sample from a bernoulli distribution.
 *
 * @param { number } phi Parameter
 *
 * @return { number } Random sample
 */
function bernoulli ( phi ) {
    var r = continuousUniform( 0, 1 );
    return ( phi < r ) ? 1 : -1;
}

/**
 * Normalizes an array
 */
Array.prototype.normalize = function() {
    var sum = this.reduce(add, 0);
    function add(x, y) {
        return x + y;
    }

    for (var i = 0; i < this.length; i++) {
        this[i] = this[i] / sum;
    }
};
