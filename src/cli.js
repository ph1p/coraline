import 'regenerator-runtime/runtime';
import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import meow from 'meow';
import nconf from 'nconf';
import boxen from 'boxen';
import { exec } from 'child-process-promise';

const pkg = require('../package.json');

import commitStyles from './styles/index';
import utils from './utils/index';

// get current path
const pathToRepository = process.cwd();

// All cli texts
const texts = {
  welcome: `  | Coraline v${pkg.version}`,
  chooseDefaultStyle: 'Choose your default commit style:',
  areYouSure: 'Are you sure (just hit enter for YES)?',
  nowUsing: '  | Now you are using %s',
  setupText: `  | Hi I'm coraline. A small cli that helps you to follow commit conventions strict and easily!
  | Please setup your favorite commit style or write your own :)
  `,
  readyToStart: `  | Now we're ready to start! Type ${chalk.bold(
    'cl'
  )} or ${chalk.bold('coraline')} to call me.
  `,
  commitStyleNotExists: `
  💥 Sorry, but this commit style does not exist.
  `,
  notAGitRepo: `
  Sorry, but "${chalk.bold(pathToRepository)}" isn't a git repository
  `,
  nothingToDo: chalk.green(`
  nothing to commit.
`),
  finished: chalk.green(`
  all done.
`),
  notCommitted: chalk.green(`
  You're changes has not been committed
  `),
  doYouWantCommit: 'Do you want to commit these changes?',
  allCustomStyles: `
  | Custom styles from %s file`,
  includedStyles: `
  | Included styles`
};

// CLI args
const cli = meow({
  help: `
    Usage
      $ cl --reset
      $ cl --default
      $ cl --readme
      $ cl --list
      $ cl --use

    Options
      --help
      --reset, -r  Reset configuration
      --default, -d  Use your default style (Only relevant if you use a .coraline file)
      --readme {name}, -m {name}  Shows the readme of current or inputed commit style
      --list, -l List  all available styles
      --version, -v  Version info
      --use, -u  Use a specific style temporarily (e. g. cl -u karma`,
  autoVersion: true,
  autoHelp: true,
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
      type: 'string',
      alias: 'm'
    },
    list: {
      type: 'boolean',
      alias: 'l'
    },
    version: {
      type: 'boolean',
      alias: 'v'
    },
    use: {
      type: 'string',
      alias: 'u'
    }
  }
});

// show all readmes
const listAllStyles = (styles, withReadme = false) => {
  Object.keys(styles).forEach(key => {
    console.log('  | ' + chalk.bold(key));
    if (withReadme && styles[key].readme) {
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

/**
 * Start cli
 * @param {object} flags
 */
const startCommiting = async (flags = {}) => {
  let stopCommitWorkflow = false;

  // load local config
  nconf.use('file', {
    file: path.resolve(__dirname, '../config.json')
  });
  nconf.load();

  // get config object
  const config = nconf.get('config');

  // add custom code styles
  let customStyle = null;

  // load .coraline file
  if (!flags.reset && !cli.flags.default) {
    try {
      const configFile = require(path.resolve(pathToRepository, '.coraline'));

      if (configFile) {
        customStyle = {};
        Object.keys(configFile).forEach(key => {
          customStyle[key] = utils.parseStyle(configFile[key]);
        });
      }
    } catch (e) {
      customStyle = null;
    }
  }

  if (config) {
    // reset config
    if (flags.reset) {
      nconf.reset('config');
      nconf.save(() => startCommiting());
      return;
    }

    // show readme of current commit style or pass input
    if (typeof flags.readme !== 'undefined') {
      let cliInput = flags.readme || false;

      const inputStyle = cliInput
        ? commitStyles[flags.readme] || customStyle[flags.readme]
        : '';

      let commitStyle = config.commitstyle;
      let currentStyle = commitStyles[commitStyle];

      // check input
      if (inputStyle) {
        currentStyle = inputStyle;
        commitStyle = cliInput;
      } else if (inputStyle !== '') {
        console.log(chalk.red(texts.commitStyleNotExists));
        return;
      }

      if (currentStyle.readme) {
        console.log('  | ' + chalk.bold(commitStyle));
        console.log(
          boxen(currentStyle.readme, {
            padding: 1,
            margin: 1,
            borderStyle: 'double'
          })
        );
      }

      stopCommitWorkflow = true;
    }
  }

  // show all available styles
  if (flags.list) {
    if (customStyle) {
      console.log(texts.allCustomStyles, chalk.bold('.coraline'));
      listAllStyles(customStyle);
    }

    console.log(texts.includedStyles);
    listAllStyles(commitStyles);
    console.log('');
    stopCommitWorkflow = true;
  }

  if (!stopCommitWorkflow) {
    try {
      const gitStatusResult = await exec('git status --porcelain');

      // no config
      if (!config || !config.commitstyle) {
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
              // show readme
              if (commitStyles[answers.commitstyle].readme) {
                console.log(
                  boxen(commitStyles[answers.commitstyle].readme, {
                    padding: 1,
                    margin: 1,
                    borderStyle: 'double'
                  })
                );
              }
              return true;
            }
          }
        ];

        // configuration loop
        const setConfig = (showWelcomeText = true) => {
          if (showWelcomeText) {
            console.log(texts.setupText);
          }

          inquirer.prompt(configure).then(answers => {
            const { commitstyle } = answers;

            if (!answers.askAgain) {
              setConfig(false);
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

                console.log(texts.readyToStart);
              });
            }
          });
        };

        setConfig();
      } else {
        // overwrite style temporarily
        let useCustomStyle = false;
        if (flags.use && flags.use !== '') {
          if (Object.keys(commitStyles).some(key => key === flags.use)) {
            config.commitstyle = flags.use;
          } else if (Object.keys(customStyle).some(key => key === flags.use)) {
            useCustomStyle = true;
            config.commitstyle = flags.use;
          } else {
            console.log(chalk.red(texts.commitStyleNotExists));
            return;
          }
        }

        // parse git status
        const parsedStatus = utils.parseGitStatus(gitStatusResult.stdout);

        // do some things with the output
        if (parsedStatus.length === 0) {
          console.log(texts.nothingToDo);
        } else {
          let customStyleAnswers = {};

          // choose a custom style
          if (customStyle && !useCustomStyle && !flags.use) {
            useCustomStyle = true;

            if (Object.keys(customStyle).length > 1) {
              console.log('');
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

              config.commitstyle = customStyleAnswers.commitstyle;
            } else {
              // pick style, if there is only one given
              config.commitstyle = Object.keys(customStyle);
            }
          }

          // check if custom or not
          const commitstyle = config.commitstyle;

          console.log(texts.nowUsing.replace('%s', chalk.green(commitstyle)));

          const { questions, template, readme } = useCustomStyle
            ? customStyle[commitstyle]
            : commitStyles[commitstyle];

          // git status
          const status = utils.parseGitStatus(gitStatusResult.stdout);

          const setColor = status => {
            const modifierColor = {
              unmodified: 'grey',
              untracked: 'magenta',
              ignored: 'grey',
              modified: 'blue',
              added: 'green',
              deleted: 'red',
              renamed: false,
              copied: 'yellow',
              umerge: false
            }[status];

            return modifierColor ? chalk[modifierColor](status) : status;
          };

          console.log('  ---------');
          status.forEach(({ statusFrom, statusTo, to, from }) => {
            if (statusFrom === statusTo) {
              console.log(
                `  | ${setColor(statusTo)} ${from || ''} ${to || ''}`
              );
            } else {
              console.log(
                `  | ${setColor(statusFrom)} -> ${setColor(statusTo)} ${from ||
                  ''} ${to || ''}`
              );
            }
          });
          console.log('');

          // ready to commit
          questions.push({
            type: 'confirm',
            prefix: '🤔 ',
            name: 'confirmStatus',
            default: true,
            message: texts.doYouWantCommit
          });

          const answers = await inquirer
            .prompt(questions)
            .then(async answers => {
              if (answers.confirmStatus) {
                // add all
                await exec('git add --all');

                // commit with template
                await exec(
                  `git commit -m "${utils.parseTemplate(template, answers)}"`
                );

                console.log(texts.finished);
              } else {
                console.log(texts.notCommitted);
              }
            });
        }
      }
    } catch (e) {
      console.log(e);
      //show message, if this is not a git repo
      console.log(chalk.red(texts.notAGitRepo));
    }
  }
};

if (!cli.flags.version) {
  startCommiting(cli.flags);
}
