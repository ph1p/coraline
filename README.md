## coraline

This small cli makes it easier to handle conventional git commit messages.

## Install

`npm i coraline -g`

## How to use?

Just type `cl` in your terminal and follow the first configuration.

For help, just type `cli --help`

```
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
    --version, -v Version info
```

## .coraline.js

Define a custom commit style for every repository with a simple
dotfile called `.coraline.js`

**questions** and **template** properties are not optional.
**questions** is an easy configurable array of inquirer objects. (https://www.npmjs.com/package/inquirer)

With **template** you define the commit message format.
For example: `<title>` will be replaced with the value of `name: 'title'`.


```
module.exports = {
    custom: {
        questions: [{
            type: 'input',
            name: 'title',
            message: 'Title',
            validate(title) {
                return title.length > 0;
            }
        }, {
            type: 'input',
            name: 'message',
            message: 'Message'
        }],
        template: `<title>: <message>`,
        readme: ``
    },
    custom2: {
        questions: [{
            type: 'input',
            name: 'title',
            message: 'Title'
        }],
        template: `<title>`,
        readme: ``
    }
}
```