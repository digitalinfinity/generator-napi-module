"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const uppercamelcase = require("uppercamelcase");

function defaultPackageJson() {
  return {
    description: "dummy module",
    repository: "https://github.com/blah/blah",
    license: "MIT",
    private: true,
  };
}

function defaultProps() {
  const moduleName = "test-napi-module";
  return {
    moduleFileName: `${moduleName}-native`,
    moduleSourceFileName: moduleName.replace(new RegExp("-", "g"), "_") + ".cc",
    moduleHeaderFileName: moduleName.replace(new RegExp("-", "g"), "_") + ".h",
    moduleClassName: uppercamelcase(moduleName),
    // bindingJsFile: '../lib/binding.js'
  };
}

function defaultPackageConfigFunc() {
  return new Promise(resolve => {
    resolve({
      props: defaultProps(),
      packageJsonData: defaultPackageJson(),
    });
  });
}

/**
 * Generator with all default options (gyp:basic:js)
 */
describe("generator-napi-module:app", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ packageConfigFunc: defaultPackageConfigFunc });
  });

  it("creates files", () => {
    assert.file([
      "binding.gyp",
      "index.js",
      "scripts/preinstall.sh",
      "src/test_napi_module.cc",
      "test/test_binding.js",
    ]);
  });
});

/**
 * Generator with options (cmake:basic:js)
 */
describe("generator-napi-module:app:cmake", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ packageConfigFunc: defaultPackageConfigFunc, cmake: true });
  });

  it("creates files", () => {
    assert.file([
      "CMakeLists.txt",
      "index.js",
      "scripts/preinstall.sh",
      "src/test_napi_module.cc",
      "test/test_binding.js",
    ]);
  });
});

/**
 * Generator with options (gyp:basic:ts)
 */
describe("generator-napi-module:app:ts", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ packageConfigFunc: defaultPackageConfigFunc, typescript: true });
  });

  it("creates files", () => {
    assert.file([
      "binding.gyp",
      "index.js",
      "scripts/preinstall.sh",
      "src/test_napi_module.cc",
      "test/test_binding.ts",
      "tsconfig.json",
      "types/test-napi-module-native.d.ts",
      "types/index.d.ts",
    ]);
  });
});

/**
 * Generator with options (cmake:basic:ts)
 */
describe("generator-napi-module:app:cmake:ts", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ packageConfigFunc: defaultPackageConfigFunc, cmake: true, typescript: true });
  });

  it("creates files", () => {
    assert.file([
      "CMakeLists.txt",
      "index.js",
      "scripts/preinstall.sh",
      "src/test_napi_module.cc",
      "test/test_binding.ts",
      "tsconfig.json",
      "types/test-napi-module-native.d.ts",
      "types/index.d.ts",
    ]);
  });
});

/**
 * Generator with options (gyp:inter:js)
 */
describe("generator-napi-module:app:inter", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ packageConfigFunc: defaultPackageConfigFunc, intermediate: true});
  });

  it("creates files", () => {
    assert.file([
      "binding.gyp",
      "index.js",
      "scripts/preinstall.sh",
      "src/test_napi_module.cc",
      "src/test_napi_module.h",
      "test/test_binding.js",
    ]);
  });
});

/**
 * Generator with options (cmake:inter:js)
 */
describe("generator-napi-module:app:cmake:inter", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ packageConfigFunc: defaultPackageConfigFunc, intermediate: true, cmake: true });
  });

  it("creates files", () => {
    assert.file([
      "CMakeLists.txt",
      "index.js",
      "scripts/preinstall.sh",
      "src/test_napi_module.cc",
      "src/test_napi_module.h",
      "test/test_binding.js",
    ]);
  });
});

/**
 * Generator with options (gyp:inter:ts)
 */
describe("generator-napi-module:app:inter:ts", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ packageConfigFunc: defaultPackageConfigFunc, intermediate: true, typescript: true});
  });

  it("creates files", () => {
    assert.file([
      "binding.gyp",
      "index.js",
      "scripts/preinstall.sh",
      "src/test_napi_module.cc",
      "src/test_napi_module.h",
      "tsconfig.json",
      "test/test_binding.ts",
      "types/test-napi-module-native.d.ts",
      "types/index.d.ts"
    ]);
  });
});

/**
 * Generator with options (cmake:inter:ts)
 */
describe("generator-napi-module:app:cmake:inter:ts", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app"))
      .withOptions({ packageConfigFunc: defaultPackageConfigFunc, intermediate: true, typescript: true, cmake: true });
  });

  it("creates files", () => {
    assert.file([
      "CMakeLists.txt",
      "index.js",
      "scripts/preinstall.sh",
      "src/test_napi_module.cc",
      "src/test_napi_module.h",
      "tsconfig.json",
      "test/test_binding.ts",
      "types/test-napi-module-native.d.ts",
      "types/index.d.ts"
    ]);
  });
});
