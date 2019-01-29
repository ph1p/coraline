const chalk = require('chalk');

module.exports = {
  questions: [
    {
      prefix: '-',
      type: 'list',
      name: 'type',
      message: 'Type:',
      choices: [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore'
      ]
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
      type: 'editor',
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
  readme: `${chalk.bold(chalk.underline('Revert'))}
If the commit reverts a previous commit, it should begin with revert:, followed by the header of the reverted commit.
In the body it should say: This reverts commit <hash>., where the hash is the SHA of the commit being reverted.
A commit with this format is automatically created by the git revert command.

${chalk.bold(chalk.underline('Type'))}
Must be one of the following:

feat: A new feature
fix: A bug fix
docs: Documentation only changes
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
refactor: A code change that neither fixes a bug nor adds a feature
perf: A code change that improves performance
test: Adding missing or correcting existing tests
chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

${chalk.bold(chalk.underline('Scope'))}
The scope could be anything specifying place of the commit change.
For example $location, $browser, $compile, $rootScope, ngHref, ngClick, ngView, etc...

You can use * when the change affects more than a single scope.

${chalk.bold(chalk.underline('Subject'))}
The subject contains succinct description of the change:

use the imperative, present tense: "change" not "changed" nor "changes"
don't capitalize first letter
no dot (.) at the end

${chalk.bold(chalk.underline('Body'))}
Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

${chalk.bold(chalk.underline('Footer'))}
The footer should contain any information about Breaking Changes and is also the
place to reference GitHub issues that this commit closes.
(https://help.github.com/articles/closing-issues-using-keywords/)
Breaking Changes should start with the word BREAKING CHANGE: with a space or two newlines.
The rest of the commit message is then used for this.
A detailed explanation can be found in this document.
(https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)`
};
