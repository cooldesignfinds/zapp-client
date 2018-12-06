import { OrderedMap } from 'immutable';

import getItemPathParts from '../lib/getItemPathParts';
import getItemType from '../lib/getItemType';
import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';

function deleteItem({
  paneType,
  itemPathParts
}) {
  return (dispatch, getState) => {
    const state = getState();
    const items = state.project[paneType];
    const meta = state.project.meta;

    const parentPathParts = itemPathParts.slice(0, -1);
    const parentPath = `/${parentPathParts.join('/')}`;
    const parentItem = items.getIn(parentPathParts);
    const parentItemType = getItemType(parentItem);

    // update item
    const newItems = items.deleteIn(itemPathParts);

    // re-sort parent map
    let newMeta = meta;
    if (paneType !== 'code') {
      if (parentItemType !== 'array') {
        if (!newMeta.has(paneType)) {
          newMeta = newMeta.set(paneType, OrderedMap());
        }
        if (!newMeta.hasIn([paneType, parentPath])) {
          newMeta = newMeta.setIn([paneType, parentPath], OrderedMap());
        }
        newMeta = newMeta.setIn([paneType, parentPath, 'keys'], [...newItems.getIn(parentPathParts).keys()]);
      }

      // delete old item meta
      [...newMeta.get(paneType).keys()].forEach((itemPath) => {
        const metaItemPathParts = getItemPathParts(itemPath);
        if (!newItems.hasIn(metaItemPathParts)) {
          newMeta = newMeta.deleteIn([paneType].concat([itemPath]));
        }
      });
    }

    const newItemsWithMeta = paneType === 'code'
      ? objectToOrderedMap(
        orderedMapToObject(newItems),
        OrderedMap(),
        [],
        true
      ) : objectToOrderedMap(
        orderedMapToObject(newItems),
        newMeta.get(paneType)
      );

    dispatch({
      type: 'UPDATE_ITEMS_RES',
      items: newItemsWithMeta,
      meta: newMeta,
      paneType
    });
  };
}

export default deleteItem;
