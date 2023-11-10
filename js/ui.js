alert =
    '<div id="alert-content" class="alert alert-{0} fade in"><a href="#" style="padding-left: 10px" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong style="padding-right: 10px">{1}</strong> {2} </div>'
ui = []
/**
 * Creates an instance of a CRGButton, used to generate UI elements on the
 * bottom toolbar.
 *
 * @constructor
 * @this { CRGButton }
 * @param { string }                text     Initial display text
 * @param { function( CRGButton ) } callback Callback function called on click
 */
CRGButton = function(text, callback) {
    this.type = 'Button';
    this.text = text;
    this.enable = true;
    var that = this;
    this.callback = function() {
        if (that.enable)
            callback(that);
    };
    this.elements = [];
    /**
     * Adds a new CRGDropdownButton element to the dropdown list. When used,
     * transforms this button into a button with dropdown menu.
     *
     * @param { CRGDropdownButton } element New element to add
     */
    this.addElement = function(element) {
        this.elements.push(element);
    };
    /**
     * Sets the displayed text of the button after it has been created.
     *
     * @param { string } text New text to set
     *
     * @return { CRGButton } This
     */
    this.setTextNode = function(text) {
        this.text = text;
        if (typeof this.btn !== 'undefined') {
            this.btn.removeChild(this.textNode);
            this.textNode = this.textGen();
            this.btn.appendChild(this.textNode);
        }
        return this;
    };
    /**
     * Sets glyphicon to display to the left of the text of the button.
     *
     * @param { string } icon Name of the icon. See http://getbootstrap.com/components/
     *                        for icon list
     *
     * @return { CRGButton } This
     */
    this.setGlyphicon = function(icon) {
        this.icon = icon;
        return this;
    };
    this.textGen = function() {
        var textNode = document.createTextNode(this.text);
        if (typeof this.icon !== 'undefined') {
            var span = document.createElement('span');
            span.className = 'glypicon glyphicon-{0}'.format(this.icon);
            span.innerHTML = '  ';
            var att = document.createAttribute('aria-hidden');
            att.value = 'true';
            span.setAttributeNode(att);
            var t = textNode
            span.appendChild(textNode);
            textNode = span;
        }
        return textNode;
    };
    /**
     * Set the enable / disable state of the button.
     *
     * @param { boolean } enable Enabled status.
     *
     * @return { CRGButton } This
     */
    this.setEnable = function(enable) {
        this.enable = enable;
        if (typeof this.btn !== 'undefined') {
            if (this.enable)
                this.btn.className = 'btn btn-default enabled';
            else
                this.btn.className = 'btn btn-default disabled';
        }
        return this;
    }
    /**
     * Generates and returns the document element corresponding to the
     * constructed button.
     *
     * @return { Element } Document element for this button
     */
    this.dom = function() {
        this.btn = document.createElement('button');
        if (this.enable)
            this.btn.className = 'btn btn-default enabled';
        else
            this.btn.className = 'btn btn-default disabled';
        this.btn.onclick = this.callback;
        this.textNode = this.textGen();
        this.btn.appendChild(this.textNode);
        this.btn.style.clear = 'both';
        this.btn.style.cssfloat = 'left';
        var div = document.createElement('div');
        div.className = 'btn-group btn-group-md';
        div.appendChild(this.btn);
        if (this.elements.length) {
            var dd = new CRGDropdown('');
            dd.elements = this.elements;
            div.appendChild(dd.dom());
        }
        return div;
    };
};
CRGButton.prototype = Object.create(CRGButton.prototype);
CRGButton.prototype.constructor = CRGButton;
CRGButton.prototype.clone = function() {
    return new CRGButton(this.text, this.callback);
};
/**
 * Creates an instance of a CRGDropdownSeperator, which can be used
 * to separate groups of options in a CRGDropdown.
 *
 * @constructor
 * @this { CRGDropdownSeperator }
 */
CRGDropdownSeparator = function() {
    /**
     * Generates and returns the document element corresponding to the
     * constructed dropdown button.
     *
     * @return { Element } Document element for this button
     */
    this.dom = function() {
        var li = document.createElement('li');
        li.className = 'divider';
        li.role = 'separator';
        return li;
    };
};
/**
 * Creates an instance of a CRGDropdownButton, used to generate UI elements
 * inside of a CRGDropdown object.
 *
 * @constructor
 * @this { CRGDropdownButton }
 * @param { string }                        text     Initial display text
 * @param { function( CRGDropdownButton ) } callback Callback function
 */
CRGDropdownButton = function(text, callback) {
    this.type = 'DropdownButton';
    this.text = text;
    this.enable = true;
    var that = this;
    this.callback = function() {
        if (that.enable)
            callback(that);
    };
    /**
     * Sets the displayed text of the button after it has been created.
     *
     * @param { string } text New text to set
     *
     * @return { CRGDropdownButton } This
     */
    this.setTextNode = function(text) {
        this.text = text;
        if (typeof this.a !== 'undefined') {
            this.a.removeChild(this.textNode);
            this.textNode = document.createTextNode(this.text)
            this.a.appendChild(this.textNode);
        }
        return this;
    };
    /**
     * Set the enable / disable state of the button.
     *
     * @param { boolean } enable Enabled status.
     *
     * @return { CRGDropdownButton } This
     */
    this.setEnable = function(enable) {
        this.enable = enable;
        if (typeof this.li !== 'undefined') {
            if (this.enable)
                this.li.className = 'enabled';
            else
                this.li.className = 'disabled';
        }
        return this;
    }
    /**
     * Generates and returns the document element corresponding to the
     * constructed dropdown button.
     *
     * @return { Element } Document element for this button
     */
    this.dom = function() {
        this.a = document.createElement('a');
        this.a.onclick = this.callback;
        this.a.href = '#';
        this.textNode = document.createTextNode(this.text)
        this.a.appendChild(this.textNode);
        this.li = document.createElement('li');
        this.li.appendChild(this.a);
        if (this.enable)
            this.li.className = 'enabled';
        else
            this.li.className = 'disabled';
        return this.li;
    };
};
CRGDropdownButton.prototype = Object.create(CRGDropdownButton.prototype);
CRGDropdownButton.prototype.constructor = CRGDropdownButton;
CRGDropdownButton.prototype.clone = function() {
    return new CRGDropdownButton(this.text, this.callback);
};
/**
 * Creates an instance of a CRGDropdown, a dropdown menu that can be added to
 * the bottom toolbar.
 *
 * @constructor
 * @this { CRGDropdown }
 * @param { string } text Display text
 */
CRGDropdown = function(text) {
    this.type = 'Dropdown';
    this.text = text;
    this.elements = [];
    /**
     * Adds a new CRGDropdownButton element to the dropdown list.
     *
     * @param { CRGDropdownButton } element New element to add
     */
    this.addElement = function(element) {
        this.elements.push(element);
    };
    /**
     * Generates and returns the document element corresponding to the
     * constructed dropdown list.
     *
     * @return { Element } Document element for this dropdown
     */
    this.dom = function() {
        this.div = document.createElement('div');
        this.div.className = 'btn-group btn-group-md dropup';
        this.div.role = 'group';
        this.btn = document.createElement('button');
        this.btn.className = 'btn btn-default dropdown-toggle';
        var att;
        att = document.createAttribute('data-toggle');
        att.value = 'dropdown';
        this.btn.setAttributeNode(att);
        att = document.createAttribute('aria-haspopup');
        att.value = 'true';
        this.btn.setAttributeNode(att);
        att = document.createAttribute('aria-expanded');
        att.value = 'false';
        this.btn.setAttributeNode(att);
        this.btn.innerHTML = '{0} <span class="caret"></span>'.format(
            this.text);
        this.div.appendChild(this.btn);
        this.ul = document.createElement('ul');
        this.ul.className = 'dropdown-menu';
        for (var i = 0; i < this.elements.length; i++)
            this.ul.appendChild(this.elements[i].dom());
        this.div.appendChild(this.ul);
        return this.div;
    };
};
CRGDropdown.prototype = Object.create(CRGDropdown.prototype);
CRGDropdown.prototype.constructor = CRGDropdown;
CRGDropdown.prototype.clone = function() {
    var d = new CRGDropdown(this.text);
    for (var i = 0; i < this.elements.length; i++)
        d.addElement(this.elements[i].clone());
    return d;
};
CRGTextInput = function(text, callback) {
    this.type = 'text';
    this.text = text;
    this.enable = true;
    var that = this;
    this.callback = function() {
        if (that.enable)
            callback(that);
    };
    this.setEnable = function(enable) {
        this.enable = enable;
    }
    /**
     * Generates and returns the document element corresponding to the
     * constructed button.
     *
     * @return { Element } Document element for this button
     */
    this.dom = function() {
        this.cl = document.createElement('input');
        this.cl.setAttribute("placeholder", text)
        this.cl.setAttribute("type", "text")
        this.cl.onclick = this.cl.focus;
        //  this.cl.className = "input-field-cl"
        this.cl.style.visibility = "visible"
        var div = document.createElement('span');
        div.className = 'command_line';
        div.appendChild(this.cl);
        return div
    };
    this.getText = function() {
        var rval = this.cl.value;
        this.cl.value = "";
        return rval;
    }
};
CRGTextInput.prototype = Object.create(CRGTextInput.prototype);
CRGTextInput.prototype.constructor = CRGTextInput;
CRGTextInput.prototype.clone = function() {
    return new CRGTextInput(this.text, this.callback);
};
/**
 * Adds an element to the global UI.
 *
 * @param { CRGButton | CRGDropdown } element Element to add to UI
 */
function UIaddElement(element) {
    ui.push(element);
}
/**
 * Generates the UI elements added.
 */
function UIgenerate() {
    var o = document.getElementById('overlay');
    for (var u = 0; u < ui.length; u++) {
        o.appendChild(ui[u].dom());
        var s = document.createElement('span');
        s.innerHTML = '&nbsp&nbsp'
        o.appendChild(s);
    }
}
/**
 * Displays a success message at the top of the screen.
 *
 * @param { string } text Text to display
 */
function alertSuccess(text) {
    document.getElementById('alerts')
        .innerHTML += alert.format('success', 'Success', text);
}
/**
 * Displays an info message at the top of the screen.
 *
 * @param { string } text Text to display
 */
function alertInfo(text) {
    document.getElementById('alerts')
        .innerHTML += alert.format('info', 'Info', text);
}
/**
 * Displays a warning message at the top of the screen.
 *
 * @param { string } text Text to display
 */
function alertWarning(text) {
    document.getElementById('alerts')
        .innerHTML += alert.format('warning', 'Warning', text);
}
/**
 * Displays an error message at the top of the screen.
 *
 * @param { string } text Text to display
 */
function alertError(text) {
    document.getElementById('alerts')
        .innerHTML += alert.format('danger', 'Error', text);
}