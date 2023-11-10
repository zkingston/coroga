function CommandLine(env) {
    this.env = env;
    this.parse = function(text) {
        if (text == "") {
            return
        }
        text = text.trim();
        tokens = text.split();
        var zip = parseInt(tokens[0])
        console.log(zip);
        if (zip) {
            userData.location = zip;
        } else {
            console.log(text + " was not recognized as a command")
        }
    }
}