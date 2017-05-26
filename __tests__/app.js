'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const uppercamelcase = require('uppercamelcase');

function defaultPackageConfigFunc() {
  return new Promise(resolve => {
    const moduleName = 'test-napi-module';

    resolve({
      moduleFileName: `${moduleName}-native`,
      moduleSourceFileName: moduleName.replace(new RegExp('-', 'g'), '_') + '.cc',
      moduleClassName: uppercamelcase(moduleName)
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
      '__tests__/binding.js'
    ]);
  });
});
