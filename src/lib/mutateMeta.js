import { OrderedMap } from 'immutable';

import getItemPath from '../lib/getItemPath';
import getItemType from '../lib/getItemType';

export default function mutateMeta({
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
}) {
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
      if (itemValue instanceof OrderedMap) {
        [...itemValue.keys()].forEach((key) => {
          const childPathParts = itemPathParts.concat(key);
          const childPath = getItemPath(childPathParts);
          const childValue = itemValue.get(key);
          mutateMeta({
            r,
            paneType,
            itemPath: childPath,
            itemPathParts: childPathParts,
            itemValue: childValue,
            newItems,
            parentItemPath: itemPath,
            parentItemPathParts: itemPathParts,
            parentItemType: 'object'
          });
        });
      }
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
}
