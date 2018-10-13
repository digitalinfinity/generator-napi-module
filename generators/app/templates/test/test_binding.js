const <%= moduleClassName %> = require("<%= bindingJsFile %>");
const assert = require("assert");

assert(<%= moduleClassName %>, "The expected function is undefined");

function testBasic()
{
    const result =  <%= moduleClassName %>("hello");
    assert.strictEqual(result, "world", "Unexpected value returned");
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");

console.log("Tests passed- everything looks OK!");