const atomStyle = require('./atom');
const karmaStyle = require('./karma');
const angularStyle = require('./angular');

const utils = require('../utils');

const styles = {
  atom: utils.parseStyle(atomStyle),
  karma: utils.parseStyle(karmaStyle),
  angular: utils.parseStyle(angularStyle)
};

module.exports = styles;
