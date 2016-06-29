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

THREE.Geometry.prototype.mergeGeometry = function ( geometry ) {
    var mesh = new THREE.Mesh( geometry );
    mesh.updateMatrix();
    this.merge( mesh.geometry, mesh.matrix );

    return this;
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
