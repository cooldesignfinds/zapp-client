import { OrderedMap } from 'immutable';

import generate from './generate';

import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';

import cleanMeta from '../lib/cleanMeta';
import getItemType from '../lib/getItemType';
import getItemPath from '../lib/getItemPath';
import mutateMeta from '../lib/mutateMeta';

function updateItem({
  paneIndex = 0,
  paneType,
  itemPathParts,
  itemMode,
  itemType,
  itemValue,
  oldItemPathParts
}) {
  return (dispatch, getState) => {
    const state = getState();
    const items = state.project[paneType];
    const meta = state.project.meta;

    const itemKey = itemPathParts.slice(-1)[0];
    const itemPath = getItemPath(itemPathParts);

    const oldItemPath = getItemPath(oldItemPathParts);

    const parentItemPathParts = itemPathParts.slice(0, -1);
    const parentItemPath = getItemPath(parentItemPathParts);

    const parentItem = parentItemPathParts.length
      ? (items.getIn(parentItemPathParts) || OrderedMap())
      : items;
    const parentItemType = getItemType(parentItem);

    const newItems = items
      .withMutations((r1) => {
        // replace item in array
        if (parentItemType === 'array') {
          if (oldItemPathParts && oldItemPath !== itemPath && oldItemPathParts.join(',') !== itemPathParts.join(',')) {
            r1
              .deleteIn(oldItemPathParts)
              .insertIn(itemPathParts, itemValue);
          } else {
            r1
              .setIn(itemPathParts, itemValue);
          }
          return;

        // replace item in object
        } else if (oldItemPathParts && oldItemPath !== itemPath && oldItemPathParts.join(',') !== itemPathParts.join(',')) {
          const oldItemKey = oldItemPathParts.slice(-1)[0];
          const oldParentItemPathParts = oldItemPathParts.slice(0, -1);

          // order does not matter
          if (oldParentItemPathParts.join(',') !== parentItemPathParts.join(',')) {
            r1
              .setIn(itemPathParts, itemValue)
              .deleteIn(oldItemPathParts);
            return;
          }

          // order matters
          const newParentItem = OrderedMap()
            .withMutations((r2) => {
              parentItem.entrySeq().forEach(([key, value]) => {
                if (key === oldItemKey) {
                  r2.set(itemKey, value);
                } else {
                  r2.set(key, value);
                }
              });
            });

          if (parentItemPathParts.length > 0) {
            r1.setIn(parentItemPathParts, newParentItem);
            return;
          }

          r1.clear().merge(newParentItem);

          return;
        }

        // add new item
        r1.setIn(itemPathParts, itemValue);
      });

    const newMeta = paneType === 'code'
      ? meta
      : meta
        .withMutations((r) => {
          mutateMeta({
            r,
            paneType,
            itemMode,
            itemPath,
            itemPathParts,
            itemValue,
            itemType,
            newItems,
            parentItemPath,
            parentItemPathParts,
            parentItemType
          });
        })
        // clean up meta
        .withMutations((r) => {
          cleanMeta({
            r,
            newItems,
            paneType
          });
        });

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
      itemPathParts,
      items: newItemsWithMeta,
      meta: newMeta,
      oldItemPathParts,
      paneIndex,
      paneType
    });
    dispatch(generate());
  };
}

export default updateItem;
