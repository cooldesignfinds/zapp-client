import _ from 'lodash';
import axios from 'axios';
import { OrderedMap } from 'immutable';

import action from '../lib/action';
import getItemPathParts from '../lib/getItemPathParts';
import objectToOrderedMap from '../lib/objectToOrderedMap';

async function listFiles({
  dispatch,
  state
}) {
  const { items } = (
    await axios({
      method: 'post',
      url: 'http://localhost:12345/listFiles',
      data: {
        cwd: state.project.cwd
      }
    })
  ).data;

  let codeItems = {};
  let codeMeta = OrderedMap();

  items.forEach((item) => {
    codeItems = _.set(codeItems, getItemPathParts(item.name), item.type === 'dir' ? {} : '');
    if (item.type === 'dir') {
      codeMeta = codeMeta.set(item.name, objectToOrderedMap({
        isEmpty: item.isEmpty
      }));
    }
  });

  const code = objectToOrderedMap(codeItems, codeMeta, [], true);

  dispatch({
    type: 'LIST_FILES_RES',
    code
  });

  return items;
}

export default action(listFiles);
