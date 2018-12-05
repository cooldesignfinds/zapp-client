import { OrderedMap } from 'immutable';

import generate from './generate';
import loadImports from './loadImports';

import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';

import getItemType from '../lib/getItemType';
import getItemPath from '../lib/getItemPath';

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
          const newItemType = itemType || (
            r.hasIn([paneType, itemPath, 'type'])
              ? r.getIn([paneType, itemPath, 'type'])
              : getItemType(itemValue)
          );
          if (!r.has(paneType)) {
            r.set(paneType, OrderedMap());
          }
          if (['code', 'link', 'object'].includes(newItemType)) {
            if (!r.hasIn([paneType, itemPath])) {
              r.setIn([paneType, itemPath], OrderedMap());
            }
            if (newItemType === 'code') {
              const newItemMode = itemMode || (
                r.hasIn([paneType, itemPath, 'mode'])
                  ? r.getIn([paneType, itemPath, 'mode'])
                  : itemValue.mode
              );
              r.setIn([paneType, itemPath, 'type'], 'code');
              r.setIn([paneType, itemPath, 'mode'], newItemMode);
            } else if (newItemType === 'link') {
              r.setIn([paneType, itemPath, 'type'], 'link');
            } else if (newItemType === 'object') {
              r.setIn([paneType, itemPath, 'keys'], []);
            }
          } else if (r.hasIn([paneType, itemPath])) {
            r.deleteIn([paneType, itemPath]);
          }
          if (!r.hasIn([paneType, parentItemPath])) {
            r.setIn([paneType, parentItemPath], OrderedMap());
          }
          if (parentItemType === 'object') {
            r.setIn([paneType, parentItemPath, 'keys'], [...newItems.getIn(parentItemPathParts).keys()]);
          }
        });
        // clean up meta
        // .withMutations((r) => {
        //   if (r.has('specs')) {
        //     const specs = r.get('specs');
        //     [...specs.keys()].forEach((specItemPath) => {
        //       const specItemPathParts = getItemPathParts(specItemPath);
        //       const spec = newItems.getIn(specItemPathParts);
        //       const specItemType = specs.hasIn([specItemPath, 'type'])
        //         ? specs.getIn([specItemPath, 'type'])
        //         : getItemType(spec);
        //       if (!['code', 'link', 'object'].includes(specItemType)) {
        //         r.deleteIn([paneType, specItemPath]);
        //       }
        //     });
        //   }
        // });

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
    if (paneType === 'imports') {
      dispatch(loadImports(newItems));
    } else if (paneType !== 'code') {
      dispatch(generate());
    }
  };
}

export default updateItem;
