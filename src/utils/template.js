import chalk from 'chalk';

/**
 * Parse commit template
 * @param {string} template
 * @param {object} data
 */
export function parseTemplate(template, data) {
  return template
    .replace(/<(.*?)>/g, (found, key) => {
      return data[key] ? data[key] : '';
    })
    .trim();
};

/**
 * Parse style object and throw error
 * @param {object} style
 */
export function parseStyle(style) {
  if (style.template && style.questions && style.questions.length) {
    style.readme = `${chalk.bold(chalk.underline('Format:'))}
${style.template}
${style.readme || ''}`.trim();

    return style;
  } else {
    throw new Error(`${chalk.red('Wrong commit style schema')}`);
  }
};
