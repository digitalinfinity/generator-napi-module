import * as Generator from 'yeoman-generator';
import * as path from 'path';

// Stuff without types
const chalk = require('chalk');
const initPackageJson = require('init-package-json');
const uppercamelcase = require('uppercamelcase');
const yosay = require('yosay');

interface IGeneratorProps
{
  bindingJsFile: string,
  moduleFileName: string,
  moduleSourceFileName: string,
  moduleHeaderFileName: string,
  moduleClassName: string
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

  return new Promise<IGeneratorProps>(function (resolve, reject) {
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

      resolve(props);
    });
  });
}

module.exports = class extends Generator {
  _packageConfigFunc: () => Promise<IGeneratorProps>;
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

    const genTypeScript = (this.options as any).typescript;
    let sourcePackageJson = 'package.json';

    if (genTypeScript)
    {
      sourcePackageJson = 'package.ts.json';
    }

    // First, deploy package.json
    // We'll use this to start configuring the package's properties
    this.fs.copy(
      this.templatePath(sourcePackageJson),
      this.destinationPath('package.json')
    );

    const oThis = this;
    return new Promise((resolve, reject) => {
      oThis.fs.commit([], async function () {
        // Get the properties we need to fill in the templates
        oThis.props = await oThis._packageConfigFunc();
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
        ['src/include/module.h', `src/include/${this.props.moduleHeaderFileName}`],
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
