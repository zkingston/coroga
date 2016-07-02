alert = '<div id="alert-content" class="alert alert-{0} fade in"><a href="#" style="padding-left: 10px" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong style="padding-right: 10px">{1}</strong> {2} </div>'

ui = []

CRGButton = function( text, callback ) {
    this.type = 'Button';
    this.text = text;
    this.callback = callback;

    this.setTextNode = function( text ) {
        this.text = text;

        if ( typeof this.btn !== 'undefined' ) {
            this.btn.removeChild( this.textNode );

            this.textNode = document.createTextNode( this.text )
            this.btn.appendChild( this.textNode );
        }
    }

    this.domElement = function() {
        this.div = document.createElement( 'div' );
        this.div.className = 'btn-group btn-group-md';
        this.div.role = 'group';

        this.btn = document.createElement( 'button' );
        this.btn.className = 'btn btn-default';
        this.btn.onclick = this.callback;

        this.textNode = document.createTextNode( this.text )
        this.btn.appendChild( this.textNode );

        this.div.appendChild( this.btn );

        return this.div;
    }
}

CRGButton.prototype = Object.create( CRGButton.prototype );
CRGButton.prototype.constructor = CRGButton;
CRGButton.prototype.clone = function () {
    return new CRGButton( this.text, this.callback );
}

CRGDropdownButton = function( text, callback ) {
    this.type = 'DropdownButton';
    this.text = text;
    this.callback = callback;

    this.setTextNode = function( text ) {
        this.text = text;

        if ( typeof this.a !== 'undefined' ) {
            this.a.removeChild( this.textNode );

            this.textNode = document.createTextNode( this.text )
            this.a.appendChild( this.textNode );
        }
    }

    this.domElement = function() {
        this.a = document.createElement( 'a' );
        this.a.onclick = this.callback;
        this.a.href = '#';

        this.textNode = document.createTextNode( this.text )
        this.a.appendChild( this.textNode );

        return this.a;
    }
}

CRGDropdownButton.prototype = Object.create( CRGDropdownButton.prototype );
CRGDropdownButton.prototype.constructor = CRGDropdownButton;
CRGDropdownButton.prototype.clone = function () {
    return new CRGDropdownButton( this.text, this.callback );
}

CRGDropdown = function( text ) {
    this.type = 'Dropdown';
    this.text = text;

    this.elements = [];

    this.addElement = function( element ) {
        this.elements.push( element );
    }

    this.domElement = function() {
        this.div = document.createElement( 'div' );
        this.div.className = 'btn-group btn-group-md dropup';
        this.div.role = 'group';

        this.btn = document.createElement( 'button' );
        this.btn.className = 'btn btn-default dropdown-toggle';

        var att;
        att = document.createAttribute( 'data-toggle' );
        att.value = 'dropdown';
        this.btn.setAttributeNode( att );

        att = document.createAttribute( 'aria-haspopup' );
        att.value = 'true';
        this.btn.setAttributeNode( att );

        att = document.createAttribute( 'aria-expanded' );
        att.value = 'false';
        this.btn.setAttributeNode( att );

        this.btn.innerHTML = '{0}<span class="caret"></span>'.format( this.text );

        this.div.appendChild( this.btn );

        this.ul = document.createElement( 'ul' );
        this.ul.className = 'dropdown-menu';

        for ( var el = 0; el < this.elements.length; el++ ) {
            var li = document.createElement( 'li' );
            li.appendChild( this.elements[ el ].domElement() );
            this.ul.appendChild( li );
        }

        this.div.appendChild( this.ul );

        return this.div;
    }
}

function UIaddButton( button ) {
    ui.push( button );
}

function UIaddDropdown( dropdown ) {
    ui.push( dropdown );
}

function UIgenerate() {
    var o = document.getElementById( 'overlay' );

    for ( var u = 0; u < ui.length; u++ )
        o.appendChild( ui[ u ].domElement() );
}


/**
 * Displays a success message at the top of the screen.
 *
 * @param { string } text Text to display
 */
function alertSuccess( text ) {
    document.getElementById( 'alerts' ).innerHTML += alert.format( 'success', 'Success', text );
}

/**
 * Displays an info message at the top of the screen.
 *
 * @param { string } text Text to display
 */
function alertInfo( text ) {
    document.getElementById( 'alerts' ).innerHTML += alert.format( 'info', 'Info', text );
}

/**
 * Displays a warning message at the top of the screen.
 *
 * @param { string } text Text to display
 */
function alertWarning( text ) {
    document.getElementById( 'alerts' ).innerHTML += alert.format( 'warning', 'Warning', text );
}

/**
 * Displays an error message at the top of the screen.
 *
 * @param { string } text Text to display
 */
function alertError( text ) {
    document.getElementById( 'alerts' ).innerHTML += alert.format( 'danger', 'Error', text );
}

function displayFPS() {
    var but = document.getElementById('fpstoggle');
    var div = stats.domElement;

    if (div.style.display === 'none') {
        div.style.display = 'block';
        but.innerHTML = 'Hide FPS';
    } else {
        div.style.display = 'none';
        but.innerHTML = 'Show FPS';
    }
}
