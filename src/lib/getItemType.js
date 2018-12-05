import { List } from 'immutable';

import isCodeItem from './isCodeItem';
import isLinkItem from './isLinkItem';

export default function getItemType(item) {
  if (isCodeItem(item)) {
    return 'code';
  }
  if (isLinkItem(item)) {
    return 'link';
  }
  if (item instanceof List) {
    return 'array';
  }
  if (item === null) {
    return 'null';
  }
  return typeof item;
}
