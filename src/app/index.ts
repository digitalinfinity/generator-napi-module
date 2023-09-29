import * as fs from "fs";
import * as lodash from "lodash";
import * as path from "path";
import * as Generator from "yeoman-generator";

// Stuff without types
import chalk from "chalk";
import initPackageJson = require("init-package-json");
import * as uppercamelcase from "uppercamelcase";
import * as writeFileAtomic from "write-file-atomic";
import yosay = require("yosay");

interface IGeneratorProps {
  bindingJsFile: string;
  moduleFileName: string;
  moduleSourceFileName: string;
  moduleHeaderFileName: string;
  moduleClassName: string;
}

interface ICreatePackageJsonResult {
  packageJsonData: any;
  props: IGeneratorProps;
}

function getValidModuleName(strName: string) {
  // If the name of the module provided happens
  // to be napi, normalize it so that the header
  // doesn't clash with node-addon-api's napi.h
  if (strName.toLowerCase() === "napi") {
    strName = "napi-module";
  }

  return strName;
}

function getCppFileName(strName: string) {
  return getValidModuleName(strName).replace(new RegExp("-", "g"), "_");
}

function createPackageJson() {
  // Figure out the directory to put in .npm-init
  // The assumption is that all of the directories
  // that we try below will be writable
  let npmDirRoot = process.env.HOME;
  if (!npmDirRoot) {
    // Try USERPROFILE, this gets defined on Windows
    npmDirRoot = process.env.USERPROFILE;
    if (!npmDirRoot) {
      // If all else fails, try using the current directory
      npmDirRoot = ".";
    }
  }

  const initFile = path.resolve(npmDirRoot, ".npm-init");
  const dir = process.cwd();

  return new Promise<ICreatePackageJsonResult>((resolve, reject) => {
    initPackageJson(dir, initFile, (error: any, data: any) => {
      if (error) {
        reject(error);
      }

      const moduleName = data.name;

      const props: IGeneratorProps = {
        bindingJsFile: "../lib/binding.js",
        moduleClassName: uppercamelcase(getValidModuleName(moduleName)),
        moduleFileName: `${moduleName}-native`,
        moduleHeaderFileName: getCppFileName(moduleName) + ".h",
        moduleSourceFileName: getCppFileName(moduleName) + ".cc",
      };

      resolve({
        packageJsonData: data,
        props,
      });
    });
  });
}

async function promptForTemplate(generator: any) {
  const options = generator.options as any;

  if (options.intermediate === true) {
    return;
  }

  const answer = await generator.prompt({
    choices: [{
      name: "Hello World",
      value: "basic",
    }, {
      name: "Object Wrap",
      value: "intermediate",
    }],
    message: "Choose a template",
    name: "template",
    type: "list",
  });

  options.intermediate = answer.template === "intermediate";
}

async function updatePackageJsonForTypeScript(generator: any,
                                              currentPackageJsonData: any,
                                              packageJsonPath: string) {
  if (generator.options.typescript === false) {
    await generator.prompt([{
      default: false,
      message: "Would you like to generate TypeScript wrappers for your module?",
      name: "typescript",
      type: "confirm",
    }]).then((answers: any) => {
      (generator.options as any).typescript = answers.typescript;
    });
  }

  return new Promise<void>((resolve, reject) => {
    if (!generator.options.typescript) {
      resolve();
      return;
    }

    // We do want TypeScript support- update package.json
    let tsPackageJson;
    try {
      tsPackageJson = JSON.parse(fs.readFileSync(generator.templatePath("package.ts.json"), "utf8"));
    } catch (e) {
      reject(e);
    }

    if (!tsPackageJson) {
      reject("Invalid TypeScript package");
    }

    // @ts-ignore
    currentPackageJsonData = lodash.merge(currentPackageJsonData, tsPackageJson);
    writeFileAtomic(packageJsonPath,
      JSON.stringify(currentPackageJsonData, null, 4),
      (err: any) => {
        if (err) {
          reject(err);
          return;
        }

        generator.log("Updated package.json to support TypeScript");
        resolve();
        return;
      });
  });
}

async function updatePackageJsonWithBuildType(generator: any,
                                              currentPackageJsonData: any,
                                              packageJsonPath: string) {
  if (generator.options.cmake === false) {
    await generator.prompt([{
      choices: ["gyp", "cmake-js"],
      default: false,
      message: "Which build system do you want to use ?",
      name: "build_type",
      type: "list",
    }]).then((answers: any) => {
      (generator.options as any).cmake = answers.build_type === "cmake-js";
    });
  }

  return new Promise<void>((resolve, reject) => {

    // We do want CMake support- update package.json
    let buildPackageJsonFileName;
    if (generator.options.cmake) {
      buildPackageJsonFileName = "package.cmake.json";
    } else {
      buildPackageJsonFileName = "package.gyp.json";
    }
    let buildPackageJson;
    try {
      buildPackageJson = JSON.parse(fs.readFileSync(generator.templatePath(buildPackageJsonFileName), "utf8"));
    } catch (e) {
      reject(e);
    }

    if (!buildPackageJson) {
      reject("Invalid TypeScript package");
    }

    // @ts-ignore
    currentPackageJsonData = lodash.merge(currentPackageJsonData, buildPackageJson);
    writeFileAtomic(packageJsonPath,
      JSON.stringify(currentPackageJsonData, null, 4),
      (err: any) => {
        if (err) {
          reject(err);
          return;
        }

        generator.log("Updated package.json to build ", generator.options.cmake ? "CMake.js" : "gyp");
        resolve();
        return;
      });
  });
}

module.exports = class extends Generator {
  private packageConfigFunc: () => Promise<ICreatePackageJsonResult>;
  private props?: IGeneratorProps;

  constructor(args: any, opts: any) {
    super(args, opts);

    this.option("intermediate",
      {
        alias: "i",
        default: false,
        description: "Generate a wrapper with an intermediate code example",
        hide: false,
        type: Boolean,
      });

    this.option("typescript",
      {
        alias: "t",
        default: false,
        description: "Generate the wrapper binding in TypeScript instead of JavaScript",
        hide: false,
        type: Boolean,
      });

    this.option("cmake",
      {
        alias: "c",
        default: false,
        description: "Generate a wrapper with CMakeJS build instead of gyp",
        hide: false,
        type: Boolean,
      });

    this.packageConfigFunc = opts.packageConfigFunc || createPackageJson;
  }

  public prompting() {
    // Yeoman is polite- greet the user
    this.log(yosay(
      "Welcome to the bedazzling " + chalk.red("N-API module") + " generator!",
    ));

    const destPackageJson = this.destinationPath("package.json");
    // First, deploy package.json
    // We'll use this to start configuring the package's properties
    this.fs.copy(
      this.templatePath("package.json"),
      destPackageJson,
    );

    return new Promise<void>((resolve, reject) => {
      this.fs.commit([], async () => {
        // Get the properties we need to fill in the templates
        const result = await this.packageConfigFunc();

        this.props = result.props;

        await promptForTemplate(this);
        await updatePackageJsonForTypeScript(this,
          result.packageJsonData,
          destPackageJson);
        await updatePackageJsonWithBuildType(this,
          result.packageJsonData,
          destPackageJson);

        resolve();
      });
    });
  }

  public writing() {
    if (!this.props) {
      throw new Error("Missing project properties");
    }

    const genTypeScript = (this.options as any).typescript;
    const genIntermediate = (this.options as any).intermediate;
    const useCmake = (this.options as any).cmake;

    const files: string[][] = [];

    files.push(["npmignore", ".npmignore"]);
    files.push(["gitignore", ".gitignore"]);

    // index entry-point
    // const bindingWrapperTarget = "index.js";
    // const bindingWrapperSrc = (genIntermediate ?
    //   "index_intermediate.js" :
    //   bindingWrapperTarget);
    // files.push([bindingWrapperSrc, bindingWrapperTarget]);
    files.push(["index.js"]);

    // build system
    if (useCmake) {
      files.push(["CMakeLists.txt"]);
    } else {
      files.push(["binding.gyp"]);
    }

    // Source files (C++ and JS) and tests
    if (genIntermediate) {
      files.push(["src/module_intermediate.cc", `src/${this.props.moduleSourceFileName}`]);
      files.push(["src/module_intermediate.h", `src/${this.props.moduleHeaderFileName}`]);
    } else {
      files.push(["src/module.cc", `src/${this.props.moduleSourceFileName}`]);
    }

    // Typescript definitions & configs
    if (genTypeScript) {
      files.push(["types/index.d.ts"]);
      const declarationFileSrc = genIntermediate ? "types/module_intermediate.d.ts" : "types/module.d.ts";
      files.push([declarationFileSrc, `types/${this.props.moduleFileName}.d.ts`]);
      files.push(["tsconfig.json"]);
    }

    // Test files
    const ext = genTypeScript ? "ts" : "js";
    const testFileTarget = `test/test_binding.${ext}`;
    const testFileSource = genIntermediate ? `test/test_binding_intermediate.${ext}` : testFileTarget;

    files.push([testFileSource, testFileTarget]);

    // Scripts
    files.push(["scripts/preinstall.sh"]);

    for (const fileSpec of files) {
      const src = this.templatePath(fileSpec[0]);
      const dest = this.destinationPath(fileSpec[fileSpec.length - 1]);

      this.fs.copyTpl(
        src,
        dest,
        this.props,
      );
    }
  }

  public install() {
    this.npmInstall([], {}, (err: any) => {
      if (!err) {
        this.log(chalk.green("Everything looks good!"));
        this.log(`You can now run ${chalk.yellow("npm test")} to verify that the module tests pass`);
      }
    });
  }
};
