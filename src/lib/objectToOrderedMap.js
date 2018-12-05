import { List, OrderedMap } from 'immutable';

import CodeItem from './CodeItem';
import LinkItem from './LinkItem';
import getItemPath from './getItemPath';

function sortObject(object) {
  return (a, b) => {
    let result = 0;

    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    if (
      (typeof object[a] === 'object' && typeof object[b] === 'object')
      ||
      (typeof object[a] !== 'object' && typeof object[b] !== 'object')
    ) {
      if (aLower < bLower) {
        result = -1;
      }
      if (aLower > bLower) {
        result = 1;
      }
    }
    if (typeof object[a] === 'object' && typeof object[b] !== 'object') {
      result = -1;
    }
    if (typeof object[a] !== 'object' && typeof object[b] === 'object') {
      result = 1;
    }

    return result;
  };
}

export default function objectToOrderedMap(object, objectConfigs = OrderedMap(), parentPathParts = [], sorted = false) {
  if (object === undefined) {
    return OrderedMap();
  }
  if (Array.isArray(object)) {
    let list = List();
    object.forEach((value, index) => {
      if (typeof value === 'object' && value !== null && !(value instanceof OrderedMap)) {
        list = list.push(objectToOrderedMap(value, objectConfigs, parentPathParts.concat([index]), sorted));
      } else {
        list = list.push(value);
      }
    });
    return list;
  }

  const parentPath = getItemPath(parentPathParts);
  const keys = objectConfigs.hasIn([parentPath, 'keys'])
    ? objectConfigs.getIn([parentPath, 'keys'])
    : [];

  let map = OrderedMap();
  Object.keys(object)
    .sort(sorted ? sortObject(object) : (a, b) => {
      const aIndex = keys.indexOf(a);
      const bIndex = keys.indexOf(b);
      if (aIndex < bIndex) {
        return -1;
      }
      if (aIndex > bIndex) {
        return 1;
      }
      return 0;
    })
    .forEach((key) => {
      const value = object[key];
      const mode = objectConfigs.getIn([getItemPath(parentPathParts.concat(key)), 'mode']);
      const type = objectConfigs.getIn([getItemPath(parentPathParts.concat(key)), 'type']);
      if (type === 'code') {
        const item = new CodeItem();
        item.setMode(mode);
        item.setValue(value);
        map = map.set(key, item);
      } else if (type === 'link') {
        const item = new LinkItem();
        item.setValue(value);
        map = map.set(key, item);
      } else if (typeof value === 'object' && value !== null && !(value instanceof OrderedMap)) {
        map = map.set(key, objectToOrderedMap(value, objectConfigs, parentPathParts.concat([key]), sorted));
      } else {
        map = map.set(key, value);
      }
    });
  return map;
}
