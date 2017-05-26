'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const initPackageJson = require('init-package-json');
const path = require('path');
const uppercamelcase = require('uppercamelcase');

function createPackageJson()
{
    // Figure out the directory to put in .npm-init
    // The assumption is that all of the directories 
    // that we try below will be writable
    let npmDirRoot = process.env.HOME;
    if (!npmDirRoot)
    {
        // Try USERPROFILE, this gets defined on Windows
        npmDirRoot = process.env.USERPROFILE;
        if (!npmDirRoot)
        {
            // If all else fails, try using the current directory
            npmDirRoot = ".";
        }
    }

    const initFile = path.resolve(npmDirRoot, '.npm-init')
    const dir = process.cwd()

    return new Promise(function(resolve, reject) {
      initPackageJson(dir, initFile, {}, function (error, data) {
          if (error)
          {
              reject(error);
          }

          var moduleName = data["name"];
          var props = 
            {
                moduleFileName: `${moduleName}-native`,
                moduleSourceFileName: moduleName.replace(new RegExp('-', 'g'), '_') + ".cc",
                moduleClassName: uppercamelcase(moduleName)
            };
            
          resolve(props);
      });
    });
}

module.exports = class extends Generator {
  default() {
    this.composeWith(require.resolve('generator-node/generators/app'), 
      // options
      {
        boilerplate: false,
        editorconfig: false,
        git: false,
        travis: false
      });
  }

  // prompting() {
  //   // Have Yeoman greet the user.
  //   this.log(yosay(
  //     'Welcome to the bedazzling ' + chalk.red('N-API module') + ' generator!'
  //   ));

  //   this.fs.copy(
  //     this.templatePath('package.json'),
  //     this.destinationPath('package.json')
  //   );

  //   const oThis = this;
  //   return new Promise((resolve, reject) => {
  //     oThis.fs.commit([], function() {
  //       createPackageJson().then(props => {
  //         oThis.props = props;
  //         resolve()
  //       }).catch(reject);
  //     })
  //   });
  // }

  // writing() {
  //   const files = [
  //       ['binding.gyp'],
  //       ['lib/binding.js'],
  //       ['src/module.cc', `src/${this.props.moduleSourceFileName}`],
  //       ['test/hello.js']
  //   ];

  //   for (const fileSpec of files)
  //   {
  //     var src = this.templatePath(fileSpec[0]);
  //     var dest = this.destinationPath(fileSpec[fileSpec.length - 1]);

  //     console.log(`Copying ${src} to ${dest}`)

  //     this.fs.copyTpl(
  //       src,
  //       dest,
  //       this.props
  //     );
  //   }
  // }

  // install() {
  //   this.npmInstall([], { 'save-dev': true });
  // }
};
