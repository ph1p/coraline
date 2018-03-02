import atomStyle from './atom';
import karmaStyle from './karma';
import angularStyle from './angular';

import utils from '../utils/index';


const styles = {
  atom: utils.parseStyle(atomStyle),
  karma: utils.parseStyle(karmaStyle),
  angular: utils.parseStyle(angularStyle)
};
export default styles;
