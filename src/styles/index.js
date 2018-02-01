import atom from './atom';
import karma from './karma';
import angular from './angular';

import utils from '../utils/index';

const { parseStyle } = utils;

export default {
  atom: parseStyle(atom),
  karma: parseStyle(karma),
  angular: parseStyle(angular)
};
