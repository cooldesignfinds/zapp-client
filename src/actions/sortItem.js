import { OrderedMap } from 'immutable';

import generate from './generate';
import loadImports from './loadImports';

import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';

import getItemType from '../lib/getItemType';
import getItemPath from '../lib/getItemPath';

function sortItem({
  paneIndex = 0,
  paneType,
  itemPathParts
}) {
  return (dispatch, getState) => {
    const state = getState();
    const items = state.project[paneType];
    const meta = state.project.meta;

    const itemPath = getItemPath(itemPathParts);
    const itemValue = items.getIn(itemPathParts);
    const itemType = getItemType(itemValue);

    const newMeta = meta
      .withMutations((r) => {
        if (itemType === 'object') {
          const sortedKeys = [...items.getIn(itemPathParts).keys()]
            .sort((a, b) => {
              if (a < b) {
                return -1;
              } else if (a > b) {
                return 1;
              }
              return 0;
            });
          r.setIn([paneType, itemPath, 'keys'], sortedKeys);
        }
      });

    const newItemsWithMeta = objectToOrderedMap(
      orderedMapToObject(items),
      newMeta.get(paneType)
    );

    dispatch({
      type: 'UPDATE_ITEMS_RES',
      itemPathParts,
      items: newItemsWithMeta,
      meta: newMeta,
      paneIndex,
      paneType
    });
    if (paneType === 'imports') {
      dispatch(loadImports(items));
    } else {
      dispatch(generate());
    }
  };
}

export default sortItem;
