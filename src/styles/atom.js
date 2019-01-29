const chalk = require('chalk');

module.exports = {
  questions: [
    {
      prefix: '-',
      type: 'checkbox',
      name: 'type',
      message: 'Type:',
      filter(type) {
        return type.map(icon => icon).join('');
      },
      validate(type) {
        return type.length > 0;
      },
      choices: [
        {
          name: `🎨  ${chalk.dim(
            '(when improving the format/structure of the code)'
          )}`,
          value: ':art:'
        },
        {
          name: `🐎  ${chalk.dim('(when improving performance)')}`,
          value: ':racehorse:'
        },
        {
          name: `🚱  ${chalk.dim('(when plugging memory leaks)')}`,
          value: ':non-potable_water:'
        },
        {
          name: `📝  ${chalk.dim('(when writing docs)')}`,
          value: ':memo:'
        },
        {
          name: `🐧  ${chalk.dim('(when fixing something on Linux)')}`,
          value: ':penguin:'
        },
        {
          name: `🍎  ${chalk.dim('(when fixing something on macOS)')}`,
          value: ':apple:'
        },
        {
          name: `🏁  ${chalk.dim('(when fixing something on Windows)')}`,
          value: ':checkered_flag:'
        },
        {
          name: `🐛  ${chalk.dim('(when fixing a bug)')}`,
          value: ':bug:'
        },
        {
          name: `🔥  ${chalk.dim('(when removing code or files)')}`,
          value: ':fire:'
        },
        {
          name: `💚  ${chalk.dim('(when fixing the CI build)')}`,
          value: ':green_heart:'
        },
        {
          name: `✅  ${chalk.dim('(when adding tests)')}`,
          value: ':white_check_mark:'
        },
        {
          name: `🔒  ${chalk.dim('(when dealing with security)')}`,
          value: ':lock:'
        },
        {
          name: `⬆️ ️ ${chalk.dim('(when upgrading dependencies)')}`,
          value: ':arrow_up:'
        },
        {
          name: `⬇️ ️ ${chalk.dim('(when downgrading dependencies)')}`,
          value: ':arrow_down:'
        },
        {
          name: `'👕 ${chalk.dim('(when removing linter warnings)')}`,
          value: ':shirt:'
        }
      ]
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
      name: 'issues',
      message: 'Issues:'
    }
  ],
  template: `<type>: <subject>

<issues>`,
  readme: `
${chalk.bold(chalk.underline('Atom:'))}
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to ${chalk.bold('72')} characters or less
- Reference issues and pull requests liberally after the first line
- When only changing documentation, include [ci skip] in the commit description

${chalk.bold(
    chalk.underline(
      'Consider starting the commit message with an applicable emoji:'
    )
  )}
- 🎨  ${chalk.bold(':art:')} ${chalk.dim(
    'when improving the format/structure of the code'
  )}
- 🐎  ${chalk.bold(':racehorse:')} ${chalk.dim('when improving performance')}
- 🚱  ${chalk.bold(':non-potable_water:')} ${chalk.dim(
    'when plugging memory leaks'
  )}
- 📝  ${chalk.bold(':memo:')} ${chalk.dim('when writing docs')}
- 🐧  ${chalk.bold(':penguin:')} ${chalk.dim('when fixing something on Linux')}
- 🍎  ${chalk.bold(':apple:')} ${chalk.dim('when fixing something on macOS')}
- 🏁  ${chalk.bold(':checkered_flag:')} ${chalk.dim(
    'when fixing something on Windows'
  )}
- 🐛  ${chalk.bold(':bug:')} ${chalk.dim('when fixing a bug')}
- 🔥  ${chalk.bold(':fire:')} ${chalk.dim('when removing code or files')}
- 💚  ${chalk.bold(':green_heart:')} ${chalk.dim('when fixing the CI build')}
- ✅  ${chalk.bold(':white_check_mark:')} ${chalk.dim('when adding tests')}
- 🔒  ${chalk.bold(':lock:')} ${chalk.dim('when dealing with security')}
- ⬆️  ${chalk.bold(':arrow_up:')} ${chalk.dim('when upgrading dependencies')}
- ⬇️  ${chalk.bold(':arrow_down:')} ${chalk.dim(
    'when downgrading dependencies'
  )}
- 👕  ${chalk.bold(':shirt:')} ${chalk.dim('when removing linter warnings')}

`
};
