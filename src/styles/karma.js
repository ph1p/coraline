import chalk from 'chalk';

export default {
  questions: [
    {
      prefix: '-',
      type: 'list',
      name: 'type',
      message: 'Type:',
      choices: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
    },
    {
      prefix: '-',
      type: 'input',
      name: 'scope',
      message: 'Scope:',
      validate(value) {
        return value !== '';
      }
    },
    {
      prefix: '-',
      type: 'input',
      name: 'subject',
      message: 'Subject:',
      validate(value) {
        return value !== '';
      }
    },
    {
      prefix: '-',
      type: 'input',
      name: 'body',
      message: 'Body:'
    },
    {
      prefix: '-',
      type: 'input',
      name: 'footer',
      message: 'Footer:'
    }
  ],
  template: `<type>(<scope>): <subject>

<body>

<footer>`,
  readme: `${chalk.bold(chalk.underline('Type:'))}
- feat (new feature for the user, not a new feature for build script)
- fix (bug fix for the user, not a fix to a build script)
- docs (changes to the documentation)
- style (formatting, missing semi colons, etc; no production code change)
- refactor (refactoring production code, eg. renaming a variable)
- test (adding missing tests, refactoring tests; no production code change)
- chore (updating grunt tasks etc; no production code change)

${chalk.bold(chalk.underline('Scope (examples):'))}
- init
- runner
- watcher
- config
- web-server
- proxy
- etc.

${chalk.bold(chalk.underline('Subject:'))}
The first line cannot be longer than 70 characters, the second line
is always blank and other lines should be wrapped at 80 characters.
The type and scope should always be lowercase as shown below.

Body:
- uses the imperative, present tense: “change” not “changed” nor “changes”
- includes motivation for the change and contrasts with previous behavior

${chalk.bold(chalk.underline('Footer:'))}
Referencing issues
Closed issues should be listed on a separate line
in the footer prefixed with "Closes" keyword like this:

Closes #234
or in the case of multiple issues:

Closes #123, #245, #992

`
};
