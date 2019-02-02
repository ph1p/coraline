// All cli texts
module.exports = ({ version, pathToRepository, chalk }) => ({
  welcome: `  | Coraline v${version}`,
  chooseFilesToCommit: `Files you want to commit:`,
  noFilesSelected: `Please select at least one file`,
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
});
