alert = '<div id="alert-content" class="alert alert-{0} fade in"><a href="#" style="padding-left: 10px" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong style="padding-right: 10px">{1}</strong> {2} </div>'

/**
 * String format function. Works similar to Python's string format.
 */
String.prototype.format = function() {

    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {

        return typeof args[number] != 'undefined'
            ? args[number]
            : match
        ;

    });

};

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
