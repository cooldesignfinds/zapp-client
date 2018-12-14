import { List, OrderedMap } from 'immutable';

import getItemPath from '../lib/getItemPath';
import getItemType from '../lib/getItemType';
import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';
import mutateMeta from '../lib/mutateMeta';

function moveItem({
  paneType,
  srcItemPathParts,
  targetItemPathParts,
  direction
}) {
  return (dispatch, getState) => {
    const state = getState();
    const items = state.project[paneType];
    const meta = state.project.meta;

    const srcItemKey = srcItemPathParts.slice(-1)[0];
    const srcItemParentPathParts = srcItemPathParts.slice(0, -1);
    const srcItemParentPath = getItemPath(srcItemParentPathParts);
    const srcItemParent = srcItemParentPathParts.length ? items.getIn(srcItemParentPathParts) : items;
    const srcItemParentType = getItemType(srcItemParent);
    const value = items.getIn(srcItemPathParts);
    const srcItemType = getItemType(value);

    const targetItemKey = targetItemPathParts.slice(-1)[0];
    const targetItemParentPathParts = targetItemPathParts.slice(0, -1);
    const targetItemParentPath = getItemPath(targetItemParentPathParts);
    const targetItemParent = targetItemParentPathParts.length
      ? items.getIn(targetItemParentPathParts) : items;
    const targetItemParentType = getItemType(targetItemParent);

    let newItems = items;

    let newParentItem;
    // same parent
    if (srcItemParentPath === targetItemParentPath) {
      if (srcItemParentType === 'array') {
        newParentItem = List();
        srcItemParent.forEach((element) => {
          newParentItem = newParentItem.push(element);
        });
        newParentItem = newParentItem.delete(srcItemKey);
        newParentItem = newParentItem.insert(direction === 'above' ? targetItemKey : targetItemKey + 1, value);
      } else {
        newParentItem = OrderedMap();
        const srcItemParentKeys = [...srcItemParent.keys()];
        srcItemParentKeys.splice(srcItemParentKeys.indexOf(srcItemKey), 1);
        srcItemParentKeys.splice(direction === 'above' ? srcItemParentKeys.indexOf(targetItemKey) : srcItemParentKeys.indexOf(targetItemKey) + 1, 0, srcItemKey);
        srcItemParentKeys.forEach((siblingKey) => {
          const siblingValue = srcItemParent.get(siblingKey);
          newParentItem = newParentItem.set(siblingKey, siblingValue);
        });
        newParentItem = newParentItem.set(srcItemKey, value);
      }
      newItems = srcItemParentPathParts.length
        ? items.setIn(srcItemParentPathParts, newParentItem)
        : newParentItem;

    // different parent
    } else {
      if (targetItemParentType === 'array') {
        // newParentItem = List();
        // srcItemParent.forEach((element) => {
        //   newParentItem = newParentItem.push(element);
        // });
        // newParentItem = newParentItem.delete(srcItemParent.indexOf(srcItemKey));
        // newParentItem = newParentItem.insert(direction === 'above' ? srcItemParent.indexOf(targetItemKey) : srcItemParent.indexOf(targetItemKey) + 1, value);
      } else {
        newParentItem = OrderedMap();
        const targetItemParentKeys = [...targetItemParent.keys()];
        targetItemParentKeys.splice(direction === 'above' ? targetItemParentKeys.indexOf(targetItemKey) : targetItemParentKeys.indexOf(targetItemKey) + 1, 0, srcItemKey);
        targetItemParentKeys.forEach((siblingKey) => {
          const siblingValue = targetItemParent.get(siblingKey);
          newParentItem = newParentItem.set(siblingKey, siblingValue);
        });
        newParentItem = newParentItem.set(srcItemKey, value);
      }
      newItems = targetItemParentPathParts.length
        ? items.setIn(targetItemParentPathParts, newParentItem)
        : newParentItem;
      newItems = newItems.deleteIn(srcItemPathParts);
    }

    const newMeta = meta
      .withMutations((r) => {
        const srcItemMetaPathParts = [paneType, getItemPath(srcItemPathParts)];
        if (r.hasIn(srcItemMetaPathParts)) {
          r.setIn([paneType, getItemPath(targetItemParentPathParts.concat(srcItemKey))], r.getIn(srcItemMetaPathParts));
          r.deleteIn(srcItemMetaPathParts);
        }

        if (srcItemType === 'object') {
          [...value.keys()].forEach((key) => {
            const currentPathParts = targetItemParentPathParts.concat(srcItemKey).concat(key);
            const currentPath = getItemPath(currentPathParts);
            const currentValue = value.get(key);
            mutateMeta({
              r,
              paneType,
              itemPath: currentPath,
              itemPathParts: currentPathParts,
              itemValue: currentValue,
              newItems,
              parentItemPath: getItemPath(targetItemParentPathParts.concat(srcItemKey)),
              parentItemPathParts: targetItemParentPathParts.concat(srcItemKey),
              parentItemType: 'object'
            });
          });
        }

        if (targetItemParentType === 'object') {
          if (!r.has(paneType)) {
            r.set(paneType, OrderedMap());
          }
          if (!r.hasIn([paneType, targetItemParentPath])) {
            r.setIn([paneType, targetItemParentPath], OrderedMap());
          }
          r.setIn([paneType, targetItemParentPath, 'keys'], [...newItems.getIn(targetItemParentPathParts).keys()]);
          if (paneType === 'meta') {
            newItems = r;
          }
        }
      });

    newItems = objectToOrderedMap(orderedMapToObject(newItems), newMeta.get(paneType));

    dispatch({
      type: 'UPDATE_ITEMS_RES',
      items: newItems,
      meta: newMeta,
      paneType
    });
  };
}

export default moveItem;
