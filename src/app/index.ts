import * as Generator from 'yeoman-generator';
import * as path from 'path';
import * as fs from 'fs';

// Stuff without types
const chalk = require('chalk');
const initPackageJson = require('init-package-json');
const uppercamelcase = require('uppercamelcase');
const writeFileAtomic = require('write-file-atomic');
const yosay = require('yosay');

interface IGeneratorProps
{
  bindingJsFile: string,
  moduleFileName: string,
  moduleSourceFileName: string,
  moduleHeaderFileName: string,
  moduleClassName: string
};

interface ICreatePackageJsonResult
{
  packageJsonData: any,
  props: IGeneratorProps
};

function getValidModuleName(strName: string) {
  // If the name of the module provided happens 
  // to be napi, normalize it so that the header
  // doesn't clash with node-addon-api's napi.h
  if (strName.toLowerCase() === "napi")
  {
    strName = "napi-module";
  }

  return strName;
}

function getCppFileName(strName: string) {
  return getValidModuleName(strName).replace(new RegExp('-', 'g'), '_') 
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
      npmDirRoot = '.';
    }
  }

  const initFile = path.resolve(npmDirRoot, '.npm-init');
  const dir = process.cwd();

  return new Promise<ICreatePackageJsonResult>(function (resolve, reject) {
    initPackageJson(dir, initFile, {}, function (error: any, data: any) {
      if (error) {
        reject(error);
      }

      const moduleName = data.name;

      const props: IGeneratorProps =
        {
          bindingJsFile: '../lib/binding.js',
          moduleFileName: `${moduleName}-native`,
          moduleSourceFileName: getCppFileName(moduleName) + '.cc',
          moduleHeaderFileName: getCppFileName(moduleName) + '.h',
          moduleClassName: uppercamelcase(getValidModuleName(moduleName))
        };

      resolve({
        packageJsonData: data,
        props: props
      });
    });
  });
}

async function updatePackageJsonForTypeScript(generator: any, 
  currentPackageJsonData: any,
  packageJsonPath: string) {
  if (generator.options.typescript == false)
  {
      await generator.prompt([{
        type: 'confirm',
        name: 'typescript',
        message: 'Would you like to generate TypeScript wrappers for your module?',
        default: false
      }]).then((answers: any) => {
            (generator.options as any).typescript = answers.typescript;
      });
  }

  return new Promise(function(resolve, reject) {
    if (!generator.options.typescript)
    {
      resolve();
      return;
    }

    // We do want TypeScript support- update package.json
    let tsPackageJson = undefined;
    try {
      tsPackageJson = JSON.parse(fs.readFileSync(generator.templatePath("package.ts.json"), 'utf8'));
    }
    catch (e) {
      reject(e);
    }

    if (!tsPackageJson)
    {
      reject("Invalid TypeScript package");
    }

    Object.assign(currentPackageJsonData, tsPackageJson);
    writeFileAtomic(packageJsonPath, 
      JSON.stringify(currentPackageJsonData, null, 4), 
      function(err: any) {
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

module.exports = class extends Generator {
  _packageConfigFunc: () => Promise<ICreatePackageJsonResult>;
  props: IGeneratorProps;

  constructor(args: any, opts: any) {
    super(args, opts);

    this.option('typescript', 
      {
        'description': 'Generate the wrapper binding in TypeScript instead of JavaScript',
        'alias': 't',
        'type': Boolean,
        'default': false,
        'hide': false
      });

    this._packageConfigFunc = opts.packageConfigFunc || createPackageJson;
  }

  prompting() {
    // Yeoman is polite- greet the user
    this.log(yosay(
      'Welcome to the bedazzling ' + chalk.red('N-API module') + ' generator!'
    ));

    const destPackageJson = this.destinationPath('package.json');
    // First, deploy package.json
    // We'll use this to start configuring the package's properties
    this.fs.copy(
      this.templatePath("package.json"),
      destPackageJson
    );

    const oThis = this;
    return new Promise((resolve, reject) => {
      oThis.fs.commit([], async function () {
        // Get the properties we need to fill in the templates
        const result = await oThis._packageConfigFunc();

        oThis.props = result.props;

        await updatePackageJsonForTypeScript(oThis, 
                result.packageJsonData,
                destPackageJson);
        resolve();
      });
    });
  }

  writing() {
    let bindingWrapper = 'lib/binding.js';
    const genTypeScript = (this.options as any).typescript;
    if (genTypeScript)
    {
      bindingWrapper = 'lib/binding.ts';
      this.props.bindingJsFile = '../dist/binding.js';
    }

    const files = [
        ['binding.gyp'],
        [bindingWrapper],
        ['src/module.cc', `src/${this.props.moduleSourceFileName}`],
        ['src/module.h', `src/${this.props.moduleHeaderFileName}`],
        ['test/test_binding.js']
    ];

    if (genTypeScript)
    {
      files.push(['tsconfig.json']);
    }

    for (const fileSpec of files) {
      const src = this.templatePath(fileSpec[0]);
      const dest = this.destinationPath(fileSpec[fileSpec.length - 1]);

      this.fs.copyTpl(
        src,
        dest,
        this.props
      );
    }
  }

  install() {
    const oThis = this;
    this.npmInstall([], {}, function(err: any) {
      if (!err) {
        oThis.log(chalk.green("Everything looks good!"));
        oThis.log(`You can now run ${chalk.yellow('npm test')} to verify that the module tests pass`);
      }
    });
  }
};
