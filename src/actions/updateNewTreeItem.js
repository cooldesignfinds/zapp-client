export default function updateNewTreeItem(paneIndex, itemPath, itemValue) {
  return {
    type: 'UPDATE_NEW_TREE_ITEM',
    itemPath,
    itemValue,
    paneIndex
  };
}
