const addon = require('../build/Release/<%= moduleFileName %>');

interface I<%= moduleClassName %>Native
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
    private _addonInstance: I<%= moduleClassName %>Native;
}

export = <%= moduleClassName %>;
