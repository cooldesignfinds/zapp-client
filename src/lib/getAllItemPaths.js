import arraySort from './arraySort';
import getItemType from './getItemType';

function getAllItemPathsInternal(items, parentPath = '/', filterItemType = 'object') {
  const itemKeys = [...items.keys()];
  return itemKeys.reduce((accum, itemPathParts) => {
    const item = items.get(itemPathParts);
    const itemType = getItemType(item);
    if (itemType === 'string' && filterItemType === 'string') {
      return accum.concat(`${parentPath}${itemPathParts}`);
    } else if (itemType === 'code') {
      return accum
        .concat(filterItemType === 'object' ? `${parentPath}${itemPathParts}` : []);
    } else if (itemType === 'object') {
      return accum
        .concat(getAllItemPathsInternal(item, `${parentPath}${itemPathParts}/`, filterItemType))
        .concat(filterItemType === 'object' ? `${parentPath}${itemPathParts}` : []);
    }
    return accum;
  }, []);
}

export default function getAllItemPaths(items, parentPath = '/', filterItemType = 'object') {
  return getAllItemPathsInternal(items, parentPath, filterItemType)
    .concat(filterItemType === 'object' ? '/' : [])
    .sort(arraySort);
}
