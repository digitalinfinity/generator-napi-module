const addon = require('../build/Release/<%= moduleFileName %>');

interface I<%= moduleClassName %>
{
    greet(strName: string): string;
};

class <%= moduleClassName %> {
    constructor(name: string) {
        this._addonInstance = new addon.<%= moduleClassName %>(name)
    }

    greet (strName: string) {
        return this._addonInstance.greet(strName);
    }

    // private members
    _addonInstance: I<%= moduleClassName %>;
}

module.exports = <%= moduleClassName %>;
