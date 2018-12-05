import { List, OrderedMap } from 'immutable';

import getItemPath from '../lib/getItemPath';
import getItemType from '../lib/getItemType';
import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';

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
    const srcItemParentPath = srcItemPathParts.slice(0, -1);
    const srcItemParentId = getItemPath(srcItemParentPath);
    const srcItemParent = srcItemParentPath.length ? items.getIn(srcItemParentPath) : items;
    const srcItemParentType = getItemType(srcItemParent);
    const value = items.getIn(srcItemPathParts);

    const targetItemKey = targetItemPathParts.slice(-1)[0];
    const targetItemParentPath = targetItemPathParts.slice(0, -1);
    const targetItemParentId = getItemPath(targetItemParentPath);
    const targetItemParent = targetItemParentPath.length
      ? items.getIn(targetItemParentPath) : items;
    const targetItemParentType = getItemType(targetItemParent);

    let newItems = items;

    let newParentItem;
    // same parent
    if (srcItemParentId === targetItemParentId) {
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
      newItems = srcItemParentPath.length
        ? items.setIn(srcItemParentPath, newParentItem)
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
      newItems = targetItemParentPath.length
        ? items.setIn(targetItemParentPath, newParentItem)
        : newParentItem;
      newItems = newItems.deleteIn(srcItemPathParts);
    }

    let newMeta = meta;
    if (targetItemParentType === 'object') {
      if (!newMeta.has(paneType)) {
        newMeta = newMeta.set(paneType, OrderedMap());
      }
      if (!newMeta.hasIn([paneType, targetItemParentId])) {
        newMeta = newMeta.setIn([paneType, targetItemParentId], OrderedMap());
      }
      newMeta = newMeta.setIn([paneType, targetItemParentId, 'keys'], [...newItems.getIn(targetItemParentPath).keys()]);
      if (paneType === 'meta') {
        newItems = newMeta;
      }
    }

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
