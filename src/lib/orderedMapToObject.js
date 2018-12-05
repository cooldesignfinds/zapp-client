import { List, Map, OrderedMap } from 'immutable';

import isCodeItem from './isCodeItem';
import isLinkItem from './isLinkItem';

export default function orderedMapToObject(map) {
  if (map === undefined) {
    return {};
  }
  if (map instanceof List) {
    const array = [];
    map.forEach((value) => {
      if (isCodeItem(value) || isLinkItem(value)) {
        array.push(value.value);
      } else if (value instanceof List || value instanceof OrderedMap || value instanceof Map) {
        array.push(orderedMapToObject(value));
      } else {
        array.push(value);
      }
    });
    return array;
  }

  const object = {};
  [...map.keys()].forEach((key) => {
    const value = map.get(key);
    if (isCodeItem(value) || isLinkItem(value)) {
      object[key] = value.value;
    } else if (value instanceof List || value instanceof OrderedMap || value instanceof Map) {
      object[key] = orderedMapToObject(value);
    } else {
      object[key] = value;
    }
  });
  return object;
}
