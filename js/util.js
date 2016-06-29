alert = '<div id="alert-content" class="alert alert-{0} fade in"><a href="#" style="padding-left: 10px" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong style="padding-right: 10px">{1}</strong> {2} </div>'

/**
 * String format function. Works similar to Python's string format.
 */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {

        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};

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

Array.prototype.choose = function () {
    return this[ d_uniform( 0, this.length - 1 ) ];
};

function perturb( value, range ) {
    return value + normal( 0, range );
}

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

Number.prototype.sign = function () {
    var n = this.valueOf();
    return n ? n < 0 ? -1 : 1: 0;
};

THREE.Vector3.prototype.l2 = function() {
    return this.dot( this );
}

THREE.Vector3.prototype.abs = function() {
    var v = this.clone();
    v.x = Math.abs( this.x );
    v.y = Math.abs( this.y );
    v.z = Math.abs( this.z );

    return v;
};

THREE.Geometry.prototype.mergeGeometry = function( geometries ) {
    for ( var idx = 0; idx < geometries.length; idx++ ) {
        var mesh = new THREE.Mesh( geometries[idx] );
        mesh.updateMatrix();
        this.merge( mesh.geometry, mesh.matrix );
    }

    return this;
};

var rand = Math.random;

function c_uniform ( a, b ) {
    return a + ( b - a ) * rand();
}

function d_uniform ( a, b ) {
    return Math.round( c_uniform( a, b ));
}

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

function bernoulli ( phi ) {
    var r = c_uniform( 0, 1 );
    return ( phi < r ) ? 1 : -1;
}

/**
 * Displays a success message at the top of the screen.
 */
function alertSuccess( text ) {

    document.getElementById( 'alerts' ).innerHTML += alert.format( 'success', 'Success', text );

}

/**
 * Displays an info message at the top of the screen.
 */
function alertInfo( text ) {

    document.getElementById( 'alerts' ).innerHTML += alert.format( 'info', 'Info', text );

}

/**
 * Displays a warning message at the top of the screen.
 */
function alertWarning( text ) {

    document.getElementById( 'alerts' ).innerHTML += alert.format( 'warning', 'Warning', text );

}

/**
 * Displays an error message at the top of the screen.
 */
function alertError( text ) {

    document.getElementById( 'alerts' ).innerHTML += alert.format( 'danger', 'Error', text );

}

function displayFPS() {

    var div = document.getElementById('stats');
    var tool = document.getElementById('buttons');
    var but = document.getElementById('fpstoggle');
    if (div.style.display !== 'none') {
        tool.className ="col-xs-12 col-md-8";
        div.className = '' 
        div.style.display = 'none';
        but.innerHTML = 'Show FPS';
    }
    else {
        tool.className ="col-xs-9 col-md-8";
        div.className = 'col-xs-3 col-md-2';
        div.style.display = 'block';
        but.innerHTML = 'Hide FPS';
    }

}
