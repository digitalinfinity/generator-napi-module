# generator-napi-module [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A yeoman generator to create a next-generation Node native module using N-API

Use this module to quickly generate a skeleton module using [N-API](https://nodejs.org/dist/latest-v8.x/docs/api/n-api.html),
the new API for Native addons introduced in Node 8. This module automatically
sets up your gyp files to use [node-addon-api](https://www.npmjs.com/package/node-addon-api), 
the C++ wrappers for N-API and generates a wrapper JS module. Optionally, it 
can even configure the generated project to use TypeScript instead!

## Installation

First, install [Yeoman](http://yeoman.io) and generator-napi-module using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-napi-module
```

Create a directory for your N-API module:
```bash
mkdir <moduleName>
cd <moduleName>
```

Then generate your new project:

```bash
yo napi-module
```

This will generate a really simple N-API module- think of this as the Hello world
of N-API modules. If you want a slightly more complicated module that is similar
to what you'd write in a real world N-API module, run the following command:
```bash
yo napi-module --intermediate
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## Contributing

This project accepts pull requests! To contribute a change:
1. Fork this repo
2. Run `npm install` to install your dependencies
3. Make your changes
4. Run `npm run build` to compile the TypeScript file
5. Run `npm run test` to verify that the unit tests pass
6. Run `npm link` to "install" your generator
7. Create a scratch directory:
    7.1. Run `yo napi-module`
    7.2. Run `npm test`

If all looks good, submit your PR!

## License

MIT © [Hitesh Kanwathirtha]()


[npm-image]: https://badge.fury.io/js/generator-napi-module.svg
[npm-url]: https://npmjs.org/package/generator-napi-module
[travis-image]: https://travis-ci.org/digitalinfinity/generator-napi-module.svg?branch=master
[travis-url]: https://travis-ci.org/digitalinfinity/generator-napi-module
[daviddm-image]: https://david-dm.org/digitalinfinity/generator-napi-module.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/digitalinfinity/generator-napi-module
