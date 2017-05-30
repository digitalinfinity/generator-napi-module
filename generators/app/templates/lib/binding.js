const addon = require('../build/Release/<%= moduleFileName %>');

function <%= moduleClassName %>(name) {
    var oThis = this;

    oThis.greet = function(str) {
        return _addonInstance.greet(str);
    }

    var _addonInstance = new addon.<%= moduleClassName %>(name);
}

module.exports = <%= moduleClassName %>;
