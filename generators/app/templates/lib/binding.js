const addon = require('../build/Release/<%= moduleFileName %>');

function <%= moduleClassName %>(name) {
    this.greet = function(str) {
        return _addonInstance.greet(str);
    }

    var _addonInstance = new addon.<%= moduleClassName %>(name);
}

module.exports = <%= moduleClassName %>;
