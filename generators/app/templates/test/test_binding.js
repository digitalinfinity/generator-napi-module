const addon = require("../");
const assert = require("assert");

assert(addon.<%= moduleClassName %>, "The expected function is undefined");

function testBasic()
{
    const result =  addon.<%= moduleClassName %>("hello");
    assert.strictEqual(result, "world", "Unexpected value returned");
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");

console.log("Tests passed- everything looks OK!");
