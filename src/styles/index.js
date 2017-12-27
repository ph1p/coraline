import atom from './atom';
import karma from './karma';

import utils from '../utils/index';

const { parseStyle } = utils;

export default {
  atom: parseStyle(atom),
  karma: parseStyle(karma)
};
