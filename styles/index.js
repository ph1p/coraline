const atom = require('./atom');
const karma = require('./karma');
const { parseStyleObject } = require('../utils');

module.exports = {
  atom: parseStyleObject(atom),
  karma: parseStyleObject(karma)
};
