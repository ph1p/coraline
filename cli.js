#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const meow = require('meow');
const nconf = require('nconf');
const boxen = require('boxen');

const pkg = require('./package');
const commitStyles = require('./styles');
const { parseTemplate, parseGitStatus, parseStyleObject } = require('./utils');

const { GitProcess, GitError, IGitResult } = require('dugite');

// get current path
const pathToRepository = process.cwd();

// All cli texts
const texts = {
  welcome: '  | Coraline',
  chooseDefaultStyle: 'Choose your commit style:',
  areYouSure: 'Are you sure (just hit enter for YES)?',
  nowUsing: '  | Now you are using %s',
  notAGitRepo: `
  Sorry, but "${chalk.bold(pathToRepository)}" isn't a git repository
  `,
  nothingToDo: chalk.green(`
  nothing to commit :)
`),
  finished: chalk.green(`
  DONE! :)
`),
  allCustomStyles: `
  | All custom styles from %s file`,
  includedStyles: `
  | All included styles`
};

// CLI args
const cli = meow(
  `
      Usage
        $ cl --reset
        $ cl --default
        $ cl --readme
        $ cl --list

      Options
        --help
        --reset, -r  Reset configuration
        --default, -d  Use default style
        --readme, -m Show the readme of current commit style
        --list, -l List all available styles
        --version, -v Version info`,
  {
    flags: {
      reset: {
        type: 'boolean',
        alias: 'r'
      },
      default: {
        type: 'boolean',
        alias: 'd'
      },
      readme: {
        type: 'boolean',
        alias: 'm'
      },
      list: {
        type: 'boolean',
        alias: 'l'
      },
      version: {
        type: 'boolean',
        alias: 'v'
      }
    }
  }
);

// add custom code styles
let customStyle = null;
if (!cli.flags.default) {
  try {
    const fs = require('fs');
    const configFile = require(path.resolve(pathToRepository, '.coraline'));

    if (configFile) {
      customStyle = {};
      Object.keys(configFile).forEach(key => {
        customStyle[key] = parseStyleObject(configFile[key]);
      });
    }
  } catch (e) {
    customStyle = null;
  }
}

// show all readmes
const showAllReadmes = styles => {
  Object.keys(styles).forEach(key => {
    if (styles[key].readme) {
      console.log('  | ' + chalk.bold(key));
      console.log(
        boxen(styles[key].readme, {
          padding: 1,
          margin: 1,
          borderStyle: 'double'
        })
      );
    }
  });
};

// header
console.log(`
${chalk.bold(texts.welcome)}`);

// show all available styles
if (cli.flags.list) {
  if (customStyle) {
    console.log(texts.allCustomStyles.replace('%s', chalk.bold('.commit')));
    showAllReadmes(customStyle);
  }

  console.log(texts.includedStyles);
  showAllReadmes(commitStyles);
}

/**
 * Start cli
 * @param {object} flags
 */
const startCommiting = async (flags = {}) => {
  // load local config
  nconf.use('file', { file: path.resolve(__dirname, 'config.json') });
  nconf.load();

  const gitStatusResult = await GitProcess.exec(
    ['status', '--porcelain'],
    pathToRepository
  );

  // if there is no statis error
  if (gitStatusResult.exitCode === 0) {
    // reset config
    if (flags.reset) {
      nconf.reset('config:commitstyle');
    }

    // get config object
    const config = nconf.get('config');

    // no config
    if (!config) {
      console.log('');
      // first configuration
      const configure = [
        {
          type: 'list',
          name: 'commitstyle',
          prefix: '✏️ ',
          message: texts.chooseDefaultStyle,
          choices: Object.keys(commitStyles)
        },
        {
          type: 'confirm',
          name: 'askAgain',
          prefix: '🤔 ',
          message: texts.areYouSure,
          default: true,
          when(answers) {
            if (flags.readme) {
              // show readme
              if (flags.readme) {
                console.log(
                  boxen(commitStyles[answers.commitstyle].readme, {
                    padding: 1,
                    margin: 1,
                    borderStyle: 'double'
                  })
                );
              }
            }
            return true;
          }
        }
      ];

      // configuration loop
      const setConfig = () => {
        inquirer.prompt(configure).then(answers => {
          const { commitstyle } = answers;

          if (!answers.askAgain) {
            setConfig();
          } else {
            if (typeof config === 'undefined' || !config.alreadyLaunched) {
              nconf.set('config:alreadyLaunched', true);
            }
            nconf.set('config:commitstyle', commitstyle);
            nconf.save(function(err) {
              if (err) {
                console.error(err.message);
                return;
              }

              console.log(
                texts.nowUsing.replace('%s', chalk.green(commitstyle))
              );

              startCommiting();
            });
          }
        });
      };

      setConfig();
    } else {
      // parse git status
      const parsedStatus = parseGitStatus(gitStatusResult.stdout);

      // do some things with the output
      if (parsedStatus.length === 0 && !flags.reset) {
        console.log(texts.nothingToDo);
      } else {
        // choose a custom style
        let customStyleAnswers = {};
        if (customStyle) {
          if (Object.keys(customStyle).length > 1) {
            customStyleAnswers = await inquirer.prompt([
              {
                type: 'list',
                name: 'commitstyle',
                prefix: '✏️ ',
                message: texts.chooseDefaultStyle,
                choices: Object.keys(customStyle),
                when(answers) {
                  return answers.comments !== 'Nope, all good!';
                }
              }
            ]);
          } else {
            // pick style, if there is only one given
            customStyleAnswers.commitstyle = Object.keys(customStyle);
          }
        }

        // check if custom or not
        const commitstyle = customStyle
          ? customStyleAnswers.commitstyle
          : config.commitstyle;

        console.log(texts.nowUsing.replace('%s', chalk.green(commitstyle)));

        const { questions, template, readme } = customStyle
          ? customStyle[commitstyle]
          : commitStyles[commitstyle];

        // show readme
        if (flags.readme && readme) {
          console.log(
            boxen(readme, {
              padding: 1,
              margin: 1,
              borderStyle: 'double'
            })
          );
        } else {
          console.log('');
        }

        // ready to commit
        const answers = await inquirer.prompt(questions);

        // add all
        await GitProcess.exec(['add', '--all'], pathToRepository);

        // commit with template
        await GitProcess.exec(
          ['commit', '-m', parseTemplate(template, answers)],
          pathToRepository
        );

        console.log(texts.finished);
      }
    }
  } else {
    const error = gitStatusResult.stderr;
    // error handling
    console.log(chalk.red(texts.notAGitRepo));
  }
};

if (!cli.flags.list && !cli.flags.version) {
  startCommiting(cli.flags);
}
