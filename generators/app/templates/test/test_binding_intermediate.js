const addon = require("../");
const assert = require("assert");

assert(addon.<%= moduleClassName %>, "The expected module is undefined");

function testBasic()
{
    const instance = new addon.<%= moduleClassName %>("mr-yeoman");
    assert(instance.greet, "The expected method is not defined");
    assert.strictEqual(instance.greet("kermit"), "mr-yeoman", "Unexpected value returned");
}

function testInvalidParams()
{
    const instance = new addon.<%= moduleClassName %>();
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");
assert.throws(testInvalidParams, undefined, "testInvalidParams didn't throw");

console.log("Tests passed- everything looks OK!");
