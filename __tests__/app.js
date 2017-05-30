'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const uppercamelcase = require('uppercamelcase');

function defaultPackageJson() {
  return {
    description: "dummy module",
    repository: "https://github.com/blah/blah",
    license: "MIT",
    private: true
  };
}

function defaultProps() {
  const moduleName = 'test-napi-module';
  return {
    moduleFileName: `${moduleName}-native`,
    moduleSourceFileName: moduleName.replace(new RegExp('-', 'g'), '_') + '.cc',
    moduleHeaderFileName: moduleName.replace(new RegExp('-', 'g'), '_') + '.h',
    moduleClassName: uppercamelcase(moduleName),
    bindingJsFile: '../lib/binding.js'
  };
}

function defaultPackageConfigFunc() {
  return new Promise(resolve => {
    resolve({
      props: defaultProps(),
      packageJsonData: defaultPackageJson()
    });
  });
}

function defaultTypeScriptPackageConfigFunc() {
  return new Promise(resolve => {
    const tsProps = defaultProps();
    tsProps.bindingJsFile = '../dist/binding.js';
    resolve({
      props: tsProps,
      packageJsonData: defaultPackageJson()
    });
  });
}

describe('generator-napi-module:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({packageConfigFunc: defaultPackageConfigFunc});
  });

  it('creates files', () => {
    assert.file([
      'binding.gyp',
      'lib/binding.js',
      'src/test_napi_module.cc',
      'src/include/test_napi_module.h',
      'test/test_binding.js'
    ]);
  });
});

describe('generator-napi-module:app:ts', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({packageConfigFunc: defaultTypeScriptPackageConfigFunc, typescript: true});
  });

  it('creates files', () => {
    assert.file([
      'binding.gyp',
      'lib/binding.ts',
      'src/test_napi_module.cc',
      'src/include/test_napi_module.h',
      'test/test_binding.js'
    ]);
  });
});

