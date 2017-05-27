const nativeModule = require("../lib/binding.js");
const assert = require("assert");

assert(nativeModule.<%= moduleClassName %>, "The expected module is undefined");

function testBasic()
{
    const instance = new nativeModule.<%= moduleClassName %>("mr-yeoman");
    assert(instance.greet, "The expected method is not defined");
    assert.strictEqual(instance.greet("kermit"), "mr-yeoman", "Unexpected value returned");
}

function testInvalidParams()
{
    const instance = new nativeModule.<%= moduleClassName %>();
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");
assert.throws(testInvalidParams, undefined, "testInvalidParams didn't throw");

console.log("Tests passed- everything looks OK!");