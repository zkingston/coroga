alert = '<div id="alert-content" class="alert alert-{0} fade in"><a href="#" style="padding-left: 10px" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong style="padding-right: 10px">{1}</strong> {2} </div>'

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
        ;
    });
};

function alertSuccess( text ) {
    document.getElementById( 'alerts' ).innerHTML = alert.format( 'success', 'Success', text );
}

function alertInfo( text ) {
    document.getElementById( 'alerts' ).innerHTML = alert.format( 'info', 'Info', text );
}

function alertWarning( text ) {
    document.getElementById( 'alerts' ).innerHTML = alert.format( 'warning', 'Warning', text );
}

function alertError( text ) {
    document.getElementById( 'alerts' ).innerHTML = alert.format( 'danger', 'Error', text );
}
