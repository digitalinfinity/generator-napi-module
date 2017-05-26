const nativeModule = require('../lib/binding.js');

test('<%= moduleClassName %> is set up correctly', () => {
    expect(nativeModule.<%= moduleClassName %>).toBeDefined();
    expect(nativeModule.<%= moduleClassName %>.getGreeting).toBeDefined();
    expect(nativeModule.<%= moduleClassName %>.getGreeting()).toBe('hello');
});

test('<%= moduleClassName %> returns the right value', () => {
    expect(nativeModule.<%= moduleClassName %>.getGreeting()).toBe('hello');
});