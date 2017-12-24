module.exports = {
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
  template: `<type><scope>: <description>

    <body>

    <footer>`
};
